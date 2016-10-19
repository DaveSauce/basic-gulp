/* jshint esversion:6 */

import gulp from 'gulp';
import browserSync from 'browser-sync';

import less from 'gulp-less';
import autoprefixer from 'gulp-autoprefixer';
import cssnano from 'gulp-cssnano';
import base64 from 'gulp-base64-inline';

import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import gulpIf from 'gulp-if';

// Preprocess less
gulp.task( 'less', function() {
  return gulp.src( 'app/less/main.less' ) // specific file since I'm importing all less into main.less
    .pipe( less() )
    .pipe( base64() ) // options available: https://www.npmjs.com/package/gulp-base64
    .pipe( autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    // .pipe( gulpIf( '*.css', cssnano())) // Put back in for Production
    .pipe( gulp.dest( 'build' ) )
    .pipe( browserSync.reload({
      stream: true
    }));
});

// Concat javascript.
// This only works if all JS is in the same directory. Use gulp-useref if multiple dirs are needed
// Files are specified by name to determine order.
gulp.task( 'scripts', function() {
  return gulp.src( [ 'app/js/modernizr-custom.js', 'app/js/main.js', 'app/js/home.js'] )
    .pipe( concat( 'scripts.js' ))
    // .pipe( gulpIf( '*.js', uglify()))  // Put back in for Production
    .pipe( gulp.dest( 'build' ))
    .pipe( browserSync.reload({
      stream: true
    }));
});

// Hot reload
gulp.task( 'browserSync', function() {
  browserSync.init( {
    server: {
      baseDir: 'build'
    }
  });
});

// Watcher task
gulp.task( 'watch', [ 'browserSync', 'less' ], function() {
  gulp.watch( 'app/less/*.less', [ 'less' ]);
  gulp.watch( 'app/js/*.js', [ 'scripts' ]); // watches all .js files, even if not concatenated
  gulp.watch( 'build/*.html', browserSync.reload );
});
