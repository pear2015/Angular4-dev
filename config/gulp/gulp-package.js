var gulp = require('gulp');
var config = require('../gulp.config');
var packager = require('electron-packager');
var electronInstaller = require('electron-winstaller');
var gutil = require('gulp-util');
var path = require('path');
var fs = require('fs');
var del = require('del');
var package = require('../../package.json')

gulp.task('clean', function () {
  gutil.log('Cleaning', getFullPath('./electron/dist'), 'and', getFullPath('./setups'));
  return del(['electron/dist', 'setups'])
})

// 将UI线程的代码复制到electron目录
gulp.task('copyBuild', ['clean'], function () {
  if (isDirEmpty('dist')) {
    gutil.log(`Copying`, getFullPath(config.build.root), 'to', getFullPath('./electron/dist'))
    return gulp.src(config.build.root + '/**')
      .pipe(gulp.dest('electron/dist'))
  }
  gutil.log(getFullPath(config.build.root), 'is not exist or empty, please run "build" task first');
  return process.exit(1);
});

var commonOptions = {
  dir: './electron',
  out: './setups/packages',
  asar: {
    unpack: '**/main-conf*.json'
  },
  ignore: [
    'spec',
    'main.js',
    'config/main-conf.json',
    'package-lock.json'
  ],
  name: config.name,
  appVersion: config.version,
  appCopyright: 'Copyright © 2017 gsafety',
  overwrite: true
}

// win32 x64平台打包
gulp.task('packager-win32-x64', function (callback) {
  var win32Options = {
    platform: 'win32',
    arch: 'x64',
    win32metadata: {
      CompanyName: 'gsafety',
      FileDescription: 'crms-client',
      OriginalFilename: 'electron.exe',
      ProductName: 'crms-client',
      InternalName: 'crms-client'
    }
  };
  var options = Object.assign(commonOptions, win32Options);
  packager(options, function (err, appPaths) {
    callback();
  })
})

// linux x64平台打包
gulp.task('packager-linux-x64', function (callback) {
  var linuxOptions = {
    platform: 'linux',
    arch: 'x64',
  }
  var options = Object.assign(commonOptions, linuxOptions);
  packager(options, function (err, appPaths) {
    callback();
  })
})

// windows安装包
gulp.task('installer-win32-x64', function (callback) {
  var options = {
    appDirectory: `./setups/packages/${config.name}-win32-x64`,
    outputDirectory: `./setups/installer/${config.name}-win32-x64`,
    authors: config.author,
    loadingGif: config.loadingGif,
    exe: `${config.name}.exe`,
    name: config.name.replace('-', ''),
    version: config.version,
    setupExe: `${config.name}-${config.version}-win32-x64.exe`,
    setupMsi: `${config.name}-${config.version}-win32-x64.msi`
  }

  var resultPromise = electronInstaller.createWindowsInstaller(options)
  gutil.log('Creating installer for platform win32 x64 installer', gutil.colors.gray('(this may take a while)'))
  resultPromise.then(() => {
    gutil.log('Installer was created successfully');
    gutil.log('Installer is saved in', getFullPath(options.outputDirectory));
    callback();
  }, (e) => {
    gutil.log(`Error: ${e.message}`)
  })
})

var isDirEmpty = function (path) {
  return fs.existsSync(path) && fs.statSync(path).isDirectory() && fs.readdirSync(path).length;
}

function getFullPath(p) {
  return gutil.colors.yellow(path.resolve(p));
}
