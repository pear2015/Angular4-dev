var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var commonConfig = require('./webpack.common');
var helpers = require('../helpers.js');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');

const ENV = process.env.NODE_ENV = process.env.ENV = 'production';
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 8080;
const METADATA = webpackMerge(commonConfig({
  env: ENV
}).metadata, {
  host: HOST,
  port: PORT,
  ENV: ENV,
  HMR: false
});

module.exports = function (options) {
  return webpackMerge(commonConfig({
    env: ENV
  }), {
    devtool: 'source-map',

    output: {
      path: helpers.root('dist'),
      filename: 'scripts/[name].[chunkhash].bundle.js',
      sourceMapFilename: '[file].map',
      chunkFilename: 'scripts/[name].[chunkhash].chunk.js'
    },

    plugins: [
      new webpack.NoEmitOnErrorsPlugin(),

      new UglifyJSPlugin({
        uglifyOptions: {
          sourceMap: false,
          uglifyOptions: {
            ecma: 6,
            warnings: false,
            ie8: false,
            mangle: true,
            compress: {},
            output: {
              ascii_only: true,
              comments: false
            },
          }
        }
      }),

      new LoaderOptionsPlugin({
        minimize: true,
        debug: false,
        options: {

        }
      }),

      new webpack.DefinePlugin({
        'ENV': JSON.stringify(METADATA.ENV),
        'HMR': METADATA.HMR,
        'process.env': {
          'ENV': JSON.stringify(METADATA.ENV),
          'NODE_ENV': JSON.stringify(METADATA.ENV),
          'HMR': METADATA.HMR,
        }
      })
    ],

    node: {
      global: true,
      crypto: 'empty',
      process: false,
      module: false,
      clearImmediate: false,
      setImmediate: false
    }
  });
}
