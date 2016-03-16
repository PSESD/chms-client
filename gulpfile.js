'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var fs = require('fs');
var del = require('del');
var glob = require('glob');

var browserify = require('browserify');
var source = require('vinyl-source-stream');
var babelify = require('babelify');
var debowerify = require('debowerify');

var runSequence = require('run-sequence');
var path = require('path');
var ghPages = require('gulp-gh-pages');

var isProd = false;

var DIST = 'dist';
var SRC = 'client';
var TMP = '.tmp';

var dist = function(subpath) {
  return !subpath ? DIST : path.join(DIST, subpath);
};

var src = function(subpath) {
  return !subpath ? SRC : path.join(SRC, subpath);
};

var tmp = function(subpath) {
  return !subpath ? TMP : path.join(TMP, subpath);
};


const AUTOPREFIXER_BROWSERS = ['last 2 versions', 'ios 8', 'Safari 8'];

function getVersion() {
  return JSON.parse(fs.readFileSync('./package.json', 'utf8')).version;
}

function minifyHtml() {
  return $.minifyHtml({quotes: true, empty: true, spare: true});
}

function uglifyJS() {
  return $.uglify({preserveComments: 'some'});
}

/** Clean */
gulp.task('clean', function(done) {
  return del([dist(), tmp(), src('scripts/bundle.js'), tmp()]);
});

/** Styles */
gulp.task('styles', function() {
//   return gulp.src('./styles/*.scss')
//       .pipe($.sass())
//       // .pipe($.autoprefixer([
//       //   'ie >= 10',
//       //   'ie_mob >= 10',
//       //   'ff >= 33',
//       //   'chrome >= 38',
//       //   'safari >= 7',
//       //   'opera >= 26',
//       //   'ios >= 7'
//       // ]))
//       .pipe($.minifyCss())
//       .pipe($.license('Apache', {
//         organization: 'Google Inc. All rights reserved.'
//       }))
//       .pipe(gulp.dest('./dist/styles'));
  return gulp.src(src('./styles/*.css'))
    .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe($.minifyCss())
    .pipe($.license('MIT', {
      organization: 'Puget Sound Educational Service District'
    }))
    .pipe(gulp.dest(dist('./styles')));
});

/** Scripts */
gulp.task('js', ['jshint', 'jscs']);

// Lint JavaScript
gulp.task('jshint', function() {
  return gulp.src([src('./scripts/**/*.js')])
    .pipe($.jshint('.jshintrc'))
    .pipe($.jshint.reporter('jshint-stylish'))
});

// Check JS style
gulp.task('jscs', function() {
  return gulp.src([src('./scripts/**/*.js')])
    .pipe($.jscs());
});

function buildBundle(file) {
  return browserify({
    entries: [file],
    debug: true
  })
  .transform(babelify, {presets: ['es2015']}) // es6 -> e5
  .transform(debowerify, {preferNPM: true})
  .bundle();
}

// gulp.task('deamd', function() {
//   return browserify([
//     src('../libraries/orbit-dev/orbit.js'),
//     src('../libraries/orbit-dev/orbit-common.js'),
//     src('../libraries/orbit-dev/orbit-common-jsonapi.js'),
//     src('../libraries/orbit-dev/orbit-common-local-storage.js')
//   ])
//   .transform('deamdify')
//   .bundle()
//   .pipe(source('amd.packages.js'))
//   .pipe(gulp.dest(tmp('./scripts')));
// });

gulp.task('jsbundle', function() {
  console.log('==Building JS bundle==');

  //var dest = isProd ? 'dist' : '';
  var dest = dist();
  return buildBundle(src('./scripts/app.js'))
    .pipe(source('bundle.js'))
    // .pipe($.streamify(uglifyJS()))
    .pipe($.license('MIT', {
      organization: 'Puget Sound Educational Service District'
    }))
    .pipe(gulp.dest('./' + dest + '/scripts'))
});

/** Root */
gulp.task('root', function() {
  gulp.src([
      src('./*.*'),
      src('./.user.ini')
    ])
    .pipe($.replace(/@VERSION@/g, getVersion()))
    .pipe(gulp.dest(dist()));

  gulp.src([src('./data/*.json')]).pipe(gulp.dest(dist('./data')));

  return gulp.src(src('./favicon.ico'))
    .pipe(gulp.dest(dist('./')));
});

gulp.task('copy_bower_components', function() {
  gulp.src([
      src('bower_components/webcomponentsjs/webcomponents-lite.min.js'),
      src('bower_components/platinum-sw/*.js')
    ], {base: src('./')})
    .pipe(gulp.dest(dist('./')));

  // Service worker elements want files in a specific location.
  gulp.src([src('bower_components/sw-toolbox/*.js')])
    .pipe(gulp.dest(dist('./sw-toolbox')));
  gulp.src([src('bower_components/platinum-sw/bootstrap/*.js')])
    .pipe(gulp.dest(dist('.//elements/bootstrap')));
});

/** HTML */
// gulp.task('html', function() {
//   return gulp.src('./**/*.html')
//     .pipe($.replace(/@VERSION@/g, version))
//     .pipe(gulp.dest('./dist/'));
// });

/** Images */
gulp.task('images', function() {
  return gulp.src([
      src('./images/**/*.svg'),
      src('./images/**/*.png'),
      src('./images/**/*.jpg'),
      '!' + src('./images/screenshot.jpg')
    ])
    .pipe(gulp.dest(dist('./images')));
});


// Generate a list of files to precached when serving from 'dist'.
// The list will be consumed by the <platinum-sw-cache> element.
gulp.task('precache', function(callback) {
  var dir = 'dist';

  glob('{elements,scripts,styles}/**/*.*', {cwd: src()}, function(error, files) {
    if (error) {
      callback(error);
    } else {
      files.push('client.html', './', 'bower_components/webcomponentsjs/webcomponents-lite.min.js');
      var filePath = path.join(dir, 'precache.json');
      fs.writeFile(filePath, JSON.stringify(files), callback);
    }
  });
});


/** Vulcanize */
gulp.task('vulcanize', function() {
  console.log('==Vulcanizing HTML Imports==');

  return gulp.src(src('./elements/elements.html'))
    .pipe($.vulcanize({
      inlineScripts: true,
      inlineCss: true,
      stripComments: true,
      //excludes: [path.resolve('./dist/third_party/polymer.html')]
      //stripExcludes: false,
    }))
    .pipe($.crisper()) // Separate JS into its own file for CSP compliance and reduce html parser load.
    .pipe($.if('*.html', minifyHtml())) // Minify html output
    // .pipe($.if('*.js', uglifyJS())) // Minify js output
    .pipe(gulp.dest(dist('./elements')))
});

/** Watches */
gulp.task('watch', function() {
  gulp.watch(src('./styles/**/*.scss'), ['styles']);
  gulp.watch(src('./*.html'), ['root']);
  // gulp.watch('./sw-import.js', ['serviceworker']);
  gulp.watch(src('./elements/**/*.html'), ['vulcanize']);
  gulp.watch(src('./images/**/*.*'), ['images']);
  gulp.watch([src('./data/**/*.*'), src('./scripts/**/*.js')], ['js', 'jsbundle']);
});

/** Main tasks */

var allTasks = ['root', 'styles', 'jsbundle', 'images'];//, 'serviceworker'];

gulp.task('bump', function() {
  return gulp.src([
      './{package,bower}.json'
    ])
    .pipe($.bump({type: 'patch'}))
    .pipe(gulp.dest('./'));
});

gulp.task('default', function() {
  isProd = true;
  return runSequence('clean', 'js', allTasks, 'vulcanize', 'precache',
                     'copy_bower_components');
})

gulp.task('dev', function() {
  return runSequence('clean', allTasks, 'watch');
});

gulp.task('release', ['bump'], function() {
  return runSequence('default');
});

// Build then deploy to GitHub pages gh-pages branch
gulp.task('build-deploy-gh-pages', function(cb) {
  runSequence(
    'default',
    'deploy-gh-pages',
    cb);
});

// Deploy to GitHub pages gh-pages branch
gulp.task('deploy-gh-pages', function() {
  return gulp.src(dist('**/*'))
    // Check if running task from Travis CI, if so run using GH_TOKEN
    // otherwise run using ghPages defaults.
    .pipe($.if(process.env.TRAVIS === 'true', $.ghPages({
      remoteUrl: 'https://$GH_TOKEN@github.com/polymerelements/polymer-starter-kit.git',
      silent: true,
      branch: 'gh-pages'
    }), $.ghPages()));
});

// Load tasks for web-component-tester
// Adds tasks for `gulp test:local` and `gulp test:remote`
require('web-component-tester').gulp.init(gulp);

// Load custom tasks from the `tasks` directory
try {
  require('require-dir')('tasks');
} catch (err) {}
