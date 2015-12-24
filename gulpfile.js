/* jshint camelcase:false */

'use strict';

var gulp = require('gulp');
var del = require('del');
var merge = require('merge-stream');
var paths = require('./gulp.config.json');
var plugins = require('gulp-load-plugins')();
var exec = require('child_process').exec;

/**
 * List the available gulp tasks
 */
gulp.task('help', plugins.taskListing);

/**
 * Lint JavaScript code.
 * @return {Stream}
 */
gulp.task('analyze', function() {
    var jshint = analyzejshint([].concat(paths.js));
    var jscs = analyzejscs([].concat(paths.js));
    return merge(jshint, jscs);
});

/**
 * Create $templateCache from the html templates
 * Output is written to build/templates.js
 * @return {Stream}
 */
gulp.task('templatecache', function() {
    return gulp
        .src(paths.htmltemplates)
        .pipe(plugins.minifyHtml({
            empty: true
        }))
        .pipe(plugins.angularTemplatecache('templates.js', {
            module: 'rameplayer.core',
            standalone: false,
            root: 'rameplayer/'
        }))
        .pipe(gulp.dest(paths.build));
});

/**
 * Minify and bundle application JavaScript files
 * @return {Stream}
 */
gulp.task('js', ['templatecache'], function() {
    var source = [].concat(paths.js, paths.build + 'templates.js');
    return gulp
        .src(source)
        .pipe(plugins.concat('rameplayer.min.js'))
        .pipe(plugins.ngAnnotate({
            add: true,
            single_quotes: true
        }))
        .pipe(plugins.bytediff.start())
        .pipe(plugins.uglify({
            mangle: true
        }))
        .pipe(plugins.bytediff.stop(bytediffFormatter))
        .pipe(gulp.dest(paths.build));
});

/**
 * Copy the vendor JavaScript
 * @return {Stream}
 */
gulp.task('vendorjs', function() {
    return gulp
        .src(paths.vendorjs)
        .pipe(plugins.concat('vendor.min.js'))
        .pipe(plugins.bytediff.start())
        .pipe(plugins.uglify())
        .pipe(plugins.bytediff.stop(bytediffFormatter))
        .pipe(gulp.dest(paths.build));
});

/**
 * Minify and bundle the CSS
 * @return {Stream}
 */
gulp.task('css', function() {
    return gulp
        .src(paths.css)
        .pipe(plugins.concat('rameplayer.min.css'))
        .pipe(plugins.autoprefixer('last 2 version', '> 5%'))
        .pipe(plugins.bytediff.start())
        .pipe(plugins.minifyCss({}))
        .pipe(plugins.bytediff.stop(bytediffFormatter))
        .pipe(gulp.dest(paths.build + 'css'));
});

/**
 * Minify and bundle the vendor CSS
 * @return {Stream}
 */
gulp.task('vendorcss', function() {
    var vendorFilter = plugins.filter(['**/*.css']);
    return gulp
        .src(paths.vendorcss)
        .pipe(vendorFilter)
        .pipe(plugins.concat('vendor.min.css'))
        .pipe(plugins.bytediff.start())
        .pipe(plugins.minifyCss({}))
        .pipe(plugins.bytediff.stop(bytediffFormatter))
        .pipe(gulp.dest(paths.build + 'css'));
});

/**
 * Copy images
 * @return {Stream}
 */
gulp.task('images', function() {
    return gulp
        .src(paths.images)
        .pipe(gulp.dest(paths.build + 'images'));
});

/**
 * Copy fonts
 * @return {Stream}
 */
gulp.task('fonts', function() {
    return gulp
        .src(paths.fonts)
        .pipe(gulp.dest(paths.build + 'fonts'));
});

/**
 * Inject all the files into the new index.html
 * @return {Stream}
 */
gulp.task('rev-and-inject', ['js', 'vendorjs', 'css', 'vendorcss'], function() {
    var minified = paths.build + '**/*.min.*';
    var indexHtml = paths.app + 'index.html';
    var adminHtml = paths.app + 'admin.html';
    var minFilter = plugins.filter(['**/*.min.*', '!**/*.map']);
    var indexHtmlFilter = plugins.filter(['index.html']);
    var adminHtmlFilter = plugins.filter(['admin.html']);

    return gulp
        .src([].concat(minified, indexHtml, adminHtml)) // add all built min files and html files
        .pipe(minFilter) // filter the stream to minified css and js
        .pipe(plugins.rev()) // create files with rev's
        .pipe(gulp.dest(paths.build)) // write the ref files
        .pipe(minFilter.restore()) // back to original stream

        // handle index.html
        .pipe(indexHtmlFilter)
        .pipe(inject('css/vendor.min.css', 'inject-vendor'))
        .pipe(inject('css/rameplayer.min.css'))
        .pipe(inject('vendor.min.js', 'inject-vendor'))
        .pipe(inject('rameplayer.min.js'))
        .pipe(gulp.dest(paths.build)) // write the rev files
        .pipe(indexHtmlFilter.restore()) // back to original stream

        // handle admin.html
        .pipe(adminHtmlFilter)
        .pipe(inject('css/vendor.min.css', 'inject-vendor'))
        .pipe(inject('css/rameplayer.min.css'))
        .pipe(inject('vendor.min.js', 'inject-vendor'))
        .pipe(inject('rameplayer.min.js'))
        .pipe(gulp.dest(paths.build)) // write the rev files
        .pipe(adminHtmlFilter.restore()) // back to original stream

        // replace files referenced in index.html with the rev'd files
        .pipe(plugins.revReplace()) // substitute in new filenames
        .pipe(gulp.dest(paths.build)) // write new index.html
        .pipe(plugins.rev.manifest()) // create the manifest
        .pipe(gulp.dest(paths.build)); // write rev-manifest.json
});

gulp.task('inject-version', ['rev-and-inject'], function(cb) {
    exec('git describe --tags', function(err, stdout, stderr) {
        stdout = stdout.replace(/^\s+|\s+$/g, '');
        var indexHtml = paths.build + 'index.html';
        return gulp
            .src(indexHtml)
            .pipe(plugins.replace('development', stdout))
            // change settings for production environment
            .pipe(plugins.replace("{ basePath: 'stubs/', simulation: true }",
                                  "{ port: 8000, basePath: '/' }"))
            .pipe(gulp.dest(paths.build));
    });
    return gulp
        .src('');
});

/**
 * Build the optimized application
 * @return {Stream}
 */
gulp.task('build', ['inject-version', 'images', 'fonts'], function() {
    return gulp
        .src('')
        .pipe(plugins.notify({
            onLast: true,
            message: 'RamePlayer built!'
        }));
});

/**
 * Remove all files from the build folder
 * One way to run clean before all tasks is to run
 * from the cmd line: gulp clean && gulp build
 * @return {Stream}
 */
gulp.task('clean', function(cb) {
    var delPaths = [].concat(paths.build);
    del(delPaths, cb);
});

///////////////////////////////////////
// Util functions
// ////////////////////////////////////

/**
 * Execute JSHint on given source files
 * @param  {Array} sources
 * @param  {String} overrideRcFile
 * @return {Stream}
 */
function analyzejshint(sources, overrideRcFile) {
    var jshintrcFile = overrideRcFile || './.jshintrc';
    return gulp
        .src(sources)
        .pipe(plugins.jshint(jshintrcFile))
        .pipe(plugins.jshint.reporter('jshint-stylish'));
}

/**
 * Execute JSCS on given source files
 * @param  {Array} sources
 * @return {Stream}
 */
function analyzejscs(sources) {
    return gulp
        .src(sources)
        .pipe(plugins.jscs('./.jscsrc'));
}

/**
 * Formatter for bytediff to display the size changes after processing
 * @param  {Object} data - byte data
 * @return {String}      Difference in bytes, formatted
 */
function bytediffFormatter(data) {
    var difference = (data.savings > 0) ? ' smaller' : ' larger';
    return data.fileName + ' minified from ' +
        (data.startSize / 1000).toFixed(0) + ' kB to ' + (data.endSize / 1000).toFixed(0) + ' kB' +
        ' (' + formatPercent(1 - data.percent, 0) + '%' + difference + ')';
}

/**
 * Format a number as a percentage
 * @param  {Number} num       Number to format as a percent
 * @param  {Number} precision Precision of the decimal
 * @return {String}           Formatted percentage
 */
function formatPercent(num, precision) {
    return (num * 100).toFixed(precision);
}

function inject(path, name) {
    var pathGlob = paths.build + path;
    var options = {
        ignorePath: paths.build.substring(1),
        read: false,
        addRootSlash: false
    };
    if (name) {
        options.name = name;
    }
    return plugins.inject(gulp.src(pathGlob), options);
}
