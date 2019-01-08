var gulp = require('gulp');
var sass = require('gulp-sass');
var rename = require("gulp-rename");
var cleanCSS = require('gulp-clean-css');

function styles() {
  return gulp.src('app/styles/**/*.scss')
    .pipe(sass({
      includePaths: 'node_modules'
    }))
    .pipe(cleanCSS())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('app/assets/css'))
    .on('error', (err) => {
      console.log(err)
      process.exit(1)
    })
}

function watch() {
  gulp.watch('app/styles/**/*.scss', styles);
}

exports.styles = styles;
exports.watch = watch;

gulp.task('default', watch);
gulp.task('styles', styles);
