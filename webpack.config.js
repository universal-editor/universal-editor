; (function(require) {
    'use strict';
    'esversion: 6';

    var webpack = require('webpack'),
        deasync = require('deasync'),
        gutil = require('gulp-util'),
        path = require('path'),
        HtmlWebpackPlugin = require('html-webpack-plugin'),
        copyWebpackPlugin = require('copy-webpack-plugin'),
        cleanWebpackPlugin = require('clean-webpack-plugin'),
        ngAnnotatePlugin = require('ng-annotate-webpack-plugin'),
        WebpackNotifierPlugin = require('webpack-notifier');

    var localHost = 'universal-editor.dev',
        defaultlocalHost = '127.0.0.1',
        NODE_ENV = ~process.argv.indexOf('-p') ? 'production' : 'development',
        RUNNING_SERVER = /webpack-dev-server.js$/.test(process.argv[1]),
        isProd = NODE_ENV == 'production',
        isDev = NODE_ENV == 'development',
        publicPath = path.resolve(__dirname, isProd ? 'dist' : 'app'),
        freePort = null;


    require('portscanner').findAPortNotInUse(8080, 8100, defaultlocalHost, (error, port) => freePort = error ? 5555 : port);
    deasync.loopWhile(function() { return !freePort; });


    if (RUNNING_SERVER) {
        try {
            var hostile = require('hostile');
            hostile.set(defaultlocalHost, domain, function(err) {
                if (err) {
                    gutil.log(gutil.colors.red('Can\'t set hosts file change. Please, try run this as Administrator.'), err.toString());
                    localHost = 'localhost';
                } else {
                    gutil.log(gutil.colors.green('Set \'/etc/hosts\' successfully!'));
                    localHost = domain;
                }
            });
        } catch (e) { localHost = 'localhost'; }
        deasync.loopWhile(function() { return !localHost; });
    }

    //** TEMPLATE CONFIGURATION */
    var webpackConfigTemplate = {
        context: __dirname,
        output: {
            filename: isProd ? '[name].min.js' : '[name].js',
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

        watch: isDev,
        watchOptions: {
            aggregateTimeout: 100
        },
        module: {
            loaders: [
                {
                    test: /\.js$/,
                    loader: 'babel-loader',
                    include: [
                        path.resolve(__dirname, 'src')
                    ]
                },
                {
                    test: /\.scss$/,
                    loader: 'style!css-loader!sass-loader',
                    include: [
                        path.resolve(__dirname, 'src')
                    ]
                },
                {
                    test: /\.css$/,
                    loader: 'style!css-loader',
                    include: [
                        path.resolve(__dirname, 'src')
                    ],
                    options: {
                        plugins: function() {
                            return [
                                require('autoprefixer')
                            ];
                        }
                    }
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
            new webpack.HotModuleReplacementPlugin(),
            new cleanWebpackPlugin([publicPath], { verbose: true }),
            new ngAnnotatePlugin({
                add: true
            }),
            new WebpackNotifierPlugin({ alwaysNotify: true })
        ]
    };

    if (RUNNING_SERVER) {
        //-- SETTING FOR LOCAL SERVER
        webpackConfigTemplate.devServer = {
            host: localHost,
            hot: true,
            port: freePort,
            inline: true,
            open: true
        };
    }

    if (isProd) {
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
        'ue': ['webpack-dev-server/client?http://' + localHost + ':' + freePort + '/', 'webpack/hot/dev-server', path.resolve(__dirname, 'src/main.js')]
    };

    webpackConfigTemplate.plugins.push(
        new copyWebpackPlugin([{
            from: 'src/demoApp'
        }]),
        new webpack.DefinePlugin({
            'IS_DEV': isDev
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            title: 'Example Components Universal Editor',
            template: path.resolve(__dirname, 'src/index.ejs'),
            inject: 'head'
        })
    );

    module.exports = [webpackConfigTemplate];
})(require);