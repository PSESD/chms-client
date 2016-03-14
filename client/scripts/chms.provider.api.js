'use strict';
import {BaseCHMSApi} from './chms.api';

export class CHMSProviderApi extends BaseCHMSApi {
  constructor(app) {
    super(app, 'chms', 'v1');
    this._FROM_HEADER_REGEX = new RegExp(/"?(.*?)"?\s?<(.*)>/);
  }
  fetchMe(q) {
    return this.init().then(api => {
      console.log('fetch me!');
    });
  }
}
