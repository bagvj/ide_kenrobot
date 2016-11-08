/**
 * 组件安装
 * npm install gulp gulp-if gulp-rev gulp-rev-replace minimist run-sequence gulp-concat gulp-rename gulp-clean gulp-jshint gulp-uglify gulp-jsonminify gulp-ruby-sass gulp-clean-css gulp-autoprefixer gulp-imagemin gulp-minify-html gulp-ng-annotate gulp-sourcemaps gulp-requirejs-optimize --save-dev
 */

// 引入 gulp及组件
var gulp = require('gulp'),                      //基础库
	gulpif = require('gulp-if');                 //条件执行
	rev = require('gulp-rev');                   //rev
	revReplace = require('gulp-rev-replace');    //rev替换
	minimist = require('minimist')               //命令行参数解析
	runSequence = require('run-sequence');       //顺序执行
	concat = require('gulp-concat'),             //合并文件
	rename = require('gulp-rename'),             //重命名
	clean = require('gulp-clean');               //清空文件夹
	jshint = require('gulp-jshint'),             //js检查
	uglify = require('gulp-uglify'),             //js压缩
	jsonminify = require('gulp-jsonminify');     //json压缩
	sass = require('gulp-ruby-sass'),            //sass
	cleanCSS = require('gulp-clean-css'),        //css压缩
	autoprefixer = require('gulp-autoprefixer'), //自动前缀
	imagemin = require('gulp-imagemin'),         //image压缩
	minifyHtml = require("gulp-minify-html");    //html压缩
	ngAnnotate = require('gulp-ng-annotate'),    //ng注释
	sourcemaps = require('gulp-sourcemaps'),     //source map
	requirejsOptimize = require('gulp-requirejs-optimize'), //requirejs打包
	path = require('path'),
	child_process = require('child_process'),
	os = require('os');

var SRC = './resources/assets/';
var DIST = './public/assets/';
var args = minimist(process.argv.slice(2));

gulp.task('copy-env', function() {
	gulp.src('./.env')
		.pipe(clean());

	var suffix = args.release ? "release" : "debug";
	gulp.src('./.env-' + suffix)
		.pipe(rename('.env'))
		.pipe(gulp.dest('./'));
});

gulp.task('clean-js', function() {
	return gulp.src(DIST + 'js')
		.pipe(clean());
});

// js处理
gulp.task('js', ['clean-js', 'copy-env'], function() {
	var jsSrc = SRC + 'js/**/*.js',
		jsDst = DIST + 'js/';

	if(args.release) {
		gulp.src([SRC + 'js/require.js', SRC + 'js/astyle.js', SRC + 'js/go.js'])
			.pipe(gulp.dest(jsDst));

		gulp.src(SRC + 'js/index.js')
			.pipe(requirejsOptimize())
			.pipe(gulp.dest(jsDst));

		gulp.src(SRC + 'js/editor.js')
			.pipe(requirejsOptimize())
			.pipe(gulp.dest(jsDst));
	} else {
		return gulp.src(jsSrc)
			.pipe(gulp.dest(jsDst));
	}
});

// 样式处理
gulp.task('css', function() {
	var cssSrc = SRC + 'css/*.scss',
		cssDst = DIST + 'css/';

	return sass(cssSrc, {style: 'expanded'})
		.pipe(autoprefixer())
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

// font处理
gulp.task('font', function() {
	var fontSrc = SRC + 'font/**/*',
		fontDst = DIST + 'font/';

	return gulp.src(fontSrc)
		.pipe(gulp.dest(fontDst));
});

gulp.task('res', function() {
	var resSrc = SRC + 'res/**/*',
		resDst = DIST + 'res/';

	return gulp.src(resSrc)
		.pipe(gulp.dest(resDst));
});

// 清空图片、样式、js
gulp.task('clean', function() {
	return gulp.src([DIST + 'css', DIST + 'js', DIST + 'image', DIST + 'font', + DIST + 'res'], {read: false})
		.pipe(clean());
});

// 默认任务
gulp.task('default', function() {
	return runSequence('clean', ['css', 'image', 'font', 'res'], 'js');
});

function genUuid() {
	var d = new Date().getTime();
	var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = (d + Math.random() * 16) % 16 | 0;
		d = Math.floor(d / 16);
		return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
	});

	return uuid;
}

gulp.task('uuid', function() {
	var n = args.n || 1;
	console.log("uuid:")
	for(var i = 0; i < n; i++) {
		console.log(genUuid());
	}
});

// 样式处理
gulp.task('sns-css', function() {
	var cssSrc = '../sns_kenrobot/addons/theme/stv1/_static/css/mobile-index.scss',
		cssDst = '../sns_kenrobot/addons/theme/stv1/_static/css/';

	return sass(cssSrc, {style: 'expanded'})
		.pipe(autoprefixer())
		.pipe(gulpif(args.release, cleanCSS()))
		.pipe(gulp.dest(cssDst));
});

//编译解释器hex
gulp.task('interpreter', function() {
	var name = "interpreter";
	var inoSrc = "/home/arduino/libraries/KenArduino/examples/Interpreter/Interpreter.ino";
	var projectPath = os.tmpdir() + "/" + name + "/";
	var hexDist = './public/download/';

	gulp.src(inoSrc)
		.pipe(rename('main.ino'))
		.pipe(gulp.dest(projectPath));

	var cmd = "sudo sh app/Build/build.sh " + projectPath + " uno " + name;
	child_process.exec(cmd, function(error) {
		if(error) {
			console.log(error);
			return;
		}

		gulp.src(projectPath + "build.hex")
			.pipe(rename(name + '.hex'))
			.pipe(gulp.dest(hexDist));
	});
});