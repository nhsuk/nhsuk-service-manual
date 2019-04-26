var gulp = require('gulp');
var sass = require('gulp-sass');
var rename = require("gulp-rename");
var cleanCSS = require('gulp-clean-css');
var rollup = require('rollup-stream');
var source = require('vinyl-source-stream');
var babel = require('rollup-plugin-babel');
var resolve = require('rollup-plugin-node-resolve');
var uglify = require('gulp-uglify');
var package = require('./package.json');

function styles() {
  return gulp.src('app/styles/**/*.scss')
    .pipe(sass({
      includePaths: 'node_modules'
    }))
    .pipe(cleanCSS())
    .pipe(rename({
      suffix: `-${package.version}.min`
    }))
    .pipe(gulp.dest('public/css'))
    .on('error', (err) => {
      console.log(err)
      process.exit(1)
    })
}

function javascript() {
  return rollup({
    input: './app/scripts/main.js',
    format: 'umd',
    plugins: [
      resolve({
        browser: true,
      }),
      babel({
        exclude: 'node_modules/**'
      })
    ],
  })

  // give the file the name you want to output with
  .pipe(source('bundle.js'))

  // and output to ./dist/app.js as normal.
  .pipe(gulp.dest('public/js/'));
}

/* Minify the JS file for release */
function minifyJS() {
  return gulp.src([
    'public/js/*.js',
    '!public/js/*.min.js', // don't re-minify minified javascript
  ])
    .pipe(uglify())
    .pipe(rename({
      suffix: `.min`
    }))
    .pipe(gulp.dest('public/js/'))
}

function assets() {
  return gulp.src('app/assets/**')
    .pipe(gulp.dest('public/assets/'))
}

function watch() {
  gulp.watch('app/styles/**/*.scss', styles);
  gulp.watch('app/scripts/**/*.js', javascript);
  gulp.watch('app/assets/**/*.*', assets);
}

exports.styles = styles;
exports.assets = assets;
exports.javascript = javascript;
exports.minifyJS = minifyJS;
exports.watch = watch;

gulp.task('default', watch);
gulp.task('styles', styles);
gulp.task('javascript', javascript);
gulp.task('assets', assets);
gulp.task('minifyJS', minifyJS);

gulp.task('build', gulp.parallel(['styles', 'javascript', 'assets']));
