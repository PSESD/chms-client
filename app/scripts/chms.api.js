'use strict';

class BaseCHMSApi {

  constructor(apiName, version) {
    this._loadedPromise = null;
    this.apiName = apiName;
    this.version = version;
  }

  get loaded() {
    return !!(this.api);
  }

  get api() {
    return true;
  }

  // Loads the  API and returns a promise.
  init() {
    // Return the API if it's already loaded.
    if (this.loaded) {
      return Promise.resolve(this.api);
    }

    // Ensure we only load the client lib once. Subscribers will race for it.
    if (!this._loadedPromise) {
      this._loadedPromise = new Promise((resolve, reject) => {
        resolve(this.api);
      });
    }

    return this._loadedPromise;
  }
}

export class CHMSApi extends BaseCHMSApi {
  constructor() {
    super('chms', 'v1');
    this._FROM_HEADER_REGEX = new RegExp(/"?(.*?)"?\s?<(.*)>/);
  }
  fetchMe(q) {
    return this.init().then(api => {
      console.log('fetch me!');
    });
  }
}
