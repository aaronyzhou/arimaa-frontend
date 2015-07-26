'use strict';
require('ofe').call();
var gulp = require('gulp');
var sass = require('gulp-sass');
var jade = require('gulp-jade');
var watchify = require('watchify');
var browserify = require('browserify');
var reactify = require('reactify');
var streamify = require('gulp-streamify');
var uglify = require('gulp-uglify');
var source = require('vinyl-source-stream');
var minifer = require('gulp-uglify/minifier');
var uglifyjs = require('uglify-js');
var es = require('event-stream');
var rename = require('gulp-rename');

var path = {
  JS: './src/jsx/*.js',
  JS_PATH: './src/jsx/',
  ENTRIES: ['app.js','chat.js'],
  ENTRY_APP: 'app.js',
  ENTRY_CHAT: 'chat.js',

  JS_OUT:'dist/js',

  SCSS:'src/scss/*.scss',
  SCSS_PATH:'src/scss',
  CSS_OUT:'dist/css',
  JADE:'src/jade/views/*.jade',
  HTML_OUT:'dist/html',

  DEST:'dist',
  DEST_BUILD:'dist/build'
}

function onError(e) {
  var s = "";
  s += "descr: " + e.description + "\n";
  s += "line: "  + e.lineNumber + "\n";
  console.log(s);
  if(!e.description) {
    console.log(e);
  }
  this.emit("end");
}

//based on https://gist.github.com/Sigmus/9253068
function buildScript(filename, watch) {
  var props = {entries: [path.JS_PATH + filename],cache: {}, packageCache: {}, debug:true};
  var bundler = watch ? watchify(browserify(props)) : browserify(props);
  bundler.transform(reactify);
  function rebundle() {
    var stream = bundler.bundle();
    return stream.on('error', onError)
    .pipe(source(filename))
    .pipe(gulp.dest(path.JS_OUT));
  }
  bundler.on('update', function() {
    rebundle();
  });
  return rebundle();
}

gulp.task('scss', function() {
  return gulp.src(path.SCSS)
    .pipe(
      sass({
        includePaths: [path.SCSS_PATH],
        errLogToConsole: true
      }))
    //.pipe( csso() ) //minimizer
    .pipe(gulp.dest(path.CSS_OUT));
});

gulp.task('jade', function() {
  return gulp.src(path.JADE)
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest(path.HTML_OUT));
});

gulp.task("js", function() {
  var tasks = path.ENTRIES.map(function(entry) {
      return browserify({
        entries: [path.JS_PATH + entry],
        transform: [reactify],
      })
        .bundle().on('error', onError)
        .pipe(source(entry))
        .pipe(gulp.dest(path.DEST_BUILD)  );
      });
  return es.merge.apply(null, tasks);
});

gulp.task("js-app", function() {
  return buildScript(path.ENTRY_APP, false);
});

gulp.task("js-chat", function() {
  return buildScript(path.ENTRY_CHAT, false);
});

gulp.task("watch-app", function() {
  return buildScript(path.ENTRY_APP, true);
});

gulp.task("watch-chat", function() {
  return buildScript(path.ENTRY_CHAT, true);
});

gulp.task('build', function() {
    var tasks = path.ENTRIES.map(function(entry) {
        return browserify({
          entries: [path.JS_PATH + entry],
          transform: [reactify]
        })
          .bundle()
          .pipe(source(entry))
          .pipe(streamify(minifer({}, uglifyjs)))
          .pipe(rename({
                extname: '.min.js'
          }))
          .pipe(gulp.dest(path.DEST_BUILD));
        });
    return es.merge.apply(null, tasks);
});
 
gulp.task('watch', function() {
  gulp.watch(path.JS, ['js']);
  gulp.watch(path.SCSS, ['scss']);
  gulp.watch(path.JADE, ['jade']);
});

gulp.task('default', ['watch']);
