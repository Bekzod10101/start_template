var gulp = require('gulp'),
	less = require('gulp-less'),
	browserSync = require('browser-sync'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglifyjs'),
	cssnano = require('gulp-cssnano'),
	rename = require('gulp-rename'),
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),
	autoprefixer = require('gulp-autoprefixer'),
	plumber = require('gulp-plumber'),
	coffee = require('gulp-coffee'),
	del = require('del'),
	cache = require('gulp-cache');

gulp.task('heavy', function(){
	console.log('im holding on, why is everything so heavy');
});
gulp.task('less', function(){
	return gulp.src('app/less/**/*.less')
	.pipe(plumber())
	.pipe(less())
	.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true}))
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.reload({stream: true}))
});

gulp.task('browser-sync', function(){
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify : false
	})
});
gulp.task('css-libs', ['less'], function(){
	return gulp.src('app/css/libs.css')
	.pipe(cssnano())
	.pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest('app/css'));
});
gulp.task('scripts', function(){
	return gulp.src([
		'app/libs/jquery/dist/jquery.js'
	])
	.pipe(concat('libs.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('app/js'));
});

gulp.task('img', function(){
	return gulp.src('app/img/**/*')
	.pipe(imagemin({

		interlaced: true,
		progressive: true,
		svgoPlugins: [{removeViewBox: false}],
		use: [pngquant()]
	}))
	.pipe(gulp.dest('dist/img'));
}); 

gulp.task('watch', ['browser-sync', 'less', 'scripts'], function(){
	gulp.watch('app/less/**/*.less', ['less']);
	gulp.watch('app/scripts/**/*.js', browserSync.reload);
    gulp.watch('app/*.html', browserSync.reload); 
});
gulp.task('clean', function(){
	return del.sync('dist');
});
gulp.task('build', ['scripts', 'less', 'img', 'clean'], function(){

	var BuildCss = gulp.src('app/css/**/*.css')
	.pipe(gulp.dest('dist/css'))

	var BuildFonts = gulp.src('app/fonts/**/*')
	.pipe(gulp.dest('dist/fonts'))

	var BuildJs = gulp.src('app/js/**/*')
	.pipe(gulp.dest('dist/js'))
	var buildHtml = gulp.src('app/*.html') 
    .pipe(gulp.dest('dist'));
    var buildVideo = gulp.src('video/*.mp4') 
    .pipe(gulp.dest('dist/video'));
});