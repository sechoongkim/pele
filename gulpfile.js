"use strict";

var gulp = require('gulp');
var connect = require('gulp-connect'); //Runs a local dev server
var open = require('gulp-open'); //Open a url in a web browser

var config = {
	port: 9005,
	devBaseUrl: 'http://localhost',
	paths: {
		html: './src/*.html',
		dist: './dist'
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

gulp.task('watch', function(){
	gulp.watch(config.paths.html, ['html']);	
})

//upon typing gulp in command line these tasks will start 
gulp.task('default', ['html', 'open', 'watch']);
