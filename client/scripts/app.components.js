'use strict';
import {CHMSHubApi} from './chms.hub.api';
import {CHMSProviderApi} from './chms.provider.api';

module.exports = function (app) {

  console.log('loading components');
  app.config = require('../data/config');
  app.apis = {};
  app.apis.hub = new CHMSHubApi(app);
  //app.apis.provider = new CHMSProviderApi(app);

  app.apis.hub.fetchMe();

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
