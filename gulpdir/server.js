'use strict';

var gulp = require('gulp'),
    plugins = require('gulp-load-plugins')();

var runSequence = require('run-sequence');
var browserSync = require('browser-sync').create();

gulp.task('jade-dev', function () {
    return gulp.src('./src/**/*.jade')
        .pipe(plugins.jade({
            pretty : '    '
        }))
        .pipe(gulp.dest("./src"));
});

gulp.task('html2js-dev', function () {
    return gulp.src(['./src/**/*.html','!./src/index.html','!./src/assets/**/*.html','!./src/assets/*.html'])
        .pipe(plugins.ngHtml2js({
            moduleName: "universal.editor.templates",
        }))
        .pipe(plugins.rename({
            suffix: '.tpl'
        }))
        .pipe(gulp.dest('./src/'));
});

gulp.task('js-dev', function () {
    return gulp.src(['./src/module/universal-editor.module.js','./src/*.js','./src/**/*.js','!./src/config.js','!./src/assets/**/*.js','!./src/assets/*.js'])
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('jshint-stylish'))
        .pipe(plugins.concat("universal-editor.js"))
        .pipe(gulp.dest('./app'));
});

gulp.task('css-dev', function () {
    return gulp.src(['./src/*.scss','./src/**/*.scss'])
        .pipe(plugins.sass())
        .pipe(plugins.concat("universal-editor.css"))
        .pipe(gulp.dest("./app"));
});

gulp.task('html-dev', function () {
    return gulp.src('./src/index.html')
        .pipe(plugins.usemin({
            css : [],
            js : []
        }))
        .pipe(gulp.dest('./app/'))
        .on('end', browserSync.reload);
});

gulp.task('files-dev',function(){
    return gulp.src('./src/assets/**/*')
        .pipe(gulp.dest('./app/assets'));
});

gulp.task('bootstrap-fonts-dev',function(){
    return gulp.src('./bower_components/bootstrap/fonts/**/*')
        .pipe(gulp.dest('./app/fonts'));
});

gulp.task('prebuild' , function () {
    runSequence(
        'jade-dev',
        'html2js-dev',
        'js-dev',
        'css-dev'
    );
});

gulp.task('serve', function () {
    runSequence(
        'jade-dev',
        'html2js-dev',
        'js-dev',
        'css-dev',
        'bootstrap-fonts-dev',
        'files-dev',
        function () {
            gulp.src('./src/index.html')
                .pipe(plugins.usemin({
                    css : [],
                    js : []
                }))
                .pipe(gulp.dest('./app/'))
                .on('end' , function () {
                    browserSync.init({
                        server : './app'
                    });
                });

            gulp.watch('./src/**/*.jade', function () {
                console.log("Changed *.jade file(s). Creating new templates and converting to js-templates");
                runSequence(
                    'jade-dev',
                    'html2js-dev'
                );
            });
            gulp.watch('./src/**/*.js', function () {
                console.log("Changes *.js file(s). Running lint, concat, uglify, usemin and reloading browsers");
                runSequence(
                    'js-dev',
                    'html-dev'
                );
            });
            gulp.watch('./src/**/*.scss', function () {
                console.log("Changed *.scss file(s). Running concat, uglify, usemin and reloading browsers");
                runSequence(
                    'css-dev',
                    'html-dev'
                );
            });

            gulp.watch('./src/**/*.json', function () {
                console.log("Changed *.json file(s). Running file and reloading browsers");
                runSequence(
                    'files-dev',
                    'html-dev'
                );
            });

            gulp.watch('./src/index.html', function () {
                console.log("Changed index.html file(s). Running file and reloading browsers");
                gulp.src('./src/index.html')
                    .pipe(plugins.usemin({
                        css : [],
                        js : []
                    }))
                    .pipe(gulp.dest('./app/'))
                    .on('end', browserSync.reload);
            });
        }
    );
});