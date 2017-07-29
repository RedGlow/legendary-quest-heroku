const gulp = require('gulp')
    , ts = require('gulp-typescript')
    , sourcemaps = require('gulp-sourcemaps')
    , project = ts.createProject('tsconfig.json')
    , tslint = require("gulp-tslint")
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

gulp.task('_copy_json', () =>
    gulp.src('src/**/*.json')
        .pipe(gulp.dest('dist/'))
);

gulp.task('build', ['_compile', '_copy_json']);

gulp.task('watch', () => gulp.watch('src/**/*.ts', ['build']));