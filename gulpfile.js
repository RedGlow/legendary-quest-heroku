const gulp = require("gulp")
    , path = require("path")
    , _ = require("lodash")
    , ts = require("gulp-typescript")
    , sourcemaps = require("gulp-sourcemaps")
    , project = ts.createProject("tsconfig.json")
    , projectClient = ts.createProject("src/static/ts/tsconfig.json")
    , projectTestClient = ts.createProject("src/static/ts/tsconfig.json")
    , tslint = require("gulp-tslint")
    , newy = require("gulp-newy")
    , concat = require("gulp-concat")
    , uglify = require("gulp-uglify")
    , rename = require("gulp-rename")
    , replace = require("gulp-replace")
    , htmlmin = require("gulp-htmlmin")
    , browserify = require("browserify")
    , source = require("vinyl-source-stream")
    , glob = require("glob")
    , envify = require("envify/custom")
    , uglifyify = require("uglifyify")
    , bundleCollapser = require("bundle-collapser/plugin")
    ;


/**
 * SERVER TYPESCRIPT FILES
 */

// lint, compile, and sourcemaps all server TypeScript files
const compileServerTsSources = ["src/**/*.ts", "!src/static/ts/**/*.ts"];
gulp.task("_compile_server_ts", () =>
    gulp.src(compileServerTsSources)
        .pipe(tslint({
            formatter: "prose"
        }))
        .pipe(tslint.report({
            emitError: false
        }))
        .pipe(sourcemaps.init())
        .pipe(project())
        .js
        .pipe(sourcemaps.mapSources(sp =>
            Array(sp.split("/").length).fill("../").join("") + "src/" + sp
        ))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("dist/"))
);

// watch for changes in server TypeScript files
gulp.task("_watchts", () => gulp.watch(
    compileServerTsSources,
    ["_compile_server_ts"]));


/**
 * INDEX.HTML
 */

// produce a minimized index.html (called index.min.html)
gulp.task("_minimize_indexhtml", () =>
    gulp.src("src/static/client/index.html")
        .pipe(replace(".js\"></script>", ".min.js\"></script>"))
        .pipe(htmlmin({
            caseSensitive: true,
            collapseWhitespace: true
        }))
        .pipe(rename("index.min.html"))
        .pipe(gulp.dest("dist/static/client"))
);

// watch for changes in index.html
gulp.task("_watch_indexhtml", () => gulp.watch(
    ["src/static/client/index.html"],
    ["_minimize_indexhtml"]));


/**
 * CLIENT TYPESCRIPT FILES FOR THE TESTS
 */

// lint, compile and sourcemaps all the client TypeScript files for the tests
const compileTestclientTsSources = ["src/static/ts/**/*.ts"];
gulp.task("_compile_testclient_ts", () => {
    return gulp.src(compileTestclientTsSources)
        .pipe(tslint({
            formatter: "prose"
        }))
        .pipe(tslint.report({
            emitError: false
        }))
        .pipe(sourcemaps.init())
        .pipe(projectTestClient())
        .js
        .pipe(sourcemaps.mapSources(sp =>
            Array(sp.split("/").length).fill("../").join("") + "src/" + sp
        ))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("build/js"))
        ;
});

// bundle together all the TypeScript files for the tests with browserify
const bundleTestclientJsSources = "./build/js/**/*.spec.js";
gulp.task("_bundle_testclient_js", ["_compile_testclient_ts"], () => {
    const files = glob.sync(bundleTestclientJsSources);
    const b = browserify({ entries: files, debug: true });
    b.paths = ["./node_modules/"];
    return b.bundle()
        .pipe(source("testscripts.js"))
        .pipe(gulp.dest("dist/static/client"))
        ;
});

gulp.task("_watchtstestclient", () => gulp.watch(
    compileTestclientTsSources,
    ["_bundle_testclient_js"]));


/**
 * CLIENT TYPESCRIPT FILES
 */

// lint, compile and sourcemaps all the client TypeScript files
const compileClientTsSources = ["src/static/ts/**/*.ts", "!src/static/ts/**/*.spec.ts", "src/static/ts/**/*.tsx"];
gulp.task("_compile_client_ts", () => {
    return gulp.src(compileClientTsSources)
        .pipe(tslint({
            formatter: "prose"
        }))
        .pipe(tslint.report({
            emitError: false
        }))
        .pipe(sourcemaps.init())
        .pipe(projectClient())
        .js
        .pipe(sourcemaps.mapSources(sp =>
            Array(sp.split("/").length).fill("../").join("") + "src/" + sp
        ))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("build/js"))
        ;
});

// bundle together all the client TypeScript files with browserify
const bundleClientJsSources = "./build/js/index.js";
gulp.task("_bundle_client_js", ["_compile_client_ts"], () => {
    const bundler = browserify({ entries: bundleClientJsSources, debug: true });
    bundler.paths = ["./node_modules/"];
    return bundler.bundle()
        .pipe(source("scripts.js"))
        .pipe(gulp.dest("dist/static/client"))
        ;
});

// produce a minimized version of the javascript for the client
const minimizeClientJsSources = "dist/static/client/scripts.js";
gulp.task("_minimize_client_js_pre", ["_bundle_client_js"], () => {
    /*return gulp.src(minimizeClientJsSources)
        .pipe(uglify({
            compress: true,
            mangle: true
        }))
        .pipe(rename("scripts.min.js"))
        .pipe(gulp.dest("dist/static/client"));*/
    process.env.NODE_ENV = "production";
    process.env.BROWSER = "true";
    const bundler = browserify({ entries: bundleClientJsSources, debug: true });
    bundler.transform(envify({
        NODE_ENV: "production",
        BROWSER: "true"
    }), {
            global: true
        });
    bundler.plugin(bundleCollapser);
    bundler.paths = ["./node_modules/"];
    return bundler.bundle()
        .pipe(source("scripts.min.js"))
        .pipe(gulp.dest("build/"))
        ;
});

gulp.task("_minimize_client_js", ["_minimize_client_js_pre"], () => {
    return gulp.src("build/scripts.min.js")
        .pipe(uglify({
            compress: true,
            mangle: true
        }))
        .pipe(gulp.dest("dist/static/client"))
        ;
});

gulp.task("_watchtsclient", () => gulp.watch(
    compileClientTsSources,
    ["_minimize_client_js"]));


/**
 * UNCHANGED FILES
 */

// copy the files that need no transformations
const copyUnchangedSources = ["src/**/*.json", "!src/**/tsconfig.json", "src/**/*.html"];
gulp.task("_copy_unchanged", () =>
    gulp.src(copyUnchangedSources)
        .pipe(newy((pdir, srcfile, abssrcfile) => {
            const relfile = path.join.apply(
                null,
                _.drop(
                    _.dropWhile(
                        abssrcfile.split(path.sep),
                        value => value != "src"),
                    1)
            );
            const res = path.join(pdir, "dist", relfile);
            return res;
        }))
        .pipe(gulp.dest("dist/"))
);

gulp.task("_watchunchanged", () => gulp.watch(
    copyUnchangedSources
    ["_copy_unchanged"]));


/**
 * MAIN TASKS
 */

// build all: server scripts, client scripts, test scripts, minimized and verbatim contents
gulp.task("build", [
    "_compile_server_ts",
    "_copy_unchanged",
    "_minimize_client_js",
    "_bundle_testclient_js",
    "_minimize_indexhtml"]);

gulp.task("watch", [
    "_watchts",
    "_watchtsclient",
    "_watchtstestclient",
    "_watchunchanged",
    "_watch_indexhtml"]);