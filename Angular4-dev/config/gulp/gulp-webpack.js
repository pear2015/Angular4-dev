var gulp = require('gulp');
var shell = require('gulp-shell');

// webpack打包(release)
gulp.task('webpack-dist', shell.task([
  'npm run webpack:dist'
]));

gulp.task('webpack-dist-aot', shell.task([
  'npm run webpack:dist:aot'
]));

// webpack打包(debug)
gulp.task('webpack-build', shell.task([
  'npm run webpack:build'
]));