var gulp = require('gulp');
var watch = require('gulp-watch');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');

var conf = {
    modules: 'node_modules',
    public: 'public',
    dist: 'public/dist'
}

gulp.task('minify-css', function() {
    return gulp.src('public/css/*.css')
            .pipe(cleanCSS())
            .pipe(gulp.dest(conf.dist))
});

gulp.task('minify-js', function() {
    return gulp.src('public/js/*.js')
            .pipe(uglify())
            .pipe(gulp.dest(conf.dist))
});

gulp.task('fontawesome', function() {
    gulp.src(conf.modules+'/font-awesome/css/font-awesome.min.css')
        .pipe(gulp.dest(conf.dist));

    return gulp.src(conf.modules+'/font-awesome/fonts/*')
            .pipe(gulp.dest(conf.public + '/fonts'));
});

gulp.task('angular', function() {
    return gulp.src(conf.modules +  '/angular/angular.min.js')
        .pipe(gulp.dest(conf.dist));
});

gulp.task('watch-css', function() {
    return gulp.watch('public/css/*.css', ['minify-css']);
});

gulp.task('default', ['minify-css', 'minify-js', 'fontawesome', 'angular']);
