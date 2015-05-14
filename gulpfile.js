/**
 * GULP
 *
 * Commands :
 *  - gulp
 *  - gulp watch
 */

// Modules
var gulp = require('gulp'),
	livereload = require('gulp-livereload'),
	useref = require('gulp-useref'),
	filter = require('gulp-filter'),
    uglify = require('gulp-uglify'), // mimification JS 
    minifyCss = require('gulp-minify-css'), // mimification CSS 
    imagemin = require('gulp-imagemin') // mimification img
    compass = require('gulp-compass')
	clean = require('gulp-clean')
	zip = require('gulp-zip')
	plumber = require('gulp-plumber'); // Handle errors

// Filters
var jsFilter = filter('**/*.js');
var cssFilter = filter('**/*.css');

// Transformation task : .scss => .css
gulp.task('compass', function() {

	return gulp.src('css/*.scss')
		.pipe(plumber())
		.pipe(compass({
			css: 'css',
			sass: 'css',
			image: 'img'
		}))
		.pipe(gulp.dest('css'));

});

// Dist task 
gulp.task('dist', ['compass', 'img'], function() {

	var assets = useref.assets();
    
    return gulp.src('*.html')
        .pipe(assets)
        .pipe(jsFilter)
        .pipe(uglify())
        .pipe(jsFilter.restore())
        .pipe(cssFilter)
        .pipe(minifyCss())
        .pipe(cssFilter.restore())
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulp.dest('dist'));

});

// Img task
gulp.task('img', ['clean'], function() {

	return gulp.src('img/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/img'));

});

// Clean task
gulp.task('clean', function() {

	return gulp.src('dist', {read: false})
		.pipe(clean());

});

// Default task
gulp.task('default', ['dist'], function() {
	return gulp.src('dist/**/*')
		.pipe(zip('dist.zip'))
		.pipe(gulp.dest('.'));
});

// Watch 
gulp.task('watch', function() {

	livereload.listen();

	gulp.watch('css/*.scss', ['compass']).on('change', function(event) {
		console.log('Le fichier ' + event.path + ' a été modifié');
	});

	// Watch files
	gulp.watch(['app.js', 'views/*.jade', 'routes/*.js', 'public/stylesheets/*.css']).on('change', function(event) {
		// Reload 
		console.log('Le fichier ' + event.path + ' a été rechargé');
		livereload.reload(event.path);
	});

});