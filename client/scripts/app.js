(function(document) {
  'use strict';

  var app = document.querySelector('#app');
  app.DEBUG = location.search.indexOf('debug') !== -1;
  app.baseUrl = '/';
  require('./app.webcomponents')(app);
  require('./app.components')(app);
  require('./app.events')(app);
})(document);
