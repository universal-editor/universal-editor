'use strict';

var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var BowerWebpackPlugin = require("bower-webpack-plugin");

var webpackConfig = {
    context: __dirname,
    entry: {
        'u-editor': './src/module/universal-editor.js',
        styles: './src/index.scss'
    },
    output: {
        path: __dirname + '/dist',
        filename: '[name].core.js'
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    module: {
        loaders: [
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader?sourceMap')
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
            },
            {
                test: /\.woff2?$|\.ttf$|\.eot$|\.svg$|\.png|\.jpe?g|\.gif$/,
                loader: 'file-loader'
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin('u-editor.all.css', {
            allChunks: true
        }),
        new BowerWebpackPlugin({
            modulesDirectories: ['bower_components'],
            manifestFiles: ['bower.json', '.bower.json'],
            excludes: []
        }),
        new CopyWebpackPlugin([{
            from: __dirname + '/src/index.html'
        }]),
        new HtmlWebpackPlugin({
            template: __dirname + '/src/index.html',
            inject: 'body'
        })
        //new webpack.optimize.CommonsChunkPlugin('inline', 'inline.js'),
        // new webpack.optimize.CommonsChunkPlugin({ name: 'bundle', filename: 'u-editor.all.js', minChunks: 2, chunks: ['vendor', 'u-editor'] })
        // new webpack.optimize.CommonsChunkPlugin({ name: 'common', filename: 'u-editor.all.js', minChunks: 2, chunks: ['main', 'vendor'] })
    ]
};
module.exports = webpackConfig;

