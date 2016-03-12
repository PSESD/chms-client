var hello = require('../bower_components/hello/dist/hello.min.js');

(function(hello) {
  'use strict';
  var config = require('../data/config');

	hello.init({
		chmsauth: {
			name: 'Clock Hours',

			oauth: {
				version: 2,
        response_type: 'code',
				auth: config.auth.baseUrl + '/oauth/authorize/',
				grant: config.auth.baseUrl + '/oauth/access_token'
			},
			// Refresh the access_token once expired
			refresh: true,
			base: '',

			xhr: function(p) {
				if (p.method !== 'get' && p.data) {
					// Serialize payload as JSON
					p.headers = p.headers || {};
					p.headers['Content-Type'] = 'application/json';
					if (typeof (p.data) === 'object') {
						p.data = JSON.stringify(p.data);
					}
				}

				return true;
			}
		}
	});

	function formatError(o) {
		if (o && o.error) {
			o.error = {
				code: (o.error === 'OAuth error: unauthorized' ? 'access_denied' : 'server_error'),
				message: o.error
			};
		}
	}

	function formatUser(o) {
		if (o.id) {
			o.thumbnail = o.image;
		}

		if (o.user) {
			hello.utils.extend(o, o.user);
			delete o.user;
		}

		if (o.image) {
			o.thumbnail = o.image;
		}

		return o;
	}

	function paging(res, headers, req) {
		if (res.data && res.data.length && headers && headers.Link) {
			var next = headers.Link.match(/<(.*?)>;\s*rel=\"next\"/);
			if (next) {
				res.paging = {
					next: next[1]
				};
			}
		}
	}

})(hello);
