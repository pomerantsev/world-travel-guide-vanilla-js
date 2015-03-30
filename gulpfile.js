'use strict';

var gulp = require('gulp');

// Instead of killing gulp on every error,
// we can show a notification and wait for
// user to fix the error, then recompile
var notifier = require('node-notifier');
var notify = function (error) {
  notifier.notify({
    title: error.plugin,
    message: error.message
  });
};

var $ = require('gulp-load-plugins')();

var basePaths = {
  src: './src/',
  dest: './dist/'
};

var folders = {
  scripts: 'scripts',
  styles: 'styles'
};

gulp.task('jshint:all', function () {
  return gulp.src([
    basePaths.src + folders.scripts + '/**/*.js',
    '!' + basePaths.src + folders.scripts + '/vendor/**/*'
  ])
    .pipe($.plumber(notify))
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.jshint.reporter('fail'));
});

gulp.task('scripts', ['jshint:all'], function () {
  return gulp.src(basePaths.src + folders.scripts + '/**/*.js')
    .pipe($.plumber(notify))
    .pipe($.sourcemaps.init())
    .pipe($.babel())
    .pipe($.sourcemaps.write('./maps'))
    .pipe(gulp.dest(basePaths.dest + folders.scripts))
    .pipe($.connect.reload());
});

gulp.task('styles', function () {
  return gulp.src(basePaths.src + folders.styles + '/main.scss')
    .pipe($.plumber(notify))
    .pipe($.sourcemaps.init())
    .pipe($.sass())
    .pipe($.sourcemaps.write())
    .pipe($.sourcemaps.init({loadMaps: true}))
    .pipe($.autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe($.sourcemaps.write('./maps'))
    .pipe(gulp.dest(basePaths.dest + folders.styles))
    .pipe($.connect.reload());
});

gulp.task('build', [
  'scripts',
  'styles'
]);

gulp.task('connect', ['build'], function () {
  $.connect.server({
    root: [basePaths.dest, basePaths.src],
    host: '0.0.0.0',
    port: 9000,
    livereload: true,
    middleware: function (connect) {
      return [
        connect().use(
          '/bower_components',
          connect.static('./bower_components')
        ),
        connect().use(
          '/babel',
          connect.static('./node_modules/gulp-babel/node_modules/babel-core')
        )
      ];
    }
  });
});

gulp.task('reload', function () {
  return gulp.src(basePaths.src)
    .pipe($.connect.reload());
});

gulp.task('watch', ['connect'], function () {
  gulp.watch(basePaths.src + folders.scripts + '/**/*.js', ['scripts']);
  gulp.watch(basePaths.src + folders.styles + '/**/*.scss', ['styles']);
  gulp.watch(basePaths.src + '/**/*.html', ['reload']);
});

gulp.task('default', ['watch']);
