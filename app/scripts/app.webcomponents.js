'use strict';
module.exports = function (app) {
  // Conditionally load webcomponents polyfill (if needed).
  var webComponentsSupported = (
      'registerElement' in document &&
      'import' in document.createElement('link') &&
      'content' in document.createElement('template'));

  if (!webComponentsSupported) {
    var script = document.createElement('script');
    script.async = true;
    script.src = '/bower_components/webcomponentsjs/webcomponents-lite.min.js';
    script.onload = finishLazyLoadingImports;
    document.head.appendChild(script);
  } else {
    finishLazyLoadingImports();
  }

  function finishLazyLoadingImports() {
    // Use native Shadow DOM if it's available in the browser.
    window.Polymer = window.Polymer || {dom: 'shadow'};

    var onImportLoaded = function() {
      var loadContainer = document.getElementById('splash');
      loadContainer.addEventListener('transitionend', e => {
        loadContainer.parentNode.removeChild(loadContainer); // IE 10 doesn't support el.remove()
      });

      document.body.classList.remove('loading');
    };

    // crbug.com/504944 - readyState never goes to complete until Chrome 46.
    // crbug.com/505279 - Resource Timing API is not available until Chrome 46.
    // var link = document.querySelector('#bundle');
    // if (link.import && link.import.readyState === 'complete') {
    //   onImportLoaded();
    // } else {
    //   link.addEventListener('load', onImportLoaded);
    // }
  }
};
