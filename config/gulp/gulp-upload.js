var gulp = require('gulp');
var GulpSSH = require('gulp-ssh');
var config = require('../gulp.config');
var package = require('../../package.json');
var path = require('path');
var fs = require('fs');
var gutil = require('gulp-util');

// 将 安装包 发送到 Nexus 服务器
gulp.task('upload-to-nexus', function () {
  var gulpSSH = new GulpSSH({
    ignoreErrors: false,
    sshConfig: {
      host: config.nexusSetting.host,
      port: 22,
      username: config.nexusSetting.username,
      password: config.nexusSetting.password,
    }
  });
  var dest = config.nexusSetting.dest +  '/';
  // 如果是 SNAPSHOT 版本，将放到 snapshot/ 子文件夹
  if (package.version.toUpperCase().includes('SNAPSHOT')) {
    dest = dest + 'snapshot/';
    gutil.log('is SNAPSHOT version, will publish to snaphot/');
  }
  if (isDirEmpty('setups/installer')) {
    return gulp.src([
      'setups/installer/crms-client-win32-x64/*.exe'
    ])
      .pipe(gulpSSH.dest(dest))
      .on('error', gutil.log);
  }

  gutil.log(getFullPath('setups/installer'), 'is not exist or empty, please run "package" task first.');
});

var isDirEmpty = function (path) {
  return fs.existsSync(path) && fs.statSync(path).isDirectory() && fs.readdirSync(path).length;
}

function getFullPath(p) {
  return gutil.colors.yellow(path.resolve(p));
}
