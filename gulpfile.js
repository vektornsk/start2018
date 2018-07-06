
'use strict';

const gulp = require('gulp'),
      path = require('path'),
      notify = require( 'gulp-notify' ),
      pug = require('gulp-pug'),
      less = require('gulp-less'),
      autoprefixer = require('gulp-autoprefixer'),
      sourcemaps = require('gulp-sourcemaps'),
      watcher = require('gulp-watch'),
      browserSync = require('browser-sync').create(),
      reload = browserSync.reload,
      imagemin = require('gulp-imagemin'),
      tiny = require('gulp-tinypng-nokey'),
      pngquant = require('imagemin-pngquant');

const src = path.join(__dirname, 'src'),
      st = path.join(__dirname, 'static');


gulp.task('default', ['browser-sync', 'watch']);


gulp.task('less', function(){
  function run() {
    return gulp.src(src + '/less/style.less')
    .pipe(sourcemaps.init())
    .pipe(less())
		.on('error', notify.onError({
			title: 'LESS ERROR',
			message: '@ <%= error.message%>'
		}))
    .pipe(autoprefixer({browsers: ['last 5 versions']}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(st + '/css'))
		.pipe(browserSync.reload({stream: true}));
  }

  watcher([src + '/less/**/*', '!**/*___jb_tmp___'], run);

  return run();
});

gulp.task('pug', function(){
  gulp.src(src + '/pug/*.pug')
    .pipe(watcher([src + '/pug/*.pug', '!**/*___jb_tmp___']))
    .pipe(pug({
      pretty: true
    }))
    .on('error', notify.onError({
      title: 'JADE ERROR',
      message: '@ <%= error.message%>'
    }))
    .pipe(gulp.dest(st + '/html'));
});


gulp.task('browser-sync',  function() {
  browserSync.init({
    server: {
      baseDir: st
    },
    notify: false
  });
});

gulp.task('watch', ['pug', 'less'], function(){
  gulp.watch(src + '/pug/**/*', ['pug']).on('change', reload);
  watcher([st + '/js/**/*','!**/*___jb_tmp___'], reload)
});

gulp.task('compress', function () {
  function png() {
    return gulp.src(st + '/img/**/*{png, PNG}')
      .pipe(tiny())
      .pipe(gulp.dest(st + '/img/compressed')); 
  }
  function all() {
    return gulp.src(st + '/img/**/*{jpg,jpeg,gif,svg,JPG}')
      .pipe(imagemin({
        progressive: true,
        optimizationLevel: 10,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant()]
      }))
      .pipe(gulp.dest(st + '/img/compressed')); 
  }
  all();
  png();
});


