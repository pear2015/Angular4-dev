var gulp = require('gulp');
var config = require('../gulp.config');
var path = require('path');
var sonar = require('gulp-sonar');
var replace = require('gulp-replace');
var gutil = require('gulp-util');
var package = require('../../package.json');
gulp.task('replacelcov', function () {
  var basePath = path.resolve('node_modules/angular2-router-loader/src/index.js!');
  basePath += path.resolve('node_modules/angular2-template-loader/index.js!');
  basePath += path.resolve('node_modules/tslint-loader/index.js!');
  basePath += path.resolve('') + '\\';
  gutil.log(basePath);
  return gulp.src('reports/lcov.info')
    .pipe(replace(basePath, ''))
    .pipe(gulp.dest('reports'))
});

gulp.task('sonar', ['replacelcov'], function () {
  var option = {
    sonar: {
      host: {
        url: config.sonarSetting.host
      },
      login: config.sonarSetting.username,
      password: config.sonarSetting.password,
      coverage: {
        exclusions: '**/*spec*,**/*routes*,**/*index*,**/*module*,**/dev-demo*,**/statistics-analysis*,**/model/*,**/shared/services/*,**/core/*',
      },
      projectKey: package.name,
      projectName: package.name,
      projectVersion: package.version,
      sources: 'src/app',
      test: 'src/test',
      language: 'ts',
      sourceEncoding: 'UTF-8',
      ts: {
        tslintpath: './node_modules/tslint/bin/tslint',
        tslintconfigpath: './tslint.json',
        lcov: {
          reportpath: 'reports/lcov.info'
        }
      },
      exec: {
        maxBuffer: 1024 * 1024
      }
    }
  }

  return gulp.src('thisFileDoesNotExist.js', {
      read: false
    })
    .pipe(sonar(option))
});