var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var commonConfig = require('./webpack.common');
var helpers = require('../helpers.js');

const ENV = process.env.ENV = process.env.NODE_ENV = 'development';
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3000;
const PUBLIC = process.env.PUBLIC || undefined;
const HMR = helpers.hasProcessFlag('hot');
const METADATA = webpackMerge(commonConfig({
  env: ENV
}).metadata, {
    host: HOST,
    port: PORT,
    public: PUBLIC,
    ENV: ENV,
    HMR: HMR
  });

module.exports = function (env) {
  return webpackMerge(commonConfig({
    env: ENV
  }), {
      devtool: 'cheap-module-eval-source-map',

      output: {
        path: helpers.root('build'),
        filename: 'scripts/[name].bundle.js',
        chunkFilename: 'scripts/[id].chunk.js'
      },

      devServer: {
        historyApiFallback: true,
        stats: 'minimal'
      },

      plugins: [
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
        process: true,
        module: false,
        clearImmediate: false,
        setImmediate: false
      }
    })
};