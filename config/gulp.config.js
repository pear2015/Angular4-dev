var helpers = require('./helpers');
var args = require('yargs').argv;
var util = require('gulp-util');
var package = require('../package.json');

var build_dir = '';
var ext = '';

if (args.release || args.aot) {
  util.log('===== release =====');
  build_dir = helpers.root('dist');
  ext = '.min'
} else {
  util.log('===== debug =====');
  build_dir = helpers.root('build');
}
util.log(util.colors.green(package.name), ':', util.colors.yellow(package.version));

module.exports = {
  name: package.name,
  version: package.version,
  author: package.author,
  loadingGif:build_dir+'/themes/images/loading.gif',
  build: {
    root: build_dir,
    themes: build_dir + '/themes',
    libs: build_dir + '/libs',
    scripts: build_dir + '/scripts',
    assets: build_dir + '/assets',
    ocr: build_dir + '/ocr'
  },
  libs: {
    jquery: helpers.root('node_modules', 'jquery') + '/dist/jquery' + ext + '.js',
    tether: [
      helpers.root('node_modules', 'tether') + '/dist/**/tether' + ext + '.css',
      helpers.root('node_modules', 'tether') + '/dist/**/tether' + ext + '.js'
    ],
    bootstrap: [
      helpers.root('node_modules', 'bootstrap') + '/dist/**/bootstrap' + ext + '.css',
      helpers.root('node_modules', 'bootstrap') + '/dist/**/bootstrap' + ext + '.js'
    ],
    fontawesome: [
      helpers.root('node_modules', 'font-awesome') + '/**/font-awesome' + ext + '.css',
      helpers.root('node_modules', 'font-awesome') + '/fonts/**'
    ],
     animate: [
      helpers.root('node_modules', 'animate.css') + '/animate.min.css',
    ]
  },
  sonarSetting: {
    host: 'http://172.18.24.25:9000',
    username: 'devappuser',
    password: 'devapp'
  },
  nexusSetting: {
    host: '172.18.24.51',
    username: 'root',
    password: 'root123',
    dest: '/opt/sonatype-work/nexus/storage/gs-publish-packages/ag02/crms-client/'
  },
  releaseSetting: {
    host: '172.18.24.69',
    username: 'root',
    password: 'root',
    dest: '/usr/local/apache-tomcat-8.5.5/webapps/macaw/'
  }
};
