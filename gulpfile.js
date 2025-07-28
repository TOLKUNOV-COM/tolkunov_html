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

const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');

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
    cb();
}

/**
 *
 * CLEAN TASKS
 *
 */

function cleanCssBootstrap() {
    return del(['build/assets/css/bootstrap*.css']);
}

function cleanCssMy() {
    return del(['build/assets/css/*.css', '!build/assets/css/bootstrap*.css']);
}

function cleanJs() {
    return del(['build/assets/js/*.js']);
}

function cleanImg() {
    return del(['build/assets/img/*']);
}

function cleanFonts() {
    return del(['build/assets/fonts/**/*.*']);
}

function cleanTemplates() {
    return del(['build/*.html']);
}

const cleanCss = gulp.parallel(cleanCssBootstrap, cleanCssMy);
const clean = gulp.parallel(cleanCss, cleanJs, cleanImg, cleanFonts, cleanTemplates);

/**
 *
 * BUILD TASKS
 *
 */

function bootstrap() {
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
}

function lessTask() {
    return gulp.src(paths.less)
        .pipe(sourcemaps.init())
        //.pipe(concat('common.less'))
        .pipe(less({
            paths: ['src/less/bootstrap', path.resolve(paths.bootstrap, 'less'), path.resolve(paths.bootstrap, 'less/mixins'), 'src/less']
        }))
        .on('error', log)
        .pipe(postcss([
            autoprefixer({ overrideBrowserslist: AUTOPREFIXER_BROWSERS, cascade: false })
        ]))
        .pipe(concat('common.css'))
        .pipe(cleanCSS({debug: true}, function (details) {
            console.log(details.name + ': ' + details.stats.originalSize);
            console.log(details.name + ': ' + details.stats.minifiedSize);
        }))
        .pipe(rename({suffix: ".min"}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./build/assets/css'))
        .pipe(browserSync.stream({match: '**/*.css'}));
}

function tailwindMain() {
    return gulp.src('src/css/main.css') // путь до твоего main.css
        .pipe(sourcemaps.init())
        .pipe(postcss([
            require('@tailwindcss/postcss'),
            require('autoprefixer')
        ]))
        .on('error', log)
        .pipe(rename({ basename: 'main', suffix: '.min' }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./build/assets/css'))
        .pipe(browserSync.stream({match: '**/*.css'}));
}

function js() {
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
}

function img() {
    return gulp.src(paths.images)
        .pipe(changed('./build/assets/img'))
        //.pipe(imagemin({
        //    progressive: true,
        //    interlaced: true,
        //svgoPlugins: [{removeViewBox: false}, {removeUselessStrokeAndFill: false}]
        //}))
        .pipe(imagemin())
        .pipe(gulp.dest('./build/assets/img'));
}

function fonts() {
    return gulp.src(paths.fonts)
        .pipe(gulp.dest('./build/assets/fonts'));
}

/**
 * Compile jade files into HTML
 */
function templates() {
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
}

function templatesFull() {
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
}

/**
 * Important!!
 * Separate task for the reaction to `.jade` files
 */
const jadeWatch = gulp.series(templates, reloadCb);
const jadeVarsWatch = gulp.series(templatesFull, reloadCb);
const jsWatch = gulp.series(js, reloadCb);

// watch files for changes and reload
function watch() {
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

    gulp.watch(paths.templates, {cwd: '.'}, jadeWatch);
    gulp.watch(['./template_locals.yml'], {cwd: '.'}, jadeVarsWatch);
    //gulp.watch(['*.html']).on('change', reload);
    gulp.watch(['src/less/bootstrap/*.less', 'src/less/bootstrap/*', 'src/less/bootstrap/**/*.less'], {cwd: '.'}, gulp.series(cleanCssBootstrap, bootstrap)).on('error', log);
    gulp.watch(['src/css/**/*.css'], {cwd: '.'}, tailwindMain).on('error', log);
    gulp.watch(paths.less, {cwd: '.'}, gulp.series(cleanCssMy, lessTask)).on('error', log);
    gulp.watch(paths.scripts, {cwd: '.'}, jsWatch).on('error', log);
    gulp.watch(paths.images, {cwd: '.'}, gulp.series(img, reload));
}

const build = gulp.series(
    clean,
    gulp.parallel(
        gulp.series(cleanCssBootstrap, bootstrap),
        gulp.series(cleanCssMy, lessTask),
        tailwindMain,
        gulp.series(cleanJs, js),
        img,
        fonts,
        templates
    )
);

function defaultTask(cb) {
    return build(cb);
}

/**
 * Usage:
 * gulp block -b my-block-name
 * gulp block -b my-block-name -js
 */
function block() {
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
}

// Регистрируем задачи в Gulp 4
gulp.task('clean:css:bootstrap', cleanCssBootstrap);
gulp.task('clean:css:my', cleanCssMy);
gulp.task('clean:css', cleanCss);
gulp.task('clean:js', cleanJs);
gulp.task('clean:img', cleanImg);
gulp.task('clean:fonts', cleanFonts);
gulp.task('clean:templates', cleanTemplates);
gulp.task('clean', clean);

gulp.task('bootstrap', gulp.series(cleanCssBootstrap, bootstrap));
gulp.task('less', gulp.series(cleanCssMy, lessTask));
gulp.task('tailwind:main', tailwindMain);
gulp.task('js', gulp.series(cleanJs, js));
gulp.task('img', img);
gulp.task('fonts', fonts);
gulp.task('templates', templates);
gulp.task('templates-full', templatesFull);

gulp.task('jade-watch', jadeWatch);
gulp.task('jade-vars-watch', jadeVarsWatch);
gulp.task('js-watch', jsWatch);

gulp.task('watch', gulp.series(build, watch));
gulp.task('build', build);
gulp.task('default', defaultTask);
gulp.task('block', block);
