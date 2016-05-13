/**
 * 组件安装
 * npm install gulp gulp-if gulp-rev gulp-rev-replace minimist run-sequence gulp-concat gulp-rename gulp-clean gulp-jshint gulp-uglify gulp-jsonminify gulp-ruby-sass gulp-clean-css gulp-imagemin gulp-minify-html gulp-ng-annotate gulp-sourcemaps gulp-requirejs-optimize --save-dev
 */

// 引入 gulp及组件
var gulp = require('gulp'),                   //基础库
	gulpif = require('gulp-if');              //条件执行
	rev = require('gulp-rev');                //rev
	revReplace = require('gulp-rev-replace'); //rev替换
	minimist = require('minimist')            //命令行参数解析
	runSequence = require('run-sequence');    //顺序执行
	concat = require('gulp-concat'),          //合并文件
	rename = require('gulp-rename'),          //重命名
	clean = require('gulp-clean');            //清空文件夹
	jshint = require('gulp-jshint'),          //js检查
	uglify = require('gulp-uglify'),          //js压缩
	jsonminify = require('gulp-jsonminify');  //json压缩
	sass = require('gulp-ruby-sass'),         //sass
	cleanCSS = require('gulp-clean-css'),     //css压缩
	imagemin = require('gulp-imagemin'),      //image压缩
	minifyHtml = require("gulp-minify-html"); //html压缩
	ngAnnotate = require('gulp-ng-annotate'), //ng注释
	sourcemaps = require('gulp-sourcemaps'),  //source map
	requirejsOptimize = require('gulp-requirejs-optimize'); //requirejs打包
	fs = require('fs');

var SRC = './src/';
var DIST = './dist/';
var args = minimist(process.argv.slice(2));

gulp.task('clean-js', function() {
	return gulp.src(DIST + 'js')
		.pipe(clean());
});

// js处理
gulp.task('js', ['clean-js'], function() {
	var jsSrc = SRC + 'js/**/*.js',
		jsDst = DIST + 'js/';

	if(args.release) {
		gulp.src(SRC + 'js/require.js')
			.pipe(gulp.dest(jsDst));

		gulp.src(SRC + 'js/main.js')
			.pipe(requirejsOptimize())
			.pipe(gulp.dest(jsDst));
	} else {
		return gulp.src(jsSrc)
			.pipe(gulp.dest(jsDst));
	}
});

// 样式处理
gulp.task('css', function() {
	var cssSrc = SRC + 'css/index.scss',
		cssDst = DIST + 'css/';

	return sass(cssSrc)
		.pipe(gulpif(args.release, cleanCSS()))
		.pipe(gulp.dest(cssDst));
});

// 图片处理
gulp.task('image', function() {
	var imgSrc = SRC + 'image/**/*',
		imgDst = DIST + 'image/';

	return gulp.src(imgSrc)
		// .pipe(imagemin())
		.pipe(gulp.dest(imgDst));
});

gulp.task('other', function() {
	gulp.src(SRC + 'manifest.json')
		.pipe(gulpif(args.release, jsonminify()))
		.pipe(gulp.dest(DIST));

	gulp.src(SRC + 'background.js')
		.pipe(gulpif(args.release, uglify()))
		.pipe(gulp.dest(DIST));

	gulp.src(SRC + '*.html')
		.pipe(gulpif(args.release, minifyHtml()))
		.pipe(gulp.dest(DIST));
});

// 清空图片、样式、js
gulp.task('clean', function() {
	return gulp.src(DIST, {read: false})
		.pipe(clean());
});

// 默认任务
gulp.task('default', function() {
	return runSequence('clean', ['css', 'image', 'other'], 'js');
});

//发布
gulp.task('publish', function() {
	var crx = './dist.crx';

	if(!fs.existsSync(crx)) {
		console.log("please PACK first");
		return;
	}

	var publishDst = '../../public/';
	gulp.src('./dist.crx')
		.pipe(rename('KenExt.crx'))
		.pipe(gulp.dest(publishDst + "download/"));

	gulp.src('./update.xml')
		.pipe(rename('extension-update.xml'))
		.pipe(gulp.dest(publishDst));

	gulp.src(crx, {read: false})
		.pipe(clean());
});