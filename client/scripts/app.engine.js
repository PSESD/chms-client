'use strict';
var $ = require('jquery');
var jQuery = $;
// require('backbone-jsonapi')(Backbone, _);

export class CHMSAppEngine {
  constructor(app) {
    this._loadedPromise = null;
    this.app = app;
  }

  get me() {
    var _this = this;
    if (this._me === undefined) {
      this._me = new Promise((resolve, reject) => {
        _this.app.apis.hub.fetchMe().then(function(result) {
          console.log(['fetchMeSuccess', result]);
          resolve(result);
        },
        function(result) {
          reject(false);
          console.log(['fetchMeFailed', result]);
        });
      });
    }
    return this._me;
  }

  determineSection(context) {
    var _this = this;
    return this.me.then(function(me) {
      context.me = me;
      var pages = _this.pages(context);
      if (pages[context.route] !== undefined) {
        var section = false;
        if (pages[context.route].section !== undefined) {
          section = pages[context.route].section;
        }
        if (!section) {
          section = 'students';
        }
        _this.switchSection(context, section);
      } else {
        // console.log("PAGE NOT FOUND FOR CONTEXT?");
      }
    });
  }

  switchSection(context, section) {
    this.updateMenu(context, section);
    switch(context) {
      case 'students':

      break;
      case 'providers':

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
    var menu = this.collectMenuItems(context, section);
    var contextMenu = this.collectContextMenuItems(context, section);
    var $menu = $("#main-menu");
    var $menuBaseArea = $menu.find('.base-area');
    var $menuPrivilegedArea = $menu.find('.privileged-area');
    var hasPrivilege = false;

    Polymer.dom($menuBaseArea.get(0)).innerHTML = '';
    Polymer.dom($menuPrivilegedArea.get(0)).innerHTML = '';
    var i = 1;
    jQuery.each(menu, function(route, config) {
      var $a = $("<a />", {'href': _this.generatePath(context, route)});
      $("<iron-icon />", {'icon': config.icon}).appendTo($a);
      $("<span />").html(config.label).appendTo($a);
      if (context.route === route) {
        $a.addClass('iron-selected');
      }
      Polymer.dom($menuBaseArea.get(0)).appendChild($a.get(0));
    });
    jQuery.each(contextMenu, function(route, config) {
      var $a = $("<a />", {'href': _this.generatePath(context, route)});
      $("<iron-icon />", {'icon': config.icon}).appendTo($a);
      $("<span />").html(config.label).appendTo($a);
      if (context.route === route) {
        $a.addClass('iron-selected');
      }
      hasPrivilege = true;
      Polymer.dom($menuPrivilegedArea.get(0)).appendChild($a.get(0));
    });
    if (hasPrivilege) {
      $menuPrivilegedArea.addClass('active');
    } else {
      $menuPrivilegedArea.removeClass('active');
    }
    console.log(context);
  }

  collectContextMenuItems(context, section) {
    var menu = {};
    var pages = this.contexts(context);
    jQuery.each(pages, function(path, config) {
      if (config.section !== section) {
        menu[path] = config;
      }
    });
    return menu;
  }

  collectMenuItems(context, section) {
    var menu = {};
    var pages = this.pages(context);
    jQuery.each(pages, function(path, config) {
      if (config.section === section) {
        menu[path] = config;
      }
    });
    return menu;
  }

  handle(context, onSuccess, onError) {
    var _this = this;
    return this.me.then(function(me) {
    console.log(['handle', me]);
      window.me = me;
      context.me = me;
      var pages = _this.pages(context);
      _this.determineSection(context);
      if (pages[context.route] !== undefined) {
        _this.app.renderPage(pages[context.route].section, pages[context.route].name, pages[context.route].params);
        onSuccess();
      } else {
        onError();
      }
    }, function(result) {
      console.log(["ME FAILED!", result]);
      onError();
    });
  }

  pages(context) {
    var pages = {};
    jQuery.each(this.allPages, function(path, page) {
      var isAvailable = page.available || true;
      if (typeof isAvailable === 'function') {
        isAvailable = isAvailable(context);
      }
      if (isAvailable === true) {
        pages[path] = page;
      }
    });
    return pages;
  }

  contexts(context) {
    var pages = {};
    jQuery.each(this.allContexts, function(path, page) {
      var isAvailable = page.available || true;
      if (typeof isAvailable === 'function') {
        isAvailable = isAvailable(context);
      }
      if (isAvailable === true) {
        pages[path] = page;
      }
    });
    return pages;
  }

  get allContexts() {
    var pages = {};

    pages['/transcript'] = {
      section: 'students',
      name: 'students',
      available: true,
      icon: 'icons:face',
      label: 'Student Portal'
    };

    pages['/admin'] = {
      section: 'admin',
      name: 'admin',
      available: function(context) {
        return context.me.hasAccess('admin');
      },
      icon: 'icons:settings',
      label: 'Admin'
    };

    pages['/providers'] = {
      section: 'providers',
      name: 'admin',
      available: function(context) {
        return context.me.hasAccess('provider_access');
      },
      icon: 'hardware:device-hub',
      label: 'Providers'
    };

    // pages['/organizations'] = {
    //   section: 'organizations',
    //   name: 'organizations',
    //   available: function(context) {
    //     return context.me.meta.access.organization_access;
    //   },
    //   icon: 'icons:home',
    //   label: 'District Access'
    // };


    return pages;
  }

  get allPages() {
    var pages = {};
    pages['/transcript'] = {
      section: 'students',
      name: 'student-transcript',
      available: true,
      icon: 'icons:assignment-ind',
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
      section: 'admin',
      name: 'home',
      available: function(context) {
        return context.me.hasAccess('admin');
      },
      icon: 'icons:settings',
      label: 'Admin Dashboard'
    };

    pages['/admin/provider-hubs'] = {
      section: 'admin',
      name: 'provider-hubs',
      available: function(context) {
        return context.me.hasAccess('admin');
      },
      icon: 'hardware:device-hub',
      label: 'Provider Hubs'
    };

    pages['/admin/providers'] = {
      section: 'admin',
      name: 'providers',
      available: function(context) {
        return context.me.hasAccess('admin');
      },
      icon: 'social:domain',
      label: 'Providers'
    };

    pages['/admin/users'] = {
      section: 'admin',
      name: 'users',
      available: function(context) {
        return context.me.hasAccess('admin');
      },
      icon: 'icons:supervisor-account',
      label: 'Users'
    };


    pages['/providers/:provider'] = {
      section: 'providers',
      name: 'provider-home',
      available: function(context) {
        return context.me.hasAccess('provider_access');
      },
      icon: 'icons:home',
      label: 'Dashboard'
    };

    pages['/providers/:provider/classes'] = {
      section: 'providers',
      name: 'class-list',
      available: function(context) {
        return context.me.hasAccess('provider_access');
      },
      icon: 'icons:account-circle',
      label: 'Classes'
    };

    pages['/providers/:provider/classes/:class'] = {
      section: 'classes',
      name: 'view-class',
      available: function(context) {
        return context.me.hasAccess('provider_access');
      },
      icon: 'icons:class',
      label: 'Class Dashboard'
    };

    pages['/providers/:provider/classes/:class/records'] = {
      section: 'classes',
      name: 'class-records',
      available: function(context) {
        return context.me.hasAccess('provider_access');
      },
      icon: 'icons:assignment-ind',
      label: 'Records'
    };

    pages['/providers/:provider/classes/:class/evaluation-responses'] = {
      section: 'classes',
      name: 'class-eval-responses',
      available: function(context) {
        return context.me.hasAccess('provider_access');
      },
      icon: 'icons:question-answer',
      label: 'Evaluation Responses'
    };

    pages['/providers/:provider/evaluations'] = {
      section: 'providers',
      name: 'provider-evaluations',
      available: function(context) {
        return context.me.hasAccess('provider_access');
      },
      icon: 'icons:question-answer',
      label: 'Evaluations'
    };
    pages['/providers/:provider/locations'] = {
      section: 'providers',
      name: 'provider-locations',
      available: function(context) {
        return context.me.hasAccess('provider_access');
      },
      icon: 'icons:flag',
      label: 'Locations'
    };

    pages['/providers/:provider/topics'] = {
      section: 'providers',
      name: 'provider-topics',
      available: function(context) {
        return context.me.hasAccess('provider_access');
      },
      icon: 'icons:group-work',
      label: 'Topics'
    };

    return pages;
  }
}
