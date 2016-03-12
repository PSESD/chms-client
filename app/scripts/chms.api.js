'use strict';

export class BaseCHMSApi {
  constructor(app, apiName, version) {
    this._loadedPromise = null;
    this.apiName = apiName;
    this.version = version;
    this.app = app;
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
