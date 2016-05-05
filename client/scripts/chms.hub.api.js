'use strict';
import {BaseCHMSApi} from './chms.api';

export class CHMSHubApi extends BaseCHMSApi {
  constructor(app) {
    super(app, 'chms', 'v1');
    this._FROM_HEADER_REGEX = new RegExp(/"?(.*?)"?\s?<(.*)>/);
  }
  _loadSchema(api) {
    return require('./schemas/hub.schema.js')(api);
  }
  _adapterConfig() {
    return {
        'base': '/api/hub'
    };
  }
  all(model) {
      return new Promise((resolve, reject) => {
      });
  }
  fetchMe(q) {
    if (this.api.models.Me.isNew) {
      return new Promise((resolve, reject) => {
        this.api.models.Me.fetch({
          'success': function (model, response, options) {
            resolve(model);
          },
          'error': function (model, response, options) {
            reject(model);
          }
        });
      });
    }
    return Promise.resolve(this.api.models.Me);
  }
}
