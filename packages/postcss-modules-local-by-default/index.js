var postcss = require('postcss');
var Tokenizer = require('css-selector-tokenizer');

function normalizeNodeArray(nodes) {
  var array = [];
  nodes.forEach(function(x) {
    if(Array.isArray(x)) {
      normalizeNodeArray(x).forEach(function(item) {
        array.push(item);
      });
    } else if(x) {
      array.push(x);
    }
  });
  if(array.length > 0 && array[array.length - 1].type === "spacing") {
    array.pop();
  }
  return array;
}

function localizeNode(node, context) {
  if(context.ignoreNextSpacing && node.type !== "spacing") {
    throw new Error("Missing whitespace after :" + context.ignoreNextSpacing);
  }
  if(context.enforceNoSpacing && node.type === "spacing") {
    throw new Error("Missing whitespace before :" + context.enforceNoSpacing);
  }

  var newNodes;
  switch(node.type) {
    case "selectors":
      var resultingGlobal;
      context.locals = true;
      newNodes = node.nodes.map(function(n) {
        var nContext = {
          global: context.global,
          lastWasSpacing: true,
          locals: false
        };
        n = localizeNode(n, nContext);
        if(typeof resultingGlobal === "undefined") {
          resultingGlobal = nContext.global;
        } else if(resultingGlobal !== nContext.global) {
          throw new Error("Inconsistent rule global/local result in rule '" +
            Tokenizer.stringify(node) + "' (multiple selectors must result in the same mode for the rule)");
        }
        if(!nContext.locals) {
          context.locals = false;
        }
        return n;
      });
      context.global = resultingGlobal;
      node = Object.create(node);
      node.nodes = normalizeNodeArray(newNodes);
      break;

    case "selector":
      newNodes = node.nodes.map(function(n) {
        return localizeNode(n, context);
      });
      node = Object.create(node);
      node.nodes = normalizeNodeArray(newNodes);
      break;

    case "spacing":
      if(context.ignoreNextSpacing) {
        context.ignoreNextSpacing = false;
        context.lastWasSpacing = false;
        context.enforceNoSpacing = false;
        return null;
      }
      context.lastWasSpacing = true;
      return node;

    case "pseudo-class":
      if(node.name === "local" || node.name === "global") {
        if(context.inside) {
          throw new Error("A :" + node.name + " is not allowed inside of a :" + context.inside + "(...)");
        }
        context.ignoreNextSpacing = context.lastWasSpacing ? node.name : false;
        context.enforceNoSpacing = context.lastWasSpacing ? false : node.name;
        context.global = (node.name === "global");
        return null;
      }
      break;

    case "nested-pseudo-class":
      var subContext;
      if(node.name === "local" || node.name === "global") {
        if(context.inside) {
          throw new Error("A :" + node.name + "(...) is not allowed inside of a :" + context.inside + "(...)");
        }
        subContext = {
          global: (node.name === "global"),
          inside: node.name,
          locals: false
        };
        node = node.nodes.map(function(n) {
          return localizeNode(n, subContext);
        });
        // don't leak spacing
        node[0].before = undefined;
        node[node.length - 1].after = undefined;
        if(subContext.locals) {
          context.locals = true;
        }
      } else {
        subContext = {
          global: context.global,
          inside: context.inside,
          lastWasSpacing: true,
          locals: false
        };
        newNodes = node.nodes.map(function(n) {
          return localizeNode(n, subContext);
        });
        node = Object.create(node);
        node.nodes = normalizeNodeArray(newNodes);
        if(subContext.locals) {
          context.locals = true;
        }
      }
      break;

    case "id":
    case "class":
      if(!context.global) {
        node = {
          type: "nested-pseudo-class",
          name: "local",
          nodes: [node]
        };
        context.locals = true;
      }
      break;
  }

  // reset context
  context.lastWasSpacing = false;
  context.ignoreNextSpacing = false;
  context.enforceNoSpacing = false;
  return node;
}

function localizeDecl(decl) {
  if(typeof decl.prop === "string" && /animation(-name)?/.test(decl.prop)) {
    decl.value = decl.value.replace(/(^|,)(\s*)(\w+)/g, "$1$2:local($3)"); // TODO
  }
}

module.exports = postcss.plugin('postcss-modules-local-by-default', function (options) {
  if(options && options.mode) {
    if(options.mode !== "global" && options.mode !== "local" && options.mode !== "pure") {
      throw new Error("options.mode must be either 'global', 'local' or 'pure' (default 'local')");
    }
  }
  var pureMode = options && options.mode === "pure";
  var globalMode = options && options.mode === "global";
  return function(css) {
    css.eachAtRule(function(atrule) {
      if(/keyframes$/.test(atrule.name)) {
        var globalMatch = /^\s*:global\s*\((.+)\)\s*$/.exec(atrule.params);
        var localMatch = /^\s*:local\s*\((.+)\)\s*$/.exec(atrule.params);
        if(globalMatch) {
          if(pureMode) {
            throw new Error("@keyframes :global(...) is not allowed in pure mode");
          }
          atrule.params = globalMatch[1];
        } else if(localMatch) {
          atrule.params = localMatch[0];
        } else if(!globalMode) {
          atrule.params = ":local(" + atrule.params + ")";
        }
      }
    });
    css.eachRule(function(rule) {
      var selector = Tokenizer.parse(rule.selector);
      var context = {
        global: globalMode,
        locals: false
      };
      var newSelector = localizeNode(selector, context);
      if(pureMode && !context.locals) {
        throw new Error("Selector '" + Tokenizer.stringify(selector) + "' is not pure " +
          "(pure selectors must contain at least one local class or id)");
      }
      if(!context.global) {
        rule.nodes.forEach(localizeDecl);
      }
      rule.selector = Tokenizer.stringify(newSelector);
    });
  };
});
