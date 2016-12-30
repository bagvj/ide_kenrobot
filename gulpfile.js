/**
 * 组件安装
 * npm install --save-dev gulp gulp-if gulp-rename gulp-clean gulp-ruby-sass gulp-clean-css gulp-autoprefixer gulp-requirejs-optimize run-sequence minimist fs-extra uuid
 */

// 引入 gulp及组件
const gulp = require('gulp')                      //基础库
const gulpif = require('gulp-if')                 //条件执行
const rename = require('gulp-rename')             //重命名
const clean = require('gulp-clean')               //清空文件夹
const sass = require('gulp-ruby-sass')            //sass
const cleanCSS = require('gulp-clean-css')        //css压缩
const autoprefixer = require('gulp-autoprefixer') //自动前缀
const requirejsOptimize = require('gulp-requirejs-optimize') //requirejs打包

const runSequence = require('run-sequence')       //顺序执行
const minimist = require('minimist')              //命令行参数解析
const fs = require('fs-extra')                    //文件操作
const uuid = require('uuid')

const path = require('path')                      //路径
const child_process = require('child_process')    //子进程
const os = require('os')                          //操作系统相关
const crypto = require('crypto')                  //加密

var args = minimist(process.argv.slice(2))        //命令行参数

const ASSETS_SRC = './resources/assets/'
const ASSETS_DIST = './public/assets/'

gulp.task('replace-env', callback => {
	var name = ".env"
	var suffix = args.release ? "release" : "debug"
	fs.removeSync(name)
	fs.copySync(name + "-" + suffix, name)
	callback()
})

gulp.task('clean-js', _ => {
	return gulp.src(ASSETS_DIST + 'js', {read: false})
		.pipe(clean())
})

gulp.task('clean-css', _ => {
	return gulp.src(ASSETS_DIST + 'css', {read: false})
		.pipe(clean())
})

gulp.task('clean-image', _ => {
	return gulp.src(ASSETS_DIST + 'image', {read: false})
		.pipe(clean())
})

gulp.task('clean-font', _ => {
	return gulp.src(ASSETS_DIST + 'font', {read: false})
		.pipe(clean())
})

gulp.task('clean-res', _ => {
	return gulp.src(ASSETS_DIST + 'res', {read: false})
		.pipe(clean())
})

gulp.task('pack-js', ['clean-js'], callback => {
	if(args.release) {
		gulp.src([ASSETS_SRC + 'js/require.js', ASSETS_SRC + 'js/astyle.js', ASSETS_SRC + 'js/go.js'])
			.pipe(gulp.dest(ASSETS_DIST + 'js/'))
			
		gulp.src([ASSETS_SRC + 'js/index.js'])
			.pipe(requirejsOptimize({
				useStrict: true,
				optimize: args.min == 'false' ? "none" : "uglify",
			}))
			.pipe(gulp.dest(ASSETS_DIST + 'js/'))

		gulp.src(ASSETS_SRC + 'js/editor.js')
			.pipe(requirejsOptimize({
				useStrict: true,
				optimize: args.min == 'false' ? "none" : "uglify",
			}))
			.pipe(gulp.dest(ASSETS_DIST + 'js/'))
	} else {
		return gulp.src(ASSETS_SRC + 'js/**/*.js')
			.pipe(gulp.dest(ASSETS_DIST + 'js/'))
	}
})

gulp.task('pack-css', ['clean-css'], _ => {
	return sass(ASSETS_SRC + 'css/*.scss', {style: "expanded"})
		.pipe(autoprefixer())
		.pipe(gulpif(args.release, cleanCSS()))
		.pipe(gulp.dest(ASSETS_DIST + 'css/'))
})

gulp.task('pack-image', ['clean-image'], _ => {
	return gulp.src(ASSETS_SRC + 'image/**/*')
		.pipe(gulp.dest(ASSETS_DIST + 'image/'))
})

gulp.task('pack-font', ['clean-font'], _ => {
	return gulp.src(ASSETS_SRC + 'font/**/*')
		.pipe(gulp.dest(ASSETS_DIST + 'font/'))
})

gulp.task('pack-res', ['clean-res'], _ => {
	return gulp.src(ASSETS_SRC + 'res/**/*')
		.pipe(gulp.dest(ASSETS_DIST + 'res/'))
})

gulp.task('pack', ['replace-env', 'pack-res', 'pack-image', 'pack-font', 'pack-css', 'pack-js'])

gulp.task('default', ['pack'])

//编译解释器hex
gulp.task('interpreter', callback => {
	var name = "interpreter"
	var inoSrc = "/home/arduino/libraries/KenArduino/examples/Interpreter/Interpreter.ino"
	var projectPath = path.join(os.tmpdir(), name)
	var hexDist = './public/download/'

	gulp.src(inoSrc)
		.pipe(rename('main.ino'))
		.pipe(gulp.dest(projectPath));

	var cmd = `sudo sh app/Shell/build.sh ${projectPath} uno ${name}`;
	child_process.exec(cmd, err => {
		if(err) {
			console.error(err)
			callback(err)
			return
		}

		gulp.src(path.join(projectPath, "build.hex"))
			.pipe(rename(name + '.hex'))
			.pipe(gulp.dest(hexDist))

		callback()
	})
})