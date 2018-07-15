var gulp = require('gulp');
var config = require('../gulp.config');
var inject = require('gulp-inject');

// 将编译后的文件和第三方库插入index.html
gulp.task('inject', function () {
  var css_stream = gulp.src([
    config.build.libs + '/tether/css/*.css',
    config.build.libs + '/bootstrap/css/*.css',
    config.build.libs + '/font-awesome/css/*.css',
    config.build.themes + '/css/*.css',
    config.build.libs + '/animate/*.css'
  ], {
      read: false
    });


  var libs_stream = gulp.src([
    config.build.libs + '/jquery/*.js',
    config.build.ocr + '/tesseract.js',
    config.build.libs + '/tether/js/*.js',
    config.build.libs + '/bootstrap/js/*.js'
  ]);

  var scripts = gulp.src([
    config.build.scripts + '/polyfills*',
    config.build.scripts + '/vendor*',
    config.build.scripts + '/main*'
  ]);

  var ocr_js = gulp.src([

  ]);

  return gulp.src(config.build.root + '/index.html')
    .pipe(inject(css_stream, {
      relative: true,
      starttag: '<!-- inject:css -->'
    }))
    .pipe(inject(ocr_js, {
      relative: true,
      starttag: '<!-- inject:ocr -->'
    }))
    .pipe(inject(libs_stream, {
      relative: true,
      starttag: '<!-- inject:libs -->'
    }))
    .pipe(inject(scripts, {
      relative: true,
      starttag: '<!-- inject:scripts -->'
    }))
    .pipe(gulp.dest(config.build.root))
});
