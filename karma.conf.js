// Karma configuration
// Generated on Wed Dec 13 2017 18:06:04 GMT+0400 (RTZ 3 (зима))
let path = require('path'),
  webpack = require('webpack'),
  ngAnnotatePlugin = require('ng-annotate-webpack-plugin'),
  WebpackNotifierPlugin = require('webpack-notifier');

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: './test',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      '../bower_components/jquery/dist/jquery.js',
      '../bower_components/angular/angular.js',
      '../node_modules/angular-mocks/angular-mocks.js',
      '../bower_components/jquery-minicolors/jquery.minicolors.js',
      '../bower_components/angular-minicolors/angular-minicolors.js',
      '../bower_components/moment/min/moment-with-locales.js',
      '../bower_components/angular-moment/angular-moment.js',
      '../bower_components/checklist-model/checklist-model.js',
      '../bower_components/angular-cookies/angular-cookies.js',
      '../bower_components/angular-ui-router/release/angular-ui-router.js',
      '../bower_components/angular-ui-mask/dist/mask.js',
      '../bower_components/angular-toastr/dist/angular-toastr.tpls.js',
      '../bower_components/angular-translate/angular-translate.js',
      '../bower_components/bootstrap/dist/js/bootstrap.js',
      '../bower_components/angular-bootstrap/ui-bootstrap.min.js',
      '../bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
      '../bower_components/angular-drag-and-drop-lists/angular-drag-and-drop-lists.min.js',
      '../bower_components/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js',
      '../src/main.js',
      '**/*.spec.js'],


    // list of files to exclude
    exclude: [
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      '**/*.spec.js': ['webpack'],
      '../src/main.js': ['webpack'],
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['ChromeHeadless'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,
    webpack: configureWebpack()
  });

  function configureWebpack(webpackConfigFunction) {
    return [{
      resolve: {
        modulesDirectories: ['node_modules', 'bower_components'],
        extensions: ['', '.js'],
        root: [
          path.resolve(__dirname, 'bower_components')
        ]
      },
      module: {
        loaders: [
          {
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
            query: {
              plugins: ['transform-runtime'],
              presets: ['es2015']
            }
          },
          {
            test: /\.json$/,
            loader: 'json-loader'
          },
          {
            test: './src/module/classes/dataSource.js',
            loader: 'exports?window.DataSource'
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
              path.resolve(__dirname, 'src'),
              path.resolve(__dirname, 'test')
            ]
          },
          {
            test: /\.(jpe?g|png|ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
            loader: 'base64-inline-loader'
          }
        ]
      },
      devtool: 'inline-source-map',
      plugins: [
        new webpack.DefinePlugin({
          'IS_DEV': true,
          'NODE_ENV': 'development',
          'RUNNING_SERVER': true
        }),
        new ngAnnotatePlugin({
          add: true
        }),
        new WebpackNotifierPlugin({ alwaysNotify: true })
      ]
    }];
  }
}
