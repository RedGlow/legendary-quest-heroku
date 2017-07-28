const gulp = require('gulp')
    , ts = require('gulp-typescript')
    , sourcemaps = require('gulp-sourcemaps')
    , project = ts.createProject('tsconfig.json')
    ;

gulp.task('build', () =>
    gulp.src('src/**/*.ts')
        .pipe(sourcemaps.init())
        .pipe(project())
        .js
        .pipe(sourcemaps.mapSources(sp =>
            Array(sp.split('/').length).fill('../').join('') + 'src/' + sp
        ))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/'))
);

gulp.task('watch', () => gulp.watch('src/**/*.ts', ['build']));