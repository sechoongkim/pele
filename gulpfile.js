"use strict";

var gulp = require('gulp');
var connect = require('gulp-connect'); //Runs a local dev server
var open = require('gulp-open'); //Open a url in a web browser
var browserify = require('browserify'); //bundles js 
var reactify = require('reactify'); // transforms react jsx to js
var source = require('vinyl-source-stream'); // use conventional text streams with gulp
var concat = require('gulp-concat'); //concats files 
var lint = require('gulp-eslint'); //lints js and jsx files

var config = {
	port: 9005,
	devBaseUrl: 'http://localhost',
	paths: {
		html: './src/*.html',
		dist: './dist',
		mainJs: './src/main.js',
		css: [
			'node_modules/bootstrap/dist/css/bootstrap.min.css',
			'node_modules/bootstrap/dist/css/bootstrap-theme.min.css'
		],
		js: './src/**/*.js'
	}
}

//start a local dev server
gulp.task('connect', function(){
	connect.server({
		root: ['dist'],
		port: config.port,
		base: config.devBaseUrl,
		livereload: true
	})
})

//get index.html and open it at localhost 
gulp.task('open', ['connect'], function(){
	gulp.src('dist/index.html')
		.pipe(open({url: config.devBaseUrl + ":" + config.port + '/'}))
})


//place all html files in dist and then reload 
gulp.task('html', function(){
	gulp.src(config.paths.html)
		.pipe(gulp.dest(config.paths.dist))
		.pipe(connect.reload());
});


gulp.task('js', function(){
	browserify(config.paths.mainJs)
	.transform(reactify)
	.bundle()
	.on('error', console.error.bind(console))
	.pipe(source('bundle.js'))
	.pipe(gulp.dest(config.paths.dist + '/scripts'))
	.pipe(connect.reload());
})

gulp.task('css', function(){
	gulp.src(config.paths.css)
		.pipe(concat('bundle.css'))
		.pipe(gulp.dest(config.paths.dist + '/css'));
})

gulp.task('watch', function(){
	gulp.watch(config.paths.html, ['html']);	
	gulp.watch(config.paths.html, ['js', 'lint']);	

})

gulp.task('lint', function(){
	return gulp.src(config.paths.js)
	.pipe(lint({configFile: 'eslint.config.json'}))
	.pipe(lint.format());
});

//upon typing gulp in command line these tasks will start 
gulp.task('default', ['html', 'open', 'watch', 'js', 'css', 'lint']);
