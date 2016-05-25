'use strict';
var $ = require('jquery');
var jQuery = $;
import {BaseModel} from './base';
// require('backbone-jsonapi')(Backbone, _);

export class MeModel extends BaseModel {
  hasAccess (level) {
    if (this.meta.access === undefined || this.meta.access[level] === undefined) {
      return false;
    }
    return this.meta.access[level];
  }
};
