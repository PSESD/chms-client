'use strict';
var $ = require('jquery');
var jQuery = $;
// require('backbone-jsonapi')(Backbone, _);

export class CHMSAppEngine {
  constructor(app) {
    this._loadedPromise = null;
    this.app = app;
  }

  handle(context, onSuccess, onError) {
    var pages = this.pages;
    if (pages[context.path] !== undefined) {
      this.app.renderPage(pages[context.path].section, pages[context.path].name, pages[context.path].params);
      onSuccess();
    } else {
      onError();
    }
  }

  get pages() {
    var pages = {};
    jQuery.each(this.allPages, function(path, page) {
      var isAvailable = page.available || true;
      if (isAvailable) {
        pages[path] = page;
      }
    });
    return pages;
  }

  get allPages() {
    var pages = {};
    pages['/'] = {
      section: 'students',
      name: 'transcript',
      available: true,
      icon: 'home',
      label: 'Transcript'
    };
    pages['/permissions'] = {
      section: 'students',
      name: 'permissions',
      available: true,
      icon: 'icons:visibility',
      label: 'Permissions'
    };
    pages['/profile'] = {
      section: 'students',
      name: 'profile',
      available: true,
      icon: 'icons:account-circle',
      label: 'Profile'
    };
    return pages;
  }
}
