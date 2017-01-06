var gulp = require('gulp');
var gls = require('gulp-live-server');
var less = require('gulp-less');

// Convert less to css
gulp.task('less', function () {
    return gulp.src('public/stylesheets/less/**/*.less')
        .pipe(less())
        .pipe(gulp.dest('public/stylesheets'));
});

// Watch for changes in files and restart server
gulp.task('serve', ['less'], function () {
    var app = gls.new('server.js');
    app.start();
    gulp.watch(['server.js', 'public/stylesheets/less/**/*.less', './**/*.html'], ['less', function (file) {
        app.start.bind(app)();
    }]);
});
