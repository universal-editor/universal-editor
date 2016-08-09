'use strict';

var gulp = require('gulp'),
    plugins = require('gulp-load-plugins')();

plugins.del = require('del');

gulp.task('clean:app', function () {
    return plugins.del([
        './app/**/*'
    ]);
});

gulp.task('clean:dist', function () {
    return plugins.del([
        './dist/*'
    ]);
});