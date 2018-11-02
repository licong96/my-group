var gulp = require('gulp');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var pump = require('pump');
var sass = require('gulp-sass');
var htmlmin = require('gulp-htmlmin');
var cleanCSS = require('gulp-clean-css');
var autoprefixer = require('gulp-autoprefixer');
var babel = require('gulp-babel');
var connect = require('gulp-connect');

// 清除文件夹
gulp.task('clean', function () {
	return gulp.src('dist', {read: false})
		.pipe(clean());
});

// html压缩
gulp.task('minify-html', function() {
  return gulp.src('src/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist'));
});

// sass编译
gulp.task('sass', function () {
  return gulp.src('src/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())               // 加浏览器前缀
    .pipe(gulp.dest('src/css'));
});

// css压缩
gulp.task('minify-css', function () {
  return gulp.src('src/css/*.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('dist/css'));
});

// css合并并且压缩
gulp.task('concat-css', function () {
  return gulp.src('src/css/*.css')
    .pipe(concat('app.css'))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('dist/css'));
});

// js合并
gulp.task('concat-js', function() {
  return gulp.src('src/js/*.js')
    .pipe(concat('all.js'))
    .pipe(gulp.dest('src/js'));
});

// js压缩
gulp.task('minify-js', function (cb) {
  pump([
        gulp.src('src/js/*.js'),
        uglify(),
        gulp.dest('dist')
    ],
    cb
  );
});
gulp.task('script', function() {
    // 1\. 找到文件
    gulp.src('src/js/*.js')
    // 2\. 压缩文件
        .pipe(uglify())
    // 3\. 另存压缩后的文件
        .pipe(gulp.dest('dist/js'))
})

// 启动开发版服务器
gulp.task('connect', function () {
  connect.server({
    name: 'dev',
    root: 'src',
    port: 8081,
    livereload: true
  });
});

// 启动编译版服务器
gulp.task('connectDist', function () {
  connect.server({
    name: 'dist',
    root: 'dist',
    port: 8082,
    livereload: true
  });
});

gulp.task('html', function () {
  gulp.src('src/*.html')
    .pipe(connect.reload());
});

// 启动检查
gulp.task('watch', function () {
  gulp.watch(['src/*.html'], ['html']);
  gulp.watch(['src/js/*.js'], ['html']);
  gulp.watch(['src/sass/**/*.scss'], ['sass']);
  gulp.watch(['src/css/*.css'], ['html']);
});


// 本地开发服务器
gulp.task('server', ['connect', 'watch']);
gulp.task('build', ['minify-html', 'concat-css', 'minify-js']);
