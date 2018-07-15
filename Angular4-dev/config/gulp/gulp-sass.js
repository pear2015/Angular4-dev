var gulp = require('gulp');
var shell = require('gulp-shell');
var md5 = require('gulp-md5');
var sass = require('gulp-sass');
var cleanCss = require('gulp-clean-css');
var rename = require('gulp-rename');
var config = require('../gulp.config');
var gutil = require('gulp-util');

// 编译sass(release)
gulp.task('sass-dist', function () {
  return gulp.src('src/themes/default/scss/default.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCss())
    .pipe(md5(20))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(config.build.themes + '/css'))
})

// 编译sass(debug)
gulp.task('sass-build', function () {
  return gulp.src('src/themes/default/scss/default.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(config.build.themes + '/css'))
});

gulp.task('watch-sass', function () {
  var watcher = gulp.watch('./src/themes/**/*.scss', ['sass-build']);

  watcher.on('change', function (event) {
    gutil.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  })
});