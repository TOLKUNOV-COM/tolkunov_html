const fs = require('fs');

var gulp = require('gulp'); // Сообственно Gulp JS
var changed = require('gulp-changed');
var cached = require('gulp-cached');
var filter = require('gulp-filter');
var open = require('gulp-open');
const imagemin = require('gulp-imagemin'); // Минификация изображений
var uglify = require('gulp-uglify'); // Минификация JS
var concat = require('gulp-concat'); // Склейка файлов
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var del = require('del');

var cleanCSS = require('gulp-clean-css'); // сжимает, оптимизирует
const sourcemaps = require('gulp-sourcemaps');

var less = require('gulp-less');
var path = require('path');
var rename = require("gulp-rename");  // переименовывает

var autoprefixer = require('gulp-autoprefixer');

var jade = require('gulp-jade');
const collector = require('gulp-collector');

const yaml = require('js-yaml');

var jadeInheritance = require('gulp-jade-inheritance');

var paths = {
    scripts: ['src/assets/js/*.js', 'src/blocks/*', 'src/blocks/**/*.js'],
    images: ['src/assets/img/*.{jpg,jpeg,png,gif,bmp,svg}', 'src/assets/img/**', 'src/assets/img/*'],
    fonts: ['src/assets/fonts/**/*.*'],
    less: ['src/less/bootstrap/variables.less', 'src/less/*.less', 'src/blocks/*', 'src/blocks/**/*.less'],
    bootstrap: 'build/assets/vendor/bootstrap',
    templates: ['src/templates/*.jade', 'src/templates/**/*.jade']
};

// Browser definitions for autoprefixer
var AUTOPREFIXER_BROWSERS = [
    'last 3 versions',
    'ie >= 9',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
];

/**
 *
 * COMMON
 *
 */

function log(error) {
    console.log([
        '',
        "----------ERROR MESSAGE START----------",
        ("[" + error.name + " in " + error.plugin + "]"),
        error.message,
        "----------ERROR MESSAGE END----------",
        ''
    ].join('\n'));

    this.emit('end');
}

var reloadCb = function (cb) {
    browserSync.reload();
    return cb();
}

/**
 *
 * TASKS
 *
 */

gulp.task('clean:css:bootstrap', function (cb) {
    return del(['build/assets/css/bootstrap*.css'], cb);
});

gulp.task('clean:css:my', function (cb) {
    return del(['build/assets/css/*.css', '!build/assets/css/bootstrap*.css'], cb);
});

gulp.task('clean:css', ['clean:css:bootstrap', 'clean:css:my']);

gulp.task('clean:js', function (cb) {
    return del(['build/assets/js/*.js'], cb);
});

gulp.task('clean:img', function (cb) {
    return del(['build/assets/img/*'], cb);
});
gulp.task('clean:fonts', function (cb) {
    return del(['build/assets/fonts/**/*.*'], cb);
});

gulp.task('clean:templates', function (cb) {
    return del(['build/*.html'], cb);
});

gulp.task('clean', ['clean:css', 'clean:js', 'clean:img', 'clean:fonts', 'clean:templates']);

gulp.task('bootstrap', ['clean:css:bootstrap'], function () {
    return gulp.src(['./src/less/bootstrap/bootstrap.less'])
        .pipe(sourcemaps.init())
        .pipe(less({
            paths: [path.resolve(paths.bootstrap, 'less')]
        }))
        .on('error', log)
        .pipe(concat('bootstrap.css'))
        .pipe(gulp.dest('./build/assets/css'))
        .pipe(cleanCSS({debug: true}, function (details) {
            console.log(details.name + ': ' + details.stats.originalSize);
            console.log(details.name + ': ' + details.stats.minifiedSize);
        }))
        .pipe(rename({suffix: ".min"}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./build/assets/css'))
        .pipe(browserSync.stream({match: '**/*.css'}));
});

gulp.task('less', ['clean:css:my'], function () {
    return gulp.src(paths.less)
        .pipe(sourcemaps.init())
        //.pipe(concat('common.less'))
        .pipe(less({
            paths: ['src/less/bootstrap', path.resolve(paths.bootstrap, 'less'), path.resolve(paths.bootstrap, 'less/mixins'), 'src/less']
        }))
        .on('error', log)
        .pipe(autoprefixer({
            browsers: AUTOPREFIXER_BROWSERS,
            cascade: false
        }))
        .pipe(concat('common.css'))
        .pipe(cleanCSS({debug: true}, function (details) {
            console.log(details.name + ': ' + details.stats.originalSize);
            console.log(details.name + ': ' + details.stats.minifiedSize);
        }))
        .pipe(rename({suffix: ".min"}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./build/assets/css'))
        .pipe(browserSync.stream({match: '**/*.css'}));
});

gulp.task('js', ['clean:js'], function () {
    return gulp.src(paths.scripts)
        //.pipe(sourcemaps.init())
        // .pipe(uglify())
        .on('error', log)
        .pipe(concat('script.js')) // Собираем все JS, кроме тех которые находятся в ./assets/js/vendor/**
        //.pipe(sourcemaps.write())
        //sourcemaps.write('./', {
        //    includeContent: false,
        //    sourceRoot: '/app/scss'
        //})
        .pipe(gulp.dest('./build/assets/js'));
    //.pipe(reload({stream: true}));
});

gulp.task('img', [], function () {
    gulp.src(paths.images)
        .pipe(changed('./build/assets/img'))
        //.pipe(imagemin({
        //    progressive: true,
        //    interlaced: true,
        //svgoPlugins: [{removeViewBox: false}, {removeUselessStrokeAndFill: false}]
        //}))
        .pipe(imagemin())
        .pipe(gulp.dest('./build/assets/img'));
});
gulp.task('fonts', [], function () {
    gulp.src(paths.fonts)
        .pipe(gulp.dest('./build/assets/fonts'));
});

/**
 * Compile jade files into HTML
 */
gulp.task('templates', [/*'clean:templates'*/], function () {
    //var YOUR_LOCALS = JSON.parse(fs.readFileSync('./template_locals.json', 'utf8'));

    // Get document, or throw exception on error
    try {
        var YOUR_LOCALS = yaml.safeLoad(fs.readFileSync('./template_locals.yml', 'utf8'));
    } catch (e) {
        console.error(e);
    }

    return gulp.src(paths.templates)

        //only pass unchanged *main* files and *all* the partials
        .pipe(changed('build', {extension: '.html'}))

        //filter out unchanged partials, but it only works when watching
        .pipe(cached('jade'))
        //.pipe(gulpif(global.isWatching, cached('jade')))

        //find files that depend on the files that have changed
        .pipe(jadeInheritance({basedir: 'src/templates'}))

        //filter out partials (folders and files starting with "_" )
        .pipe(filter(function (file) {
            //console.log(file.relative);
            return !/^includes/.test(file.relative) && !/^layouts/.test(file.relative);
        }))

        .pipe(jade({
            locals: YOUR_LOCALS,
            pretty: true
        }))
        .on('error', log)
        .pipe(gulp.dest('build'));
});

gulp.task('templates-full', [], function () {
    try {
        var YOUR_LOCALS = yaml.safeLoad(fs.readFileSync('./template_locals.yml', 'utf8'));
    } catch (e) {
        console.error(e);
    }

    return gulp.src(paths.templates)

        //filter out partials (folders and files starting with "_" )
        .pipe(filter(function (file) {
            return !/^includes/.test(file.relative) && !/^layouts/.test(file.relative);
        }))

        .pipe(jade({
            locals: YOUR_LOCALS,
            pretty: true
        }))
        .on('error', log)
        .pipe(gulp.dest('build'));
});

/**
 * Important!!
 * Separate task for the reaction to `.jade` files
 */
gulp.task('jade-watch', ['templates'], reloadCb);

gulp.task('jade-vars-watch', ['templates-full'], reloadCb);

// create a task that ensures the `js` task is complete before
// reloading browsers
gulp.task('js-watch', ['js'], reloadCb);

// watch files for changes and reload
gulp.task('watch', ['build'], function () {
    var argv = require('minimist')(process.argv.slice(2));

    browserSync.init({
        server: './build',
        open: false,
        logPrefix: function () {
            return '[' + (new Date()).toLocaleString("ru", {}) + '] ';
        },
        logConnections: true,
        ghostMode: false,
        reloadOnRestart: true,
        // tunnel: "my-private-site",
        // xip: true,
        // Don't show any notifications in the browser.
        notify: false
    }, function (err, server) {
        if (argv.open) {
            var url = server.options.get('urls').get('local');

            gulp.src('./build/*.html')
                .pipe(open(url + '/<%=file.path.replace(file.base,"")%>', {app: 'chrome'}));
        }
    });

    gulp.watch(paths.templates, {cwd: '.'}, ['jade-watch']);
    gulp.watch(['./template_locals.yml'], {cwd: '.'}, ['jade-vars-watch']);
    //gulp.watch(['*.html']).on('change', reload);
    gulp.watch(['src/less/bootstrap/*.less', 'src/less/bootstrap/*', 'src/less/bootstrap/**/*.less'], {cwd: '.'}, ['bootstrap']).on('error', log);
    gulp.watch(paths.less, {cwd: '.'}, ['less']).on('error', log);
    gulp.watch(paths.scripts, {cwd: '.'}, ['js-watch']).on('error', log);
    gulp.watch(paths.images, {cwd: '.'}, ['img', reload]);
});

gulp.task('build', ['clean', 'bootstrap', 'less', 'js', 'img', 'fonts', 'templates'], function () {

});

gulp.task('default', ['build'], function () {
    // place code for your default task here
});

/**
 * Usage:
 * gulp block -b my-block-name
 * gulp block -b my-block-name -js
 */
gulp.task('block', function () {
    var argv = require('minimist')(process.argv.slice(2));

    var blockName = (typeof (argv.b) == 'undefined') ? argv._[1] : argv.b;
    var needCreateJsFile = process.argv.indexOf('-js') !== -1;

    if (typeof blockName == 'undefined') {
        return console.error('get me a block name!');
    }

    blockName = 'b-' + blockName;
    var blockPath = 'src/blocks/' + blockName + '/';
    var lessFilename = blockPath + blockName + '.less';
    var jsFilePath = blockPath + blockName + '.js';

    if (!fs.existsSync(blockPath)) {
        fs.mkdirSync(blockPath);

        var content = "" +
            "@import \"variables.less\";\n" +
            "@import \"mixins\";\n\n" +
            '.' + blockName + ' {\n\n}';
        fs.writeFileSync(lessFilename, content);

        open(lessFilename, "PhpStorm.exe");
    } else {
        console.log('Block path already exists! File not created.');
    }

    /* Create js file */
    if (needCreateJsFile) {
        if (!fs.existsSync(jsFilePath)) {
            var content = "$(function () {\n\n});";
            fs.writeFileSync(jsFilePath, content);

            console.log('js file created!');
        } else {
            console.log('js file already exists! File not created.');
        }
    }

    /* Collect css classes and paste it to less file */
    var sourceClassNames = [];
    var existingClassNames = [];
    var r = new RegExp('\.' + blockName + '[_]{1,2}[a-z\-_1-9]+', 'gi');

    gulp.src(['src/templates/*.jade', 'src/templates/**/*.jade'])
        .pipe(collector(function (files, dirname) {
            for (i in files) {
                var content = files[i];

                var result = content.match(r);

                if (Array.isArray(result)) {
                    for (className in result) {
                        sourceClassNames.push(result[className]);
                    }
                }
            }
        }, {}, function () {
            gulp.src(paths.less)
                .pipe(collector(function (files, dirname) {
                    for (i in files) {
                        var content = files[i];

                        var result = content.match(r);

                        if (Array.isArray(result)) {
                            for (className in result) {
                                existingClassNames.push(result[className]);
                            }
                        }
                    }
                }, {}, function (some) {
                    //console.log('Source classes', sourceClassNames);
                    //console.log('Existing classes', existingClassNames);

                    var newClassNames = sourceClassNames.filter(function (className) {
                        return existingClassNames.indexOf(className) === -1;
                    }).filter(function (element, index, array) {
                        return array.indexOf(element) === index;
                    });

                    console.log('Added classes', newClassNames);

                    var content = '\n';

                    newClassNames.forEach(function (className) {
                        content += className + ' {\n\n}\n';
                    });

                    fs.appendFileSync(lessFilename, content);
                }));

        }));
});
