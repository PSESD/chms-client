'use strict';
var hello = require('../bower_components/hello/dist/hello.min.js');
require('./chms.hello');
import {CHMSHubApi} from './chms.hub.api';
import {CHMSProviderApi} from './chms.provider.api';

module.exports = function (app) {
  console.log('loading components');
  app.config = require('../data/config');
  app.apis = {};
  app.apis.hub = new CHMSHubApi(app);
  app.apis.provider = new CHMSProviderApi(app);

  app.apis.hub.fetchMe();
  hello.init({
    chmsauth: 'cd66c45b-a2bc-4c5c-8b24-5dbcd781a927'
  },
  {
    default_service: 'chmsauth',
    redirect_uri: '/'
  });

  app.authenticate = function(ctx, next) {
      console.log("AUTH!");
      var auth = hello('chmsauth');
      var session = hello.getAuthResponse();
      console.log(session);
      if (session) {
        next();
        return;
      }
      // return;
      var promise = auth.login({display: 'page'}).then(function() {
	         console.log("NEXT!");
           next();
      });
      console.log(promise);
  };

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
