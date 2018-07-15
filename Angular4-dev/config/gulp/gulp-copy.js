var gulp = require('gulp');
var shell = require('gulp-shell');
var config = require('../gulp.config');
var jsonEditor = require('gulp-json-editor');
var eventStream = require('event-stream');
var gutil = require('gulp-util');
var moment = require('moment');
var package = require('../../package.json');

// 复制配置文件，并修改版本号等配置项
gulp.task('copy-config', function () {
  var buildDateMsg = '+build.' + moment(new Date()).format('YYMMDDHH');

  gutil.log('generate version: ' + package.version + buildDateMsg);
  return gulp.src('src/main-conf.json')
    .pipe(jsonEditor({
      'version': package.version + buildDateMsg
    }))
    .pipe(gulp.dest(config.build.root))
})

// 复制文件到构建目录，例如第三方库，词条文件等
gulp.task('copy-assets', function () {
  return eventStream.merge(
    gulp.src('src/index.html')
      .pipe(gulp.dest(config.build.root)),

    gulp.src('src/error.define.json')
      .pipe(gulp.dest(config.build.root)),

    gulp.src('src/favicon.ico')
      .pipe(gulp.dest(config.build.root)),

    gulp.src('src/i18n/*')
      .pipe(gulp.dest(config.build.root + '/i18n')),

    gulp.src(config.libs.jquery)
      .pipe(gulp.dest(config.build.libs + '/jquery')),

    gulp.src(config.libs.tether)
      .pipe(gulp.dest(config.build.libs + '/tether')),

    gulp.src(config.libs.bootstrap)
      .pipe(gulp.dest(config.build.libs + '/bootstrap')),

    gulp.src(config.libs.animate)
      .pipe(gulp.dest(config.build.libs + '/animate')),

    gulp.src(config.libs.fontawesome, {
      base: './node_modules'
    })
      .pipe(gulp.dest(config.build.libs)),

    gulp.src('src/themes/default/images/**')
      .pipe(gulp.dest(config.build.themes + '/images')),

    gulp.src('src/themes/default/fonts/**')
      .pipe(gulp.dest(config.build.themes + '/fonts')),

    gulp.src('src/assets/files/**')
      .pipe(gulp.dest(config.build.assets + '/files')),

    gulp.src('src/ocr/**')
      .pipe(gulp.dest(config.build.ocr))
  )
});

// 复制dev葡语词条
gulp.task('copy-dev-messages', function () {
  return gulp.src('src/dev-i18n/**')
    .pipe(gulp.dest('node_modules/devextreme/localization/messages'))
})
