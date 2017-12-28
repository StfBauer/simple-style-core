var config = require('./ssg.core.config'), // import core settings
    // gulp config
    gulp = require('gulp'),
    $ = require('gulp-load-plugins')({
        lazy: true
    }),
    del = require('del'),
    ts = require('gulp-typescript'),
    markdown = require('gulp-marked-json'),
    jsoncombine = require('gulp-jsoncombine'),
    // browersync
    browserSync = require('browser-sync'),
    reload = browserSync.reload, // call reload function
    // SSG Core
    ssgCore = require('./ssg-core-engine/ssg.core.precompile'),
    ssgCoreConfig = require('./ssg-core-engine/ssg.core.genConfig');

gulp.task("test:run", () => {

    console.log("--- Test Run ---");
    console.log(settings.styles.directory);

});

// Register all watches
var wathches = () => {

    // TypeScript watching
    gulp.watch(config.watches.scripts, ['ts:compile']);

    // SASS compilation and style changes
    gulp.watch(config.watches.styles, ['sass:compile'], reload);

    // Update configuration
    gulp.watch(config.watches.ssg)
        // item was changed
        .on('change', ssgCoreConfig.fsEvents);

    // Precompile all patterns
    gulp.watch(config.watches.ssg, ['ssg:precompile'], reload);

    // try {
    //     gulp.watch(config.watches.ssg, ['ssg:config'], reload);
    // } catch (Exception) {
    //     console.log(Exception)
    // }

    // Watch for documentation changes
    gulp.watch(config.watches.documentation, ['doc:markdown'], reload);

};

var wathchesCore = () => {

    // TypeScript watching
    gulp.watch(config.watchesCore.scripts, ['ts:core:compile']);

    // SASS compilation and style changes
    gulp.watch(config.watchesCore.styles, ['sass:core:compile'], reload);

};


// Generate Dockumentation
gulp.task('doc:markdown', () => {

    return gulp.src(config.watches.documentation)
        .pipe(markdown({
            pedantic: true,
            smartypants: true
        }))
        .pipe(jsoncombine(config.documentation.path, function(data) {

            var keys = [],
                name,
                newDocData = {};

            for (name in data) {

                // check for slashes in variable name
                var newname = name.replace(new RegExp(/\/|\\/g), '_');

                // create a new object property with normalized name
                newDocData[newname] = {
                    title: data[name].title,
                    body: data[name].body
                }

            }

            // return new buffer in wrapped table
            return new Buffer("var ssgDoc = " + JSON.stringify(newDocData));

        }))
        .pipe(gulp.dest('.tmp/'))
        .pipe(reload({
            stream: true
        }));
});

// Generate index file for all pattern
gulp.task('ssg:config', () => {

    // Get pattern path
    var patternPath = config.ssg.path;

    var curConfig = {
        patterns: patternPath,
        configFile: config.ssg.config
    };

    // parse configuration and log
    gulp.src(patternPath)
        .pipe(ssgCoreConfig
            .createConfig(curConfig));

});

// Precompile handle bar templates
gulp.task('ssg:precompile', ['ssg:config'], () => {

    return ssgCore(config.ssg);

});

// Sass style compilation compilation
gulp.task('sass:compile', () => {

    var watches = config.watches.styles;

    return gulp.src(watches)
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.sass.sync({
            outputStyle: 'expanded',
            precision: 10,
            includePaths: ['.']
        }).on('error', $.sass.logError))
        .pipe($.autoprefixer({
            browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']
        }))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest(config.target.styles))
        .pipe(reload({
            stream: true
        }));

});


// Sass style compilation compilation
gulp.task('sass:core:compile', () => {

    var watches = config.watchesCore.styles;

    return gulp.src(watches)
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.sass.sync({
            outputStyle: 'expanded',
            precision: 10,
            includePaths: ['.']
        }).on('error', $.sass.logError))
        .pipe($.autoprefixer({
            browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']
        }))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest(config.target.styles))
        .pipe(reload({
            stream: true
        }));

});

// General typescript compilation
gulp.task('ts:compile', () => {

    var tsProject = ts.createProject(config.tsconfig);

    return gulp.src(config.watches.scripts)
        .pipe(
            $.plumber()
        )
        .pipe(
            $.tslint({
                formatter: "prose"
            })
        )
        // .pipe($.tslint.report())
        .pipe(ts(config.tsconfig))
        .pipe(
            gulp.dest(config.target.scripts)
        )
        .pipe(reload({
            stream: true
        }));

});

// General typescript compilation
gulp.task('ts:core:compile', () => {

    var watches = config.watchesCore.scripts,
        tsProject = ts.createProject(config.tsconfig);

    console.log(watches);

    return gulp.src(watches)
        .pipe(
            $.plumber()
        )
        .pipe(
            $.tslint({
                formatter: "prose"
            })
        )
        // .pipe($.tslint.report())
        .pipe(ts(config.tsconfig))
        .pipe(
            gulp.dest(config.target.scripts)
        )
        .pipe(reload({
            stream: true
        }));

});

// Launch options
gulp.task('pre:serve', ['ssg:precompile', 'doc:markdown']);

// cleans the temporary directory
gulp.task('clean:tmp', () => {

    return del(['.tmp']);

});

// cleans distribution directory
gulp.task('clean:dist', () => {

    return del(['dist']);

});

// Run for starting the web server
gulp.task("serve", ['ts:compile', 'ts:core:compile', 'sass:compile', 'sass:core:compile', 'pre:serve'], () => {

    browserSync(config.server);

    // run general watches
    wathches();
    // run core watches watches
    wathchesCore();

});