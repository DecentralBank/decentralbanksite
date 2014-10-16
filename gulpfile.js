var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload');

gulp.task('styles', function() {
    return gulp.src(['assets/scss/**/*.scss'])
        .pipe(sass(
            {
                style: 'expanded',
                compass: true,
                trace: true
            }))
        .pipe(autoprefixer('last 2 version', 'safari 5','ie 9','ios 6', 'android 4'))
        .pipe(gulp.dest('assets/dist/css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest('assets/dist/css'));
//        .pipe(notify({ message: 'Styles task complete' }));
});

gulp.task('clean', function() {
    return gulp.src(['assets/dist/css'], {read: false})
        .pipe(clean());
});

gulp.task('default', ['clean'], function() {
    gulp.start('styles');
});

// Watch
gulp.task('watch', function() {

    // Watch .scss files
    gulp.watch('assets/scss/**/*.scss', ['styles']);

    // Create LiveReload server
    var server = livereload();

    // Watch any files in dist/, reload on change
    gulp.watch(['assets/dist/**']).on('change', function(file) {
        server.changed(file.path);
    });

});