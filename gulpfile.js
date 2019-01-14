var gulp = require('gulp');
var sass = require('gulp-sass');
var rename = require("gulp-rename");
var cleanCSS = require('gulp-clean-css');
var rollup = require('rollup-stream');
var source = require('vinyl-source-stream');
var babel = require('rollup-plugin-babel');

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

function javascript() {
  return rollup({
    input: './app/javascript/main.js',
    format: 'umd',
    plugins: [
      babel({
        exclude: 'node_modules/**'
      })
    ],
  })

  // give the file the name you want to output with
  .pipe(source('bundle.js'))

  // and output to ./dist/app.js as normal.
  .pipe(gulp.dest('./app/assets/js/'));
}

function watch() {
  gulp.watch('app/styles/**/*.scss', styles);
  gulp.watch('app/javascript/**/*.js', javascript);
}

exports.styles = styles;
exports.watch = watch;

gulp.task('default', watch);
gulp.task('styles', styles);
gulp.task('javascript', javascript);

gulp.task('build', gulp.parallel(['styles', 'javascript']));
