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
var browserSync = require('browser-sync');

var path = {
  JS: './src/jsx/**/*.js',
  JS_PATH: './src/jsx/',
  ENTRIES: ['app.js','chat.js'],
  ENTRY_APP: 'app.js',
  ENTRY_CHAT: 'chat.js',

  JS_OUT:'dist/js',

  SCSS:'src/scss/*.scss',
  SCSS_PATH:'src/scss',
  CSS_OUT:'dist/css',
  JADE:'src/jade/**/*.jade',
  HTML_OUT:'dist/html',

  DEST:'dist',
  DEST_BUILD:'dist/build'
}

function onError(e) {
  var s = "";
  s += "file: " + e.fileName + "\n";
  s += "descr: " + e.description + "\n";
  s += "line: "  + e.lineNumber + "\n";
  console.log(s);
  if(!e.description) {
    console.log(e);
  }
  this.emit("end");
}

function onScssError(e) {
  sass.logError(e);
  this.emit("end");
}

//based on https://gist.github.com/Sigmus/9253068
function buildScript(filename, watch, minimize) {
  var props = {entries: [path.JS_PATH + filename],cache: {}, packageCache: {}, debug:true};
  var bundler = watch ? watchify(browserify(props)) : browserify(props);
  bundler.transform(reactify);
  function rebundle() {
    var stream = bundler.bundle();

    //there might be a way to pipe conditionally
    if(minimize) {
      return stream.on('error', onError)
      .pipe(source(filename))
      .pipe(streamify(minifer({}, uglifyjs)))
      .pipe(rename({
            extname: '.min.js'
      }))
      .pipe(gulp.dest(path.DEST_BUILD));
    } else {
      return stream.on('error', onError)
      .pipe(source(filename))
      .pipe(gulp.dest(path.DEST_BUILD));
    }
  }
  bundler.on('update', function() {
    rebundle();
    console.log('update');
  });
  return rebundle();
}

gulp.task('scss', function() {
  return gulp.src(path.SCSS)
    .pipe(sass().on('error', sass.logError))
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

//REMOVE
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
  return buildScript(path.ENTRY_APP, false, false);
});

gulp.task("js-chat", function() {
  return buildScript(path.ENTRY_CHAT, false, false);
});

gulp.task("watch-app", function() {
  return buildScript(path.ENTRY_APP, true, false);
});

gulp.task("watch-chat", function() {
  return buildScript(path.ENTRY_CHAT, true, false);
});

gulp.task("js-app-min", function() {
  return buildScript(path.ENTRY_APP, false, true);
});

gulp.task("set-prod-env", function() {
  return process.env.NODE_ENV = 'production';
})

//i think there
gulp.task('build', ['set-prod-env','js-app-min','jade','scss'], function(){
  console.log("build done");
})

//don't use this, remove later
gulp.task('build-old', function() {
  process.env.NODE_ENV = 'production';

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

//wait for preprecssing to finish then reload
gulp.task('js-app-browsersync', ['js-app'], browserSync.reload);
gulp.task('scss-browsersync', ['scss'], browserSync.reload);
gulp.task('jade-browsersync', ['jade'], browserSync.reload);

gulp.task('serve', ['js-app','jade','scss'], function() {
  browserSync({
     server: {
       baseDir: "./"
     }
  });
  gulp.watch(path.JS, ['js-app-browsersync']);
  gulp.watch(path.SCSS, ['scss-browsersync']);
  gulp.watch(path.JADE, ['jade-browsersync']);
});

//no longer needed?
gulp.task('watch', function() {
  gulp.watch(path.JS, ['js-app']);
  gulp.watch(path.SCSS, ['scss']);
  gulp.watch(path.JADE, ['jade']);
});

gulp.task('default', ['watch']);
