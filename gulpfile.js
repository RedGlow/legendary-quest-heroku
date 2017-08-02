const gulp = require('gulp')
    , path = require('path')
    , _ = require('lodash')
    , ts = require('gulp-typescript')
    , sourcemaps = require('gulp-sourcemaps')
    , project = ts.createProject('tsconfig.json')
    , tslint = require("gulp-tslint")
    , newy = require("gulp-newy")
    ;

gulp.task('_compile', () =>
    gulp.src('src/**/*.ts')
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

gulp.task('build', ['_compile', '_copy_unchanged']);

gulp.task('_watchts', () => gulp.watch(['src/**/*.ts'], ['_compile']));

gulp.task('_watchunchanged', () => gulp.watch(['src/**/*.json', 'src/**/*.html'], ['_copy_unchanged']));

gulp.task('watch', ['_watchts', '_watchunchanged']);