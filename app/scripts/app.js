var _ = require('underscore');
// require('../bower_components/hello/dist/hello.min.js');
// require('rsvp');
// require('../bower_components/jquery/dist/jquery.min.js');
require('../../.tmp/scripts/amd.packages');
(function(document) {
  'use strict';

  var app = document.querySelector('#app');
  app.DEBUG = location.search.indexOf('debug') !== -1;
  app.baseUrl = '/';

  require('./app.webcomponents')(app);
  require('./app.components')(app);
  require('./app.events')(app);
})(document);
