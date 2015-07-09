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
  MINIFIED_OUT: 'build.min.js',

  SCSS:'src/scss/*.scss',
  SCSS_PATH:'src/scss',
  CSS_OUT:'dist/css',
  JADE:'src/jade/views/*.jade',
  HTML_OUT:'dist/html',

  OUT: 'build.js',
  DEST:'dist',
  DEST_BUILD:'dist/build',


  ENTRY_POINT: ['./src/jsx/app.js'],

  JS: './src/jsx/*.js',
  JS_PATH: './src/jsx/',
  ENTRIES: ['app.js'],
  JS_OUT:'dist/js'
}

gulp.task('scss', function() {
  return gulp.src(path.SCSS)
    .pipe(
      sass({
        includePaths: [path.SCSS_PATH],
        errLogToConsole: true
      }))
    /*.pipe( csso() )*/ //minimizer
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
        transform: [reactify]
      })
        .bundle()
        .pipe(source(entry))
        .pipe(gulp.dest(path.DEST_BUILD));
      });
  return es.merge.apply(null, tasks);
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

  /*
  var watcher = watchify(browserify({
    entries: path.ENTRY_POINT,
    transform:[reactify],
    debug: true,
    cache: {}, packageCache: {}, fullPaths:true
  }));

  return watcher.on('update', function() {
    watcher.bundle()
      .pipe(source(path.OUT))
      .pipe(gulp.dest(path.DEST_SRC));
      //console.log('updated');
  }).bundle()
    .pipe(source(path.OUT))
    .pipe(gulp.dest(path.JS_OUT));
  */

});

gulp.task('default', ['watch']);
