'use strict';

const postcss = require('postcss');
const Tokenizer = require('css-selector-tokenizer');
const valueParser = require('postcss-value-parser');

function normalizeNodeArray(nodes) {
  const array = [];
  nodes.forEach(function(x) {
    if (Array.isArray(x)) {
      normalizeNodeArray(x).forEach(function(item) {
        array.push(item);
      });
    } else if (x) {
      array.push(x);
    }
  });

  if (array.length > 0 && array[array.length - 1].type === 'spacing') {
    array.pop();
  }
  return array;
}

function localizeNode(node, context) {
  if (context.ignoreNextSpacing && node.type !== 'spacing') {
    throw new Error('Missing whitespace after :' + context.ignoreNextSpacing);
  }
  if (context.enforceNoSpacing && node.type === 'spacing') {
    throw new Error('Missing whitespace before :' + context.enforceNoSpacing);
  }

  let newNodes;
  switch (node.type) {
    case 'selectors':
      let resultingGlobal;
      context.hasPureGlobals = false;
      newNodes = node.nodes.map(function(n) {
        const nContext = {
          global: context.global,
          lastWasSpacing: true,
          hasLocals: false,
          explicit: false
        };
        n = localizeNode(n, nContext);
        if (typeof resultingGlobal === 'undefined') {
          resultingGlobal = nContext.global;
        } else if (resultingGlobal !== nContext.global) {
          throw new Error(
            'Inconsistent rule global/local result in rule "' +
              Tokenizer.stringify(node) +
              '" (multiple selectors must result in the same mode for the rule)'
          );
        }
        if (!nContext.hasLocals) {
          context.hasPureGlobals = true;
        }
        return n;
      });
      context.global = resultingGlobal;
      node = Object.create(node);
      node.nodes = normalizeNodeArray(newNodes);
      break;

    case 'selector':
      newNodes = node.nodes.map(function(n) {
        return localizeNode(n, context);
      });
      node = Object.create(node);
      node.nodes = normalizeNodeArray(newNodes);
      break;

    case 'spacing':
      if (context.ignoreNextSpacing) {
        context.ignoreNextSpacing = false;
        context.lastWasSpacing = false;
        context.enforceNoSpacing = false;
        return null;
      }
      context.lastWasSpacing = true;
      return node;

    case 'pseudo-class':
      if (node.name === 'local' || node.name === 'global') {
        if (context.inside) {
          throw new Error(
            'A :' +
              node.name +
              ' is not allowed inside of a :' +
              context.inside +
              '(...)'
          );
        }
        context.ignoreNextSpacing = context.lastWasSpacing ? node.name : false;
        context.enforceNoSpacing = context.lastWasSpacing ? false : node.name;
        context.global = node.name === 'global';
        context.explicit = true;
        return null;
      }
      break;

    case 'nested-pseudo-class':
      let subContext;
      if (node.name === 'local' || node.name === 'global') {
        if (context.inside) {
          throw new Error(
            'A :' +
              node.name +
              '(...) is not allowed inside of a :' +
              context.inside +
              '(...)'
          );
        }
        subContext = {
          global: node.name === 'global',
          inside: node.name,
          hasLocals: false,
          explicit: true
        };
        node = node.nodes.map(function(n) {
          return localizeNode(n, subContext);
        });
        // don't leak spacing
        node[0].before = undefined;
        node[node.length - 1].after = undefined;
      } else {
        subContext = {
          global: context.global,
          inside: context.inside,
          lastWasSpacing: true,
          hasLocals: false,
          explicit: context.explicit
        };
        newNodes = node.nodes.map(function(n) {
          return localizeNode(n, subContext);
        });
        node = Object.create(node);
        node.nodes = normalizeNodeArray(newNodes);
      }
      if (subContext.hasLocals) {
        context.hasLocals = true;
      }
      break;

    case 'id':
    case 'class':
      if (!context.global) {
        node = {
          type: 'nested-pseudo-class',
          name: 'local',
          nodes: [node]
        };
        context.hasLocals = true;
      }
      break;
  }

  // reset context
  context.lastWasSpacing = false;
  context.ignoreNextSpacing = false;
  context.enforceNoSpacing = false;
  return node;
}

function localizeDeclNode(node, context) {
  switch (node.type) {
    case 'word':
      if (context.localizeNextItem) {
        node.value = ':local(' + node.value + ')';
        context.localizeNextItem = false;
      }
      break;

    case 'function':
      if (context.options &&  context.options.rewriteUrl && node.value.toLowerCase() === 'url') {
        node.nodes.map((nestedNode) => {
          if (nestedNode.type !== 'string' && nestedNode.type !== 'word') {
            return;
          }

          let newUrl = context.options.rewriteUrl(context.global, nestedNode.value);

          switch (nestedNode.type) {
            case 'string':
              if (nestedNode.quote === '\'') {
                newUrl = newUrl.replace(/(\\)/g, '\\$1').replace(/'/g, '\\\'')
              }

              if (nestedNode.quote === '"') {
                newUrl = newUrl.replace(/(\\)/g, '\\$1').replace(/"/g, '\\"')
              }

              break;
            case 'word':
              newUrl = newUrl.replace(/("|'|\)|\\)/g, '\\$1');
              break;
          }

          nestedNode.value = newUrl;
        });
      }
      break;
  }
  return node;
}

function isWordAFunctionArgument(wordNode, functionNode) {
  return functionNode
    ? functionNode.nodes.some(functionNodeChild => functionNodeChild.sourceIndex === wordNode.sourceIndex)
    : false
}

function localizeAnimationShorthandDeclValues(decl, context) {
  const validIdent = /^-?[_a-z][_a-z0-9-]*$/i;

  /*
  The spec defines some keywords that you can use to describe properties such as the timing
  function. These are still valid animation names, so as long as there is a property that accepts
  a keyword, it is given priority. Only when all the properties that can take a keyword are
  exhausted can the animation name be set to the keyword. I.e.

  animation: infinite infinite;

  The animation will repeat an infinite number of times from the first argument, and will have an
  animation name of infinite from the second.
  */
  const animationKeywords = {
    $alternate: 1,
    '$alternate-reverse': 1,
    $backwards: 1,
    $both: 1,
    $ease: 1,
    '$ease-in': 1,
    '$ease-in-out': 1,
    '$ease-out': 1,
    $forwards: 1,
    $infinite: 1,
    $linear: 1,
    $none: Infinity, // No matter how many times you write none, it will never be an animation name
    $normal: 1,
    $paused: 1,
    $reverse: 1,
    $running: 1,
    '$step-end': 1,
    '$step-start': 1,
    $initial: Infinity,
    $inherit: Infinity,
    $unset: Infinity
  };

  const didParseAnimationName = false;
  let parsedAnimationKeywords = {};
  let stepsFunctionNode = null;
  const valueNodes = valueParser(decl.value).walk((node) => {
    /* If div-token appeared (represents as comma ','), a possibility of an animation-keywords should be reflesh. */
    if (node.type === 'div') {
      parsedAnimationKeywords = {};
    }
    if (node.type === 'function' && node.value.toLowerCase() === 'steps') {
      stepsFunctionNode = node;
    }
    const value =
      node.type === 'word' && !isWordAFunctionArgument(node, stepsFunctionNode)
        ? node.value.toLowerCase()
        : null;

    let shouldParseAnimationName = false;

    if (!didParseAnimationName && value && validIdent.test(value)) {
      if ('$' + value in animationKeywords) {
        parsedAnimationKeywords['$' + value] =
          '$' + value in parsedAnimationKeywords
            ? parsedAnimationKeywords['$' + value] + 1
            : 0;

        shouldParseAnimationName =
          parsedAnimationKeywords['$' + value] >=
          animationKeywords['$' + value];
      } else {
        shouldParseAnimationName = true;
      }
    }

    const subContext = {
      options: context.options,
      global: context.global,
      localizeNextItem: shouldParseAnimationName && !context.global
    };
    return localizeDeclNode(node, subContext);
  });

  decl.value = valueNodes.toString();
}

function localizeDeclValues(localize, decl, context) {
  const valueNodes = valueParser(decl.value);
  valueNodes.walk((node, index, nodes) => {
    const subContext = {
      options: context.options,
      global: context.global,
      localizeNextItem: localize && !context.global
    };
    nodes[index] = localizeDeclNode(node, subContext);
  });
  decl.value = valueNodes.toString();
}

function localizeDecl(decl, context) {
  const isAnimation = /animation$/i.test(decl.prop);

  if (isAnimation) {
    return localizeAnimationShorthandDeclValues(decl, context);
  }

  const isAnimationName = /animation(-name)?$/i.test(decl.prop);

  if (isAnimationName) {
    return localizeDeclValues(true, decl, context);
  }

  const hasUrl = /url\(/i.test(decl.value);

  if (hasUrl) {
    return localizeDeclValues(false, decl, context);
  }
}

module.exports = postcss.plugin('postcss-modules-local-by-default', function(
  options
) {
  if (typeof options !== 'object') {
    options = {}; // If options is undefined or not an object the plugin fails
  }
  if (options && options.mode) {
    if (
      options.mode !== 'global' &&
      options.mode !== 'local' &&
      options.mode !== 'pure'
    ) {
      throw new Error(
        'options.mode must be either "global", "local" or "pure" (default "local")'
      );
    }
  }
  const pureMode = options && options.mode === 'pure';
  const globalMode = options && options.mode === 'global';
  return function(css) {
    css.walkAtRules(function(atrule) {
      if (/keyframes$/i.test(atrule.name)) {
        const globalMatch = /^\s*:global\s*\((.+)\)\s*$/.exec(atrule.params);
        const localMatch = /^\s*:local\s*\((.+)\)\s*$/.exec(atrule.params);
        let globalKeyframes = globalMode;
        if (globalMatch) {
          if (pureMode) {
            throw atrule.error(
              '@keyframes :global(...) is not allowed in pure mode'
            );
          }
          atrule.params = globalMatch[1];
          globalKeyframes = true;
        } else if (localMatch) {
          atrule.params = localMatch[0];
          globalKeyframes = false;
        } else if (!globalMode) {
          atrule.params = ':local(' + atrule.params + ')';
        }
        atrule.walkDecls(function(decl) {
          localizeDecl(decl, {
            options: options,
            global: globalKeyframes
          });
        });
      } else if (atrule.nodes) {
        atrule.nodes.forEach(function(decl) {
          if (decl.type === 'decl') {
            localizeDecl(decl, {
              options: options,
              global: globalMode
            });
          }
        });
      }
    });
    css.walkRules(function(rule) {
      if (
        rule.parent.type === 'atrule' &&
        /keyframes$/i.test(rule.parent.name)
      ) {
        // ignore keyframe rules
        return;
      }
      const selector = Tokenizer.parse(rule.selector);
      const context = {
        options: options,
        global: globalMode,
        hasPureGlobals: false
      };
      let newSelector;
      try {
        newSelector = localizeNode(selector, context);
      } catch (e) {
        throw rule.error(e.message);
      }
      if (pureMode && context.hasPureGlobals) {
        throw rule.error(
          'Selector "' +
            Tokenizer.stringify(selector) +
            '" is not pure ' +
            '(pure selectors must contain at least one local class or id)'
        );
      }
      // Less-syntax mixins parse as rules with no nodes
      if (rule.nodes) {
        rule.nodes.forEach(function(decl) {
          localizeDecl(decl, context);
        });
      }
      rule.selector = Tokenizer.stringify(newSelector);
    });
  };
});
