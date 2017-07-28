const gulp = require('gulp')
    , ts = require('gulp-typescript')
    , project = ts.createProject('tsconfig.json')
    ;

gulp.task('build', () =>
    gulp.src('src/**/*.ts')
        .pipe(project())
        .js.pipe(gulp.dest('dist/'))
);