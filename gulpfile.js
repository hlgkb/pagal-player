"use strict";
var path = require("path");
var gulp = require("gulp");
var cssshrink = require("gulp-clean-css");
var concat = require("gulp-concat");
var minify = require("gulp-minify");
var uglify = require('gulp-uglify');
var fs = require("fs");
var childProcess = require('child_process');
var install = require('gulp-install');
var clean = require("gulp-clean");
var NwBuilder = require("nw-builder");
var jslint = require('gulp-jslint-simple');
var pkg = require("./package.json");
var assert = require("assert");



var sourcePath = path.resolve(__dirname, "build", "pagal", "win32");
var repoDir = __dirname;
var issPath = path.join(__dirname, 'iss', 'setup.iss');
var innoSetupPath = path.join(path.dirname(path.dirname(require.resolve('innosetup-compiler'))), 'bin', 'ISCC.exe');
var product = {
    nameShort: "pagal",
    nameLong: "PagalPlayer",
    ExeBasename: "pagal",
    AppUserId: "pagal.player",
    RegValueName: "pagal",
    NameVersion: "PagalPlayer Beta",
    Beta: "Beta"
}

gulp.task('clean:dist', function () {
    return gulp.src('build/dist/', { read: false })
        .pipe(clean());
});

gulp.task('clean:pagal', function () {
    return gulp.src('build/pagal/', { read: false })
        .pipe(clean());
});

gulp.task('lint', function () {
    gulp.src('modules/app.js')
        .pipe(jslint.run({
            node: true,
            vars: true
        }))
        .pipe(jslint.report({
            reporter: require('jshint-stylish').reporter
        }));
});

gulp.task('css-shrink', function () {
    gulp.src(["./lib/css/*.css"])
        .pipe(cssshrink())
        .pipe(gulp.dest("./build/dist/lib/css"))
});

gulp.task('css-app', function () {
    return gulp.src(['/lib/css/app.css', "lib/css/app2.css"])
        .pipe(concat('app.css'))
        .pipe(cssshrink())
        .pipe(gulp.dest("./build/dist/lib/css"))
});

/**
 * Modules section
 *
 */
gulp.task('main-module', function () {
    return gulp.src('modules/*.js')
        /*.pipe(minify({
            ext: {
                src: '-debug.js',
                min: '.js'
            },
            noSource: ['.js']
        }))*/
        //.pipe(uglify())
        .pipe(gulp.dest('build/dist/modules'));
});

gulp.task('menu-module', function () {
    return gulp.src('modules/menu/*.js')
        /*.pipe(minify({
            ext: {
                src: '-debug.js',
                min: '.js'
            },
            noSource: ['.js']
        }))*/
        .pipe(uglify())
        .pipe(gulp.dest('build/dist/modules/menu'));
});

gulp.task('keybinding-module', function () {
    return gulp.src('modules/keybinding/*.js')
        /*.pipe(minify({
            ext: {
                src: '-debug.js',
                min: '.js'
            },
            noSource: ['.js']
        }))*/
        .pipe(uglify())
        .pipe(gulp.dest('build/dist/modules/keybinding'));
});

gulp.task('keybinding-module-config', function () {
    return gulp.src('modules/keybinding/config/*.json')
        .pipe(gulp.dest('build/dist/modules/keybinding/config'));
});

/**
 * Fonts section
 */

gulp.task('fonts', function () {
    return gulp.src('lib/fonts/**/*')
        .pipe(gulp.dest('build/dist/lib/fonts'));
});

/**
 * Images 
 */
gulp.task('images', function () {
    return gulp.src('lib/img/**/*')
        .pipe(gulp.dest('build/dist/lib/img'));
});

/**
 * Icons
 */
gulp.task('icon', function () {
    return gulp.src('lib/icon/**/*')
        .pipe(gulp.dest('build/dist/lib/icon'));
});
/**
 * Worker
 */
gulp.task('worker', function () {
    return gulp.src('worker/**/*')
        .pipe(gulp.dest('build/dist/worker'));
});

gulp.task('package.json', ['index-config'], function () {
    return (function () {
        var packageJson = require('./package.json');
        packageJson.window.show = true;
        packageJson.main = "app://pagal/index.html";
        packageJson.window.icon = "lib/img/icon.png";
        //packageJson["wcjs-prebuilt"];
        delete packageJson.nwjsBuilder;
        delete packageJson.devDependencies;
        //delete packageJson.dependencies;
        fs.writeFileSync('./build/dist/package.json', JSON.stringify(packageJson));
    } ());
});

gulp.task('wcjs-prebuilt-bin', function () {
    gulp.src(["node_modules/wcjs-prebuilt/bin/**/*"])
        .pipe(gulp.dest("build/dist/node_modules/wcjs-prebuilt/bin"));
});

gulp.task("wcjs-prebuilt", ['wcjs-prebuilt-bin'], function () {
    gulp.src(['node_modules/wcjs-prebuilt/package.json', 'node_modules/wcjs-prebuilt/index.js'])
        .pipe(gulp.dest("build/dist/node_modules/wcjs-prebuilt"));
});

gulp.task('hotkeys', ['node_modules'], function () {
    gulp.src(["node_modules/hotkeys/**/*"])
        .pipe(gulp.dest("build/dist/node_modules/hotkeys"));
});

gulp.task('index-config', function () {
    return gulp.src(['index.html', 'config.json'])
        .pipe(gulp.dest('build/dist'));
});

gulp.task('node_modules',  function () {
    return gulp.src(['./build/dist/package.json'])
        .pipe(gulp.dest('build/dist'))
        .pipe(install({ production: true }));
});

var gutil = require('gulp-util');

gulp.task('nw', ['node_modules'], function () {
    var nw = new NwBuilder({
        version: '0.12.3',
        files: './build/dist/**',
        flavor: 'normal',
        platforms: ['win32'],
        zip: false,
        appName: "pagal"
    });

    // Log stuff you want
    nw.on('log', function (msg) {
        gutil.log('nw-builder', msg);
    });

    // Build returns a promise, return it so the task isn't called in parallel
    return nw.build().catch(function (err) {
        gutil.log('nw-builder', err);
    });
});

gulp.task('nw-linux32', ['node_modules'], function () {
    var nw = new NwBuilder({
        version: '0.12.3',
        files: './build/dist/**',
        winIco: './build/app.ico',
        flavor: 'normal',
        platforms: ['linux32'],
        zip: false,
        appName: "pagal"
    });

    // Log stuff you want
    nw.on('log', function (msg) {
        gutil.log('nw-builder', msg);
    });

    // Build returns a promise, return it so the task isn't called in parallel
    return nw.build().catch(function (err) {
        gutil.log('nw-builder', err);
    });
});

gulp.task("console", function () {
    console.log(sourcePath);
});

gulp.task('changeIcon', function() {
    require("winresourcer")({
			operation: "Update", // one of Add, Update, Extract or Delete
			exeFile: "./build/pagal/win32/pagal.exe",
			resourceType: "Icongroup",
			resourceName: "IDR_MAINFRAME",
			lang: 1033, // Required, except when updating or deleting 
			resourceFile: "./lib/icon/app.ico" // Required, except when deleting
		}, function(error) {
            if (error) {
                return gutil.log('winresourcer', error);
            }
			return gutil.log('winresourcer', 'Successfully changed icon.');
		});
})


function packageInnoSetup(iss, options, cb) {
    options = options || {};

    const definitions = options.definitions || {};
    const keys = Object.keys(definitions);

    keys.forEach(key => assert(typeof definitions[key] === 'string', `Missing value for '${key}' in Inno Setup package step`));

    const defs = keys.map(key => `/d${key}=${definitions[key]}`);
    const args = [iss].concat(defs);

    console.log(args);

    childProcess.spawn(innoSetupPath, args, { stdio: 'inherit' })
        .on('error', cb)
        .on('exit', () => cb(null));
}
function buildWin32Setup(cb) {
    const definitions = {
        NameLong: product.nameLong,
        NameShort: product.nameShort,
        Version: pkg.version + " " + product.Beta,
        NameVersion: product.NameVersion,
        ExeBasename: product.ExeBasename,
        RegValueName: product.RegValueName,
        AppUserId: product.AppUserId,
        SourceDir: sourcePath,
        RepoDir: repoDir,
        DirName: product.nameLong
    };

    packageInnoSetup(issPath, { definitions }, cb);
}

gulp.task('setup', buildWin32Setup);
gulp.task('keybinding', ['keybinding-module', 'keybinding-module-config']);
gulp.task('menu', ['menu-module']);
gulp.task('modules', ['main-module', 'keybinding', 'menu']);
gulp.task('clean', ['clean:dist', 'clean:pagal']);
gulp.task('default', ['modules', 'fonts', 'images', 'icon', 'worker', 'css-shrink', 'package.json']);
gulp.task('build', ['nw']);
gulp.task('build-linux', ['nw-linux32']);