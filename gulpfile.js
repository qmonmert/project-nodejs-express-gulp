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
    minifyHtml = require('gulp-minify-html'),
    rev = require('gulp-rev'),
    imagemin = require('gulp-imagemin'), // mimification img
    compass = require('gulp-compass'),
	clean = require('gulp-clean'),
	zip = require('gulp-zip'),
    usemin = require('gulp-usemin'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    copy = require('copy-dir'),
	plumber = require('gulp-plumber'); // Handle errors

// Filters
var jsFilter = filter('public/**/*.js');
var cssFilter = filter('public/**/*.css');

// Transformation task : .scss => .css
gulp.task('compass', function() {

	return gulp.src('public/stylesheets/*.scss')
		.pipe(plumber())
		.pipe(compass({
			css: 'public/stylesheets',
			sass: 'public/stylesheets',
			image: 'public/img'
		}))
		.pipe(gulp.dest('public/stylesheets'));

});

// Compress JS
gulp.task('compressJS', function() {
    return gulp.src(['public/bower_components/jquery/dist/jquery.min.js', 'public/javascripts/main.js', 'public/bower_components/bootstrap/dist/js/bootstrap.min.js'])
        .pipe(concat('combined.js'))
        .pipe(gulp.dest('dist/public/javascripts'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/public/javascripts'));

});

// Compress CSS
gulp.task('compressCSS', function() {
    return gulp.src(['public/bower_components/bootstrap/dist/css/bootstrap.css', 'public//stylesheets/style.css'])
        .pipe(concat('combined.css'))
        .pipe(minifyCss())
        .pipe(gulp.dest('dist/public/stylesheets'));

});

// Dist task 
gulp.task('dist', ['compass', 'img', 'compressJS', 'compressCSS'], function() {

    copy.sync('routes', 'dist/routes');

	var assets = useref.assets();
    
    return gulp.src('views/**/*.ejs')
        .pipe(assets)
        .pipe(jsFilter)
        .pipe(uglify())
        .pipe(jsFilter.restore())
        .pipe(cssFilter)
        .pipe(minifyCss())
        .pipe(cssFilter.restore())
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulp.dest('dist/views'));

});

// Img task
gulp.task('img', ['clean'], function() {

	return gulp.src('public/img/**/*')
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

	gulp.watch('public/stylesheets/*.scss', ['compass']).on('change', function(event) {
		console.log('Le fichier ' + event.path + ' a été modifié');
	});

	// Watch files
	gulp.watch(['app.js', 'views/*.ejs', 'routes/*.js', 'public/stylesheets/*.css']).on('change', function(event) {
		// Reload 
		console.log('Le fichier ' + event.path + ' a été rechargé');
		livereload.reload(event.path);
	});

});