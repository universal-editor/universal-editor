'use strict';

var gulp = require('gulp'),
    merge = require('merge-stream'),
    plugins = require('gulp-load-plugins')();

var runSequence = require('run-sequence');
var mainBowerFiles = require('main-bower-files');
var gulpFilter = require('gulp-filter');
var browserSync = require('browser-sync').create(),
    es = require('event-stream');

gulp.task('libs-min', function() {
    var jsFilter = gulpFilter('**/*.js',{ restore: true });
    var cssFilter = gulpFilter('**/*.css', { restore: true });
    return gulp.src(mainBowerFiles())
        .pipe(jsFilter)
        .pipe(plugins.uglify())
        .pipe(plugins.concat('vendor.min.js'))
        .pipe(gulp.dest('./dist/js'))
        .pipe(jsFilter.restore)
        .pipe(cssFilter)
        .pipe(plugins.uglifycss())
        .pipe(plugins.concat('vendor.min.css'))
        .pipe(gulp.dest('./dist/css'))
        .pipe(cssFilter.restore);
});

gulp.task('libs', function() {
    var jsFilter = gulpFilter('**/*.js',{ restore: true });
    var cssFilter = gulpFilter('**/*.css', { restore: true });
    return gulp.src(mainBowerFiles())
        .pipe(jsFilter)
        .pipe(plugins.concat('vendor.js'))
        .pipe(gulp.dest('./dist/js'))
        .pipe(jsFilter.restore)
        .pipe(cssFilter)
        .pipe(plugins.concat('vendor.css'))
        .pipe(gulp.dest('./dist/css'))
        .pipe(cssFilter.restore);
});

gulp.task('jade', function () {
    return gulp.src('./src/**/*.jade')
        .pipe(plugins.jade({
            pretty : '    '
        }))
        .pipe(gulp.dest("./src"));
});

gulp.task('html2js', function () {
    return gulp.src(['./src/**/*.html','!./src/index.html','!./src/assets/**/*.html','!./src/assets/*.html'])
        .pipe(plugins.ngHtml2js({
            moduleName: "universal.editor.templates"
        }))
        .pipe(plugins.rename({
            suffix: '.tpl'
        }))
        .pipe(gulp.dest('./src/'));
});

gulp.task('js', function () {
    return gulp.src(['./src/module/universal-editor.module.js', './src/*.js','./src/**/*.js',
        '!./src/assets/**/*.js','!./src/assets/*.js','!./src/config.js'])
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('jshint-stylish'))
        .pipe(plugins.concat("universal-editor.js"))
        .pipe(plugins.rename({
            suffix: '.min'
        }))
        .pipe(plugins.uglify())
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('css', function () {
    return gulp.src(['./src/*.scss','./src/**/*.scss'])
        .pipe(plugins.sass())
        .pipe(plugins.concat("universal-editor.css"))
        .pipe(plugins.uglifycss({
            maxLineLen : 80
        }))
        .pipe(plugins.rename({
            suffix : '.min'
        }))
        .pipe(gulp.dest("./dist/css"));
});

gulp.task('files',function(){
    return gulp.src('./src/assets/**/*')
        .pipe(gulp.dest('./dist/assets'));
});

gulp.task('config',function(){
    return gulp.src('./src/config.js')
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('inject', function() {
    var target = gulp.src('./src/index.html');
    var sourcesJs = gulp.src(['./dist/js/vendor.min.js','./dist/js/**/*.js','!./dist/js/config.js'], {read: false});
    var sourcesCss = gulp.src(['./dist/css/vendor.min.css','./dist/css/**/*.css'], {read: false});
    return target.pipe(plugins.inject(es.merge(sourcesJs,sourcesCss), {relative: false,  addRootSlash: false, ignorePath: 'dist'}))
        .pipe(plugins.inject(gulp.src('./dist/js/config.js', {read: false}),{relative: false,  addRootSlash: false, ignorePath: 'dist', name: 'config'}))
        .pipe(gulp.dest('./dist'));
});

gulp.task('build',function(){
    runSequence(
        'jade',
        'html2js',
        'js',
        'css',
        'files',
        'libs-min',
        'config',
        'inject'
    );
});

gulp.task('serve:dist', function () {
    browserSync.init({
        server:  './dist'
    });
});

gulp.task('serve:build', function () {
    runSequence(
        'jade',
        'html2js',
        'js',
        'css',
        'files',
        'libs-min',
        'config',
        'inject',
        'serve:dist'
    );
});