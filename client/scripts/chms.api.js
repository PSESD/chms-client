'use strict';
var $ = require('jquery');
var jQuery = $;

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
    var api = this._loadSchema();
    return api;
  }

  _loadSchema(api) {
    return {};
  }

  _adapterConfig() {
    return {};
  }


  get(modelName, id) {
    if (this.api.collections[modelName] === undefined) {
      return Promise.reject(false);
    }
    if (this.api.collections[modelName].get(id) !== undefined) {
      return Promise.resolve(this.api.collections[modelName].get(id));
    }
    return new Promise((resolve, reject) => {
      var _this = this;
      var url = this.api.collections[modelName].url +"/"+ id;
      var model = new this.api.collections[modelName].model().fetch({
        'url': url,
        'success': function (model, response, options) {
          _this.api.collections[modelName].add(model, {});
          resolve(model);
        },
        'error': function (model, response, options) {
          reject(model);
        }
      });
    });

  }
}
