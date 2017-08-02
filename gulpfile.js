const gulp = require('gulp')
    , path = require('path')
    , _ = require('lodash')
    , ts = require('gulp-typescript')
    , sourcemaps = require('gulp-sourcemaps')
    , project = ts.createProject('tsconfig.json')
    , projectClient = ts.createProject('src/static/ts/tsconfig.json')
    , tslint = require("gulp-tslint")
    , newy = require("gulp-newy")
    , concat = require("gulp-concat")
    , uglify = require("gulp-uglify")
    , rename = require("gulp-rename")
    , replace = require("gulp-replace")
    , htmlmin = require("gulp-htmlmin")
    , browserify = require("browserify")
    , source = require("vinyl-source-stream");
;

gulp.task('_compile', () =>
    gulp.src(['src/**/*.ts', '!src/static/ts/**/*.ts'])
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
            Array(sp.split('/').length).fill('../').join('') + 'src/' + sp
        ))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/'))
);

gulp.task('_minimized_indexhtml', () =>
    gulp.src('src/static/client/index.html')
        .pipe(replace('.js"></script>', '.min.js"></script>'))
        .pipe(htmlmin({
            caseSensitive: true,
            collapseWhitespace: true
        }))
        .pipe(rename('index.min.html'))
        .pipe(gulp.dest('dist/static/client'))
);

gulp.task('_compile_client', () => {
    return gulp.src(['src/static/ts/**/*.ts', 'src/static/ts/**/*.tsx'])
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
            Array(sp.split('/').length).fill('../').join('') + 'src/' + sp
        ))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('build/js'))
        ;
});

gulp.task('_bundle_client', ['_compile_client'], () => {
    const b = browserify({ entries: './build/js/index.js', debug: true });
    b.paths = ['./node_modules/'];
    return b.bundle()
        .pipe(source('scripts.js'))
        .pipe(gulp.dest('dist/static/client'))
        ;
});

gulp.task('_minimized_client', ['_bundle_client'], () => {
    return gulp.src('dist/static/client/scripts.js')
        .pipe(uglify())
        .pipe(rename("scripts.min.js"))
        .pipe(gulp.dest('dist/static/client'));
});

gulp.task('_copy_unchanged', () =>
    gulp.src(['src/**/*.json', 'src/**/*.html'])
        .pipe(newy((pdir, srcfile, abssrcfile) => {
            const relfile = path.join.apply(
                null,
                _.drop(
                    _.dropWhile(
                        abssrcfile.split(path.sep),
                        value => value != 'src'),
                    1)
            );
            const res = path.join(pdir, 'dist', relfile);
            return res;
        }))
        .pipe(gulp.dest('dist/'))
);

gulp.task('build', ['_compile', '_minimized_client', '_copy_unchanged', '_minimized_indexhtml']);

gulp.task('_watchts', () => gulp.watch(['src/**/*.ts', '!src/static/ts/**/*.ts'], ['_compile']));

gulp.task('_watchtsclient', () => gulp.watch(['src/static/ts/**/*.ts', 'src/static/ts/**/*.tsx'], ['_minimized_client']));

gulp.task('_watchunchanged', () => gulp.watch(['src/**/*.json', 'src/**/*.html'], ['_copy_unchanged']));

gulp.task('_watch_indexhtml', () => gulp.watch(['src/static/client/index.html'], ['_minimized_indexhtml']));

gulp.task('watch', ['_watchts', '_watchtsclient', '_watchunchanged', '_watch_indexhtml']);