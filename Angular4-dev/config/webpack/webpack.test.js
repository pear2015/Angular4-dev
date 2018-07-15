var helpers = require('../helpers');
var webpack = require('webpack');
var path = require('path');

module.exports = {
    devtool: 'inline-source-map',

    resolve: {
        extensions: ['.ts', '.js', '.json']
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'tslint-loader',
                exclude: [helpers.root('node_modules')]
            },
            {
                test: /\.ts$/,
                loaders: [
                    'ts-loader',
                    'angular2-router-loader',
                    'angular2-template-loader'
                ],
            },
            {
                test: /\.html$/,
                loader: 'raw-loader'
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            },
            {
                test: /\.ts/,
                include: [helpers.root('src')],
                loader: 'sourcemap-istanbul-instrumenter-loader?force-sourcemap=true',
                exclude: [/\.spec\.ts/, /\.e2e\.ts/, /node_modules/],
                enforce: 'post'
            }
        ]
    },

    stats: {
        colors: true,
        reasons: true
    },
    watch: true,
    plugins: [
        new webpack.LoaderOptionsPlugin({
            debug: true
        }),
        new webpack.ContextReplacementPlugin(/angular(\\|\/)core(\\|\/)@angular/, path.join(__dirname))
    ]
};
