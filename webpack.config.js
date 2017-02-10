; (function(require) {
    'use strict';

    var localHost = 'universal-editor.dev', defaultlocalHost = '127.0.0.1';
    var NODE_ENV = ~process.argv.indexOf('-p') ? 'production' : 'development';
    var RUNNING_SERVER = /webpack-dev-server.js$/.test(process.argv[1]);

    var webpack = require('webpack');
    var gutil = require('gulp-util');
    var path = require('path');
    var HtmlWebpackPlugin = require('html-webpack-plugin');
    var copyWebpackPlugin = require('copy-webpack-plugin');
    var deepcopy = require('deepcopy');

    var publicPath = path.resolve(__dirname, NODE_ENV == 'production' ? 'dist' : 'app');

    if (RUNNING_SERVER) {
        try {
            var hostile = require('hostile');
            hostile.set(defaultlocalHost, localHost, function(err) {
                if (err) {
                    gutil.log(gutil.colors.red('Can\'t set hosts file change. Please, try run this as Administrator.'), err.toString());
                    localHost = 'localhost';
                } else {
                    gutil.log(gutil.colors.green('Set \'/etc/hosts\' successfully!'));
                }
            });
        } catch (e) { localHost = 'localhost'; }
    }


    //** TEMPLATE CONFIGURATION */
    var webpackConfigTemplate = {
        context: __dirname,
        output: {
            filename: NODE_ENV == 'production' ? '[name].min.js' : '[name].js',
            path: publicPath
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

        /** Include this setting if you need source-map */
        // devtool: 'inline-source-map',
        // devtool: 'eval', // faster then previous type of source-map

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
                    loader: 'style-loader!css-loader!sass-loader?sourceMap=0',
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
                'NODE_ENV': JSON.stringify(NODE_ENV),
                'RUNNING_SERVER': RUNNING_SERVER
            }),
            new webpack.HotModuleReplacementPlugin()
        ]
    };

    if (RUNNING_SERVER) {
        //-- SETTING FOR LOCAL SERVER
        webpackConfigTemplate.devServer = {
            host: localHost,
            port: 5555,
            hot: true,
            inline: true,
            open: true
        };
    }

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

    webpackConfigTemplate.entry = {
        'ue': [path.resolve(__dirname, 'src/main.js') ]
    };

    webpackConfigTemplate.plugins.push(
        new copyWebpackPlugin([{
            from: 'src/demoApp/index.js'
        }, {
            from: 'src/demoApp/components.controller.js'
        }, {
            from: 'src/demoApp/staffForm.controller.js'
        }, {
            from: 'src/demoApp/staffGrid.controller.js'
        }, {
            from: 'src/demoApp/newsForm.controller.js'
        }, {
            from: 'src/demoApp/newsGrid.controller.js'
        }]),
        new webpack.DefinePlugin({
            'INCLUDE_VENDOR': false
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            title: 'Example Components Universal Editor',
            template: path.resolve(__dirname, 'src/index.ejs'),
            inject: 'head'
        })
    );

    /** Running webpack in multicompilation */
    module.exports = [webpackConfigTemplate];

})(require);