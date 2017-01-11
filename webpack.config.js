; (function(require) {
    'use strict';

    var localHost = 'universal-editor.local', defaultlocalHost = '127.0.0.1';
    const NODE_ENV = require('argv').p ? JSON.stringify('production') : JSON.stringify('development');

    var webpack = require('webpack');
    var gutil = require('gulp-util');
    var path = require('path');
    var ExtractTextPlugin = require('extract-text-webpack-plugin');
    var HtmlWebpackPlugin = require('html-webpack-plugin');
    var CopyWebpackPlugin = require('copy-webpack-plugin');
    var BowerWebpackPlugin = require("bower-webpack-plugin");
    var deepcopy = require("deepcopy");

    try {
        var hostile = require('hostile');
        hostile.set(defaultlocalHost, localHost, function(err) {
            if (err) {
                gutil.log(gutil.colors.red('Can\'t set hosts file change.'), err.toString());
                localHost = 'localhost';
            } else {
                gutil.log(gutil.colors.green('Set \'/etc/hosts\' successfully!'));
            }
        });
    } catch (e) { localHost = 'localhost'; }


    //** TEMPLATE CONFIGURATION */
    var webpackConfigTemplate = {
        context: __dirname,
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: '[name].js'
        },
        resolve: {
            modulesDirectories: ['node_modules', 'bower_components'],
            extensions: ['', '.js'],
            root: [
                path.resolve(__dirname, 'bower_components')
            ]
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
                    loader: 'style-loader!css-loader!sass-loader',
                    include: [
                        path.resolve(__dirname, 'src')
                    ]
                },
                {
                    test: /\.css$/,
                    loader: 'style-loader!css-loader',
                    include: [
                        path.resolve(__dirname, 'src')
                    ]
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
                }
            ]
        },
        plugins: [
            new webpack.DefinePlugin({
                'NODE_ENV': JSON.stringify(NODE_ENV)
            }),
            new webpack.HotModuleReplacementPlugin()
        ],
        devServer: {
            host: localHost,
            port: 8080,
            hot: true,
            inline: true,
            open: true
        }
    };
    if (NODE_ENV == 'production') {
        webpackConfigTemplate.plugins.push(
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false,
                    drop_console: true,
                    unsafe: true
                }
            })
        );
    }

    /** Configuration of bundle.js */
    var webpackConfigBundle = deepcopy(webpackConfigTemplate);
    webpackConfigBundle.entry = {
        'bundle': ['webpack/hot/dev-server', 'webpack-dev-server/client?http://localhost:8080/', path.resolve(__dirname, 'src/main.js')]
    };
    webpackConfigBundle.resolve.alias = {
        'moment': 'moment/moment.js',
        'jquery-minicolors': 'jquery-minicolors/jquery.minicolors.js',
        'jquery': 'jquery/dist/jquery.js',
        'angular': path.resolve(__dirname, 'src/inject/inject.js'),
        'angularjs': path.resolve(__dirname, 'bower_components/angular/angular.js'),
    };
    webpackConfigBundle.module.loaders.push({
        test: /\.js$/,
        loader: 'string-replace',
        query: {
            search: '$window.angular',
            replace: 'angular'
        }
    });

    webpackConfigBundle.plugins.push(
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
            'INCLUDE_VENDOR': true
        })
    );

    /** Configuration of core.js */

    var webpackConfigCore = deepcopy(webpackConfigTemplate);

    webpackConfigCore.entry = {
        'core': [path.resolve(__dirname, 'src/main.js')]
    };

    webpackConfigCore.plugins.push(
        new webpack.DefinePlugin({
            'INCLUDE_VENDOR': false
        })
    );
    module.exports = [webpackConfigCore, webpackConfigBundle];

})(require);