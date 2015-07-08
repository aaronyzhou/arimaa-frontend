var gulp = require('gulp');
var react = require('gulp-react');
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

var path = {
  JS:['src/jsx/*.js'], //no longer needed??

  JS_OUT:'dist/js',
  MINIFIED_OUT: 'build.min.js',


  SCSS:'src/scss/*.scss',
  SCSS_PATH:'src/scss',
  CSS_OUT:'dist/css',
  JADE:'src/jade/views/*.jade',
  HTML_OUT:'dist/html',

  OUT: 'build.js',
  DEST:'dist',
  DEST_BUILD:'dist/build',


  ENTRY_POINT: ['./src/jsx/app.js']
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

gulp.task('watch', function() {
  gulp.watch(path.JS, []);
  gulp.watch(path.SCSS, ['scss']);
  gulp.watch(path.JADE, ['jade']);

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
});

gulp.task('build', function(){
  browserify({
    entries: path.ENTRY_POINT,
    transform: [reactify],
  })
    .bundle()
    .pipe(source(path.MINIFIED_OUT))
    //.pipe(streamify(uglify(path.MINIFIED_OUT)))
    .pipe(streamify(minifer({}, uglifyjs))) //https://github.com/terinjokes/gulp-uglify/issues/98
    .pipe(gulp.dest(path.DEST_BUILD));
});
