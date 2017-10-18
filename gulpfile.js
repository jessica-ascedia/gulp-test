var gulp = require('gulp');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');
var browserSync = require('browser-sync').create();
var uglify = require('gulp-uglify');
var imagemin = require('imagemin');
var imageminJpegtran = require('imagemin-jpegtran');

gulp.task('process', function() {
	var plugins = [
		autoprefixer,
		cssnano
  ];
  return gulp.src('sass/styles.scss')
    .pipe(sass())
	.pipe(postcss(plugins))
    .pipe(gulp.dest('processed-css'))
	.pipe(browserSync.stream());
});

gulp.task('minify-js', function() {
	return gulp.src('js/*.js')
	.pipe(uglify())
	.pipe(gulp.dest('js/min'))
	.pipe(browserSync.stream());
});

gulp.task('imagemin', function () {
	imagemin(['img/*.{jpg,png}'], 'img/min', {		plugins: [
			imageminJpegtran()
		]
	})
});

gulp.task('browser-sync', ['process'], function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
	
	gulp.watch("sass/*.scss", ['process']);
	gulp.watch("index.html", ['watch-html']);
	gulp.watch("js/*.js", ['minify-js']);
	gulp.watch("img/*.jpg", ['imagemin']);
});

gulp.task('watch-html', ['process'], function (done) {
    browserSync.reload();
    done();
});

gulp.task('default', ['browser-sync']);