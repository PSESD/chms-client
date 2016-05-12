'use strict';
import _ from 'underscore';
import Backbone from 'backbone';
import jQuery from 'jquery';
Backbone.$ = jQuery;

var API_BASE_URL = '/api/hub';

module.exports = function (api) {
  require('backbone-relational');
  require('backbone-relational-jsonapi');
  // console.log(Backbone);
  var BaseModel = Backbone.RelationalModel.extend({
    toJSON: function(options) {
      return {'data': {'type': this.type, 'attributes': _.clone(this.attributes)}};
    }
  });
  var BaseCollection = Backbone.Collection;

  api.collections = {};
  api.models = {};

  var models = {
    'User': {
    }
  };
  jQuery.each(models, function(modelName, settings) {
    var url = settings.url ? settings.url : '/' + modelName.toLowerCase() + 's';
    api.models[modelName] = BaseModel.extend({
      'type': modelName.toLowerCase() + 's'
      // 'url': API_BASE_URL + url
    });
    var ObjectCollection = BaseCollection.extend({
      'url': API_BASE_URL + url,
      'model': api.models[modelName]
    });
    api.collections[modelName] = new ObjectCollection();
  });

  var MeModel = api.models.User.extend({
    'url': API_BASE_URL + '/users/self'
  });
  api.models.Me = new MeModel;

  // api.collections.Users.fetch({
  //   'success': function (collection, response, options) {
  //     console.log(collection.pluck('first_name'));
  //     console.log(['done', collection, response, options])
  //   },
  //   'error': function(collection, response, options) {
  //     console.log(['error', collection, response, options]);
  //   }
  // });
};
