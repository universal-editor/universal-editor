'use strict';

require('require-dir')('./gulpdir');

var gulp = require('gulp');

gulp.task('default',['clean:app','wiredep'], function () {
    gulp.start('serve');
});