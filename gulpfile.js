var gulp = require('gulp');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');
var browserSync = require('browser-sync').create();
var uglify = require('gulp-uglify');
var imagemin = require('imagemin');
var imageminJpegRecompress = require('imagemin-jpeg-recompress');
var imageminSvgo = require('imagemin-svgo');
var imageminOptipng = require('imagemin-optipng');
var imageminGifsicle = require('imagemin-gifsicle');
var spritesmith = require('gulp.spritesmith');

gulp.task('process', function() {
	var plugins = [
		autoprefixer,
		cssnano
  ];
  return gulp.src('sass/styles.scss')
    .pipe(sass().on('error', sass.logError))
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
	imagemin(['img/*.{jpg,svg,png,gif}'], 'img/min', {		plugins: [
			imageminJpegRecompress({
				quality: "low",
				max: 50
			}),
			imageminSvgo(),
			imageminOptipng(),
			imageminGifsicle()
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
	gulp.watch("img/*.{jpg,svg,png,gif}", ['imagemin']);
	gulp.watch("sprites/*.png", ['sprites']);
});

gulp.task('watch-html', ['process'], function (done) {
    browserSync.reload();
    done();
});

gulp.task('sprites', function () {
    var spriteData = gulp.src('sprites/*.png')
        .pipe(spritesmith({
            imgName: 'sprite.png',
            cssName: '_sprites.scss'
        }));
    spriteData.img.pipe(gulp.dest('img'));
    spriteData.css.pipe(gulp.dest('sass'));
});

gulp.task('default', ['browser-sync']);