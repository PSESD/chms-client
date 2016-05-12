'use strict';
var $ = require('jquery');
var jQuery = $;
// require('backbone-jsonapi')(Backbone, _);

export class CHMSAppEngine {
  constructor(app) {
    this._loadedPromise = null;
    this.app = app;
  }

  determineSection(context) {
    var pages = this.pages;
    if (pages[context.route] !== undefined) {
      var section = false;
      if (pages[context.route].section !== undefined) {
        section = pages[context.route].section;
      }
      if (!section) {
        section = 'students';
      }
      this.switchSection(context, section);
    } else {
      // console.log("PAGE NOT FOUND FOR CONTEXT?");
    }
  }

  switchSection(context, section) {
    this.updateMenu(context, section);
    switch(context) {
      case 'students':

      break;
      case 'sponsors':

      break;
      case 'admin':

      break;
    }
  }

  updateMenu(context, section) {
    var menu = this.collectMenuItems(section);
    var $menu = $("#main-menu");
    Polymer.dom($menu.get(0)).innerHTML = '';
    var i = 1;
    jQuery.each(menu, function(route, config) {
      var $a = $("<a />", {'href': context.path(route)});
      $("<iron-icon />", {'icon': config.icon}).appendTo($a);
      $("<span />").html(config.label).appendTo($a);
      if (context.route === route) {
        $a.addClass('iron-selected');
      }
      Polymer.dom($menu.get(0)).appendChild($a.get(0));
    });
  }

  collectMenuItems(section) {
    var menu = {};
    var pages = this.pages;
    jQuery.each(pages, function(path, config) {
      if (config.section === section) {
        menu[path] = config;
      }
    });
    return menu;
  }

  handle(context, onSuccess, onError) {
    var pages = this.pages;
    this.determineSection(context);
    if (pages[context.route] !== undefined) {
      this.app.renderPage(pages[context.route].section, pages[context.route].name, pages[context.route].params);
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
    pages['/admin'] = {
      section: 'admin',
      name: 'adminHome',
      available: true,
      icon: 'icons:account-circle',
      label: 'Dashboard'
    };

    pages['/sponsors/:sponsor'] = {
      section: 'sponsors',
      name: 'sponsorHome',
      available: true,
      icon: 'icons:account-circle',
      label: 'Dashboard'
    };

    pages['/sponsors/:sponsor'] = {
      section: 'sponsors',
      name: 'sponsorHome',
      available: true,
      icon: 'icons:account-circle',
      label: 'Dashboard'
    };
    return pages;
  }
}
