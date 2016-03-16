'use strict';
var $ = require('jquery');
var jQuery = $;
// require('backbone-jsonapi')(Backbone, _);

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
    if (this._api === undefined) {
      this._api = this._loadApi();
    }
    return this._api;
  }

  _loadApi() {
    var api = {};
    this._loadSchema(api);
    console.log(['api', api]);
    return api;
  }

  _loadSchema(api) {
    return {};
  }

  _adapterConfig() {
    return {};
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
