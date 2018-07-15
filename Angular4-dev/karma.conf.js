var webpackconfig = require('./config/webpack/webpack.test.js');

module.exports = function(config) {
    var _config = {
        basePath: '',

        frameworks: ['jasmine'],

        files: [
            { pattern: './karma-shim.js', watched: false }
        ],

        exclude: [],

        preprocessors: {
            './karma-shim.js': ['webpack', 'sourcemap']
        },

        webpack: webpackconfig,

        webpackMiddleware: {
            stats: 'errors-only'
        },

        // browserify: {
        //     debug: true
        // },

        coverageReporter: {
            type: 'json',
            dir: 'reports',
            subdir: 'json',
            file: 'coverage-final.json'
        },


        remapIstanbulReporter: {
            src: 'reports/json/coverage-final.json',
            reports: {
                lcovonly: 'reports/lcov.info',
                html: 'reports/html',
                text: null
            }
        },

        webpackServer: {
            noInfo: true
        },

        reporters: ['mocha', 'coverage', 'karma-remap-istanbul'],

        port: 9527,
        colors: true,
        logLevel: config.LOG_INFO,
        autowatch: false,
        browsers: ['Chrome'],

        customLaunchers: {
            Chrome_travis_ci: {
                base: 'Chrome',
                flags: ['--no-sandbox']
            }
        },

        singleRun: true
    };

    config.set(_config);
};
