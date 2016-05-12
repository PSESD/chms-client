'use strict';
module.exports = function () {
  Context.prototype.path = function(route) {
    return route + 'context';
  };
};
