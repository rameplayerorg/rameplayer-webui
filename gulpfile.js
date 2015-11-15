'use strict';

var gulp = require('gulp');
var paths = require('./gulp.config.json');
var plugins = require('gulp-load-plugins')();

gulp.task('js', function() {
    return gulp
        .src(paths.js)
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('default'))
        .pipe(plugins.uglify())
        .pipe(plugins.concat('all.min.js'))
        .pipe(gulp.dest(paths.build));
});
