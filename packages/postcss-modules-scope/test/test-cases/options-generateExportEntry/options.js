module.exports = {
  generateExportEntry: function(name, scopedName) {
    return {
      key: `_${name}_`,
      value: `_${scopedName}_`
    }
  },
};
