/*************************************************
		gulp configuration file by tonypro
**************************************************/

'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify-es').default;
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var del = require('del');
var runSequence = require('run-sequence');
var gulpCopy = require('gulp-copy');


//embedded project server
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'app'
    },
  })
})

//concatenate and minify js and css files
gulp.task('useref', function(){
  return gulp.src('app/*.html')
    .pipe(useref())
    // Minifies only if it's a JavaScript file
    .pipe(gulpIf('*.js', uglify()))
    // Minifies only if it's a CSS file
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'))
});

//optimizing images
gulp.task('images', function(){
  return gulp.src('app/assets/images/**/*.+(png|jpg|jpeg|gif|svg)')
  .pipe(imagemin({
      // Setting interlaced to true
      interlaced: true
    }))
  .pipe(gulp.dest('dist/assets/images'))
});

//copy fonts files to the dist directory
gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'))
});

gulp.task('copy', function(){
  return gulp.src('app/sw.js, app/favicon.ico')
    .pipe(gulp.dest('dist'))
});

//cleanning the dist folter
gulp.task('clean:dist', function() {
  return del.sync('dist');
});

// here we watch for the filles on user saved
gulp.task('watch', ['browserSync'], function (){
 	gulp.watch('app/assets/css/*.css', browserSync.reload); 
  	gulp.watch('app/*.html', browserSync.reload); 
  	gulp.watch('app/assets/js/*.js', browserSync.reload); 
});

//here we build the production package
gulp.task('build', function (callback) {
  runSequence('clean:dist', 
    ['useref', 'images', 'fonts', 'copy'],
    callback
  )
})


// Here we start our serve and start watch files change
gulp.task('serve', function (callback) {
  runSequence(['browserSync', 'watch'],
    callback
  )
});
