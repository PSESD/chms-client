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

  generatePath(context, route) {
    for (var k in context.params) {
      if (k != 0) {
        route = route.replace(':' + k, context.params[k]);
      }
    }
    return route;
  }

  updateMenu(context, section) {
    var _this = this;
    var menu = this.collectMenuItems(section);
    var $menu = $("#main-menu");
    Polymer.dom($menu.get(0)).innerHTML = '';
    var i = 1;
    console.log(['menu', menu]);
    jQuery.each(menu, function(route, config) {
      var $a = $("<a />", {'href': _this.generatePath(context, route)});
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
      name: 'student-transcript',
      available: true,
      icon: 'icons:home',
      label: 'Transcript'
    };
    pages['/permissions'] = {
      section: 'students',
      name: 'user-permissions',
      available: true,
      icon: 'icons:visibility',
      label: 'Permissions'
    };
    pages['/profile'] = {
      section: 'students',
      name: 'user-profile',
      available: true,
      icon: 'icons:account-circle',
      label: 'Profile'
    };
    pages['/admin'] = {
      section: 'admin-home',
      name: 'home',
      available: true,
      icon: 'icons:home',
      label: 'Dashboard'
    };

    pages['/sponsors/:sponsor'] = {
      section: 'sponsors',
      name: 'sponsor-home',
      available: true,
      icon: 'icons:home',
      label: 'Dashboard'
    };

    pages['/sponsors/:sponsor/classes'] = {
      section: 'sponsors',
      name: 'class-list',
      available: true,
      icon: 'icons:account-circle',
      label: 'Classes'
    };

    pages['/sponsors/:sponsor/classes/:class'] = {
      section: 'classes',
      name: 'view-class',
      available: true,
      icon: 'icons:class',
      label: 'Class Dashboard'
    };

    pages['/sponsors/:sponsor/classes/:class/records'] = {
      section: 'classes',
      name: 'class-records',
      available: true,
      icon: 'icons:assignment-ind',
      label: 'Records'
    };

    pages['/sponsors/:sponsor/classes/:class/evaluation-responses'] = {
      section: 'classes',
      name: 'class-eval-responses',
      available: true,
      icon: 'icons:question-answer',
      label: 'Evaluation Responses'
    };

    pages['/sponsors/:sponsor/evaluations'] = {
      section: 'sponsors',
      name: 'sponsor-evaluations',
      available: true,
      icon: 'icons:question-answer',
      label: 'Evaluations'
    };
    pages['/sponsors/:sponsor/locations'] = {
      section: 'sponsors',
      name: 'sponsor-locations',
      available: true,
      icon: 'icons:flag',
      label: 'Locations'
    };

    pages['/sponsors/:sponsor/topics'] = {
      section: 'sponsors',
      name: 'sponsor-topics',
      available: true,
      icon: 'icons:group-work',
      label: 'Topics'
    };

    return pages;
  }
}
