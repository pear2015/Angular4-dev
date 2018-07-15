var webpack = require('webpack');
const CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TsConfigPathsPlugin = require('awesome-typescript-loader').TsConfigPathsPlugin;
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
const ngcWebpack = require('ngc-webpack');
const path = require('path');
var helpers = require('../helpers');

const AOT = process.env.BUILD_AOT || helpers.hasNpmFlag('aot');
const HMR = helpers.hasProcessFlag('hot');
const METADATA = {
  title: 'Electron seed with Angular4 @SaronPerri',
  baseUrl: '/',
  isDevServer: helpers.isWebpackDevServer(),
  HMR: HMR
};

module.exports = function (options) {
  isProd = options.env === 'production';

  return {

    entry: {
      polyfills: './src/polyfills.ts',
      vendor: './src/vendor.ts',
      main: AOT ? './src/main-aot.ts' : './src/main.ts'
    },

    resolve: {
      extensions: ['.ts', '.js', '.json']
    },

    module: {
      rules: [{
          test: /\.ts$/,
          loader: 'tslint-loader',
          enforce: 'pre'
        },
        {
          test: /\.ts$/,
          loaders: [{
              loader: 'ng-router-loader',
              options: {
                loader: 'async-import',
                genDir: 'compiled',
                aot: AOT
              }
            },
            {
              loader: 'awesome-typescript-loader',
              options: {
                configFileName: AOT ? 'tsconfig.aot.json' : 'tsconfig.json',
                useCache: !isProd
              }
            },
            {
              loader: 'ngc-webpack',
              options: {
                disable: !AOT, // SET TO TRUE ON NON AOT PROD BUILDS
              }
            },
            {
              loader: 'angular2-template-loader'
            }
          ],
          exclude: [/\.(spec|e2e)\.ts$/]
        },
        {
          test: /\.html$/,
          loader: 'raw-loader'
        },
        {
          test: /\.json$/,
          loader: 'json-loader'
        }
      ]
    },

    target: 'electron-renderer',
    externals: [
      (function () {
        var IGNORES = ['electron'];
        return function (context, request, callback) {
          if (IGNORES.indexOf(request) >= 0) {
            return callback(null, "require('" + request + "')");
          }
          return callback();
        }
      })()
    ],

    plugins: [
      new CommonsChunkPlugin({
        name: ['main', 'vendor', 'polyfills']
      }),

      new CheckerPlugin(),

      new webpack.ContextReplacementPlugin(
        /angular(\\|\/)core(\\|\/)@angular/,
        helpers.root('src')
      ),

      new ngcWebpack.NgcWebpackPlugin({
        /**
         * If false the plugin is a ghost, it will not perform any action.
         * This property can be used to trigger AOT on/off depending on your build target (prod, staging etc...)
         *
         * The state can not change after initializing the plugin.
         * @default true
         */
        disabled: !AOT,
        tsConfig: helpers.root('tsconfig.aot.json'),
      }),

    ],

    node: {
      global: true,
      crypto: 'empty',
      process: true,
      module: false,
      clearImmediate: false,
      setImmediate: false
    }
  }
};
