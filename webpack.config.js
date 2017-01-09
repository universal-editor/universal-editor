'use strict';

const NODE_ENV = process.env.NODE_ENV || 'development';

var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var BowerWebpackPlugin = require("bower-webpack-plugin");

var webpackConfig = {
    context: __dirname,
    entry: {
        'u-editor': path.resolve(__dirname, 'src/main.js')
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].core.js'
    },
    resolve: {
        modulesDirectories: ['node_modules', 'bower_components'],
        extensions: ['', '.js'],
        root: [
            path.resolve(__dirname, 'bower_components')
        ],
        alias: {
            'moment': 'moment/moment.js',
            'jquery-minicolors': 'jquery-minicolors/jquery.minicolors.js',
            'jquery': 'jquery/dist/jquery.js',
            'angular': path.resolve(__dirname, 'src/module/inject/angular-inject.js'),
            'angularjs': path.resolve(__dirname, 'bower_components/angular/angular.js'),
        }
    },
    resolveLoader: {
        modulesDirectories: ['node_modules'],
        moduleTemplates: ['*', '*-loader'],
        extensions: ['', '.js']
    },
    watch: NODE_ENV == 'development',
    watchOptions: {
        aggregateTimeout: 100
    },
    //   devtool: NODE_ENV == 'development' ? 'cheap-inline-module-source-map' : null,
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
                include: [
                    path.resolve(__dirname, 'src')
                ]
            },
            {
                test: /\.scss$/,
                loader: 'style-loader!css-loader!sass-loader?sourceMap',
                include: [
                    path.resolve(__dirname, 'src')
                ]
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            },
            {
                test: /\.jade$/,
                loader: 'jade-loader',
                include: [
                    path.resolve(__dirname, 'src')
                ]
            },
            {
                test: /\.(jpe?g|png|ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
                loader: 'base64-inline-loader'
            },
            {
                test: /\.js$/,
                loader: 'string-replace',
                query: {
                    search: '$window.angular',
                    replace: 'angular'
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            title: 'Example Components Universal Editor',
            template: path.resolve(__dirname, 'src/index.ejs'),
            inject: 'body'
        }),
        new webpack.ProvidePlugin({
            'angular': 'angular',
            '$': 'jquery',
            'jQuery': 'jquery',
            'window.jQuery': 'jquery',
            'moment': 'moment'
        }),
        new webpack.DefinePlugin({
            'NODE_ENV': JSON.stringify(NODE_ENV)
        })
    ]
};
module.exports = webpackConfig;

if (NODE_ENV == 'production') {
    module.exports.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                drop_console: true,
                unsafe: true
            }
        })
    );
}

