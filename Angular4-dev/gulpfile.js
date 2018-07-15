var gulp = require('gulp');
var runSequence = require('run-sequence');

// 引入自定义gulp任务
require('./config/gulp/gulp-changelog');
require('./config/gulp/gulp-clean');
require('./config/gulp/gulp-copy');
require('./config/gulp/gulp-inject');
require('./config/gulp/gulp-sass');
require('./config/gulp/gulp-sonar');
require('./config/gulp/gulp-test');
require('./config/gulp/gulp-upload');
require('./config/gulp/gulp-webpack');
require('./config/gulp/gulp-package');
var del = require('del');

var _callback = null;

// 默认构建任务
gulp.task('default', function (callback) {

  _callback = callback;
  return runSequence(
    'clean',
    // 'test',
    'copy-dev-messages',
    'webpack-build',
    'sass-build',
    'copy-config',
    'copy-assets',
    'inject',
    runTaskCallback
  );
});

// 开发时构建任务
gulp.task('dev', function (callback) {

  _callback = callback;
  return runSequence(
    'clean',
    'copy-dev-messages',
    'webpack-build',
    'sass-build',
    'copy-config',
    'copy-assets',
    'inject',
    runTaskCallback
  );
});

// 发布时构建任务
gulp.task('dist', function (callback) {

  _callback = callback;
  return runSequence(
    'clean-dist',
    // 'test',
    'copy-dev-messages',
    'webpack-dist',
    'sass-dist',
    'copy-config',
    'copy-assets',
    'inject',
    runTaskCallback
  );
});

// 带有预编译的发布时构建任务
gulp.task('dist-aot', function (callback) {

  _callback = callback;
  return runSequence(
    'clean-aot',
    // 'test',
    'copy-dev-messages',
    'webpack-dist-aot',
    'sass-dist',
    'copy-config',
    'copy-assets',
    'inject',
    runTaskCallback
  );
});

// 打包electron
gulp.task('package', function (callback) {
  _callback = callback;
  return runSequence(
    'copyBuild',
    'packager-win32-x64',
    'installer-win32-x64',
    runTaskCallback
  )
})

function runTaskCallback(error) {
  if (error) {
    console.log(error.message);
    return process.exit(1);
  } else {
    console.log('BUILD TASK FINISHED SUCCESSFULLY');
  }
  if (_callback)
    _callback(error);
}
