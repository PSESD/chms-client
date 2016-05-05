'use strict';
import {CHMSAppEngine} from './app.engine';
import {CHMSHubApi} from './chms.hub.api';
import {CHMSProviderApi} from './chms.provider.api';

module.exports = function (app) {

  console.log('loading components');
  app.config = require('../data/config');
  app.engine = new CHMSAppEngine(app);
  app.apis = {};
  app.apis.hub = new CHMSHubApi(app);
  //app.apis.provider = new CHMSProviderApi(app);
  console.log(['app', app]);
  var fetchMe = app.apis.hub.fetchMe().then(function(result) {
    console.log(['fetchMeSuccess', result.attributes]);
      var fetchAll = app.apis.hub.all('User').then(function(result) {
        console.log(['fetchAllSuccess', result]);
      },
      function(result) {
        console.log(['fetchAllFailed', result]);
      });
  },
  function(result) {
    console.log(['fetchMeFailed', result]);
  });
  console.log(['fetchMePromise', fetchMe]);

  // Scroll page to top and expand header
  app.scrollPageToTop = function() {
    app.$.headerPanelMain.scrollToTop(true);
  };

  app.closeDrawer = function() {
    app.$.paperDrawerPanel.closeDrawer();
  };

  app.displayInstalledToast = function() {
    // Check to make sure caching is actually enabled—it won't be in the dev environment.
    if (!Polymer.dom(document).querySelector('platinum-sw-cache').disabled) {
      Polymer.dom(document).querySelector('#caching-complete').show();
    }
  };
};
