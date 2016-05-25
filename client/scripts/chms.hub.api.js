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
    return this.api.find('me', 'self');
  }
}
