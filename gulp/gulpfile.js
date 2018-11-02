/**
 * Cong Min @ 蓝山工作室
 */
var gulp = require('gulp');
var path = require('path');
var del = require('del');   //删除文件
var sasscom = require('gulp-sass');     //sass编译
// var cssmin = require('gulp-clean-css');  //css压缩
var jsmin = require('gulp-uglify');     //js压缩
var imgmin = require('gulp-imagemin');  //img压缩
var htmlmin = require('gulp-htmlmin');  //html压缩
var rev = require('gulp-rev');          //静态文件生成md5-hash
var revReplace = require('gulp-rev-replace');   //文件名替换

gulp.task('sass-complie', function () {
    return gulp.src('src/css/*.scss', {base: 'src'})
        .pipe(sasscom({outputStyle: 'compressed'}))  //压缩
        .pipe(rev())                //文件名加md5-hash
        .pipe(gulp.dest('dist'))    //输出压缩文件
        .pipe(rev.manifest({
            path: path.join(__dirname, 'dist/hash.json'),
            cwd: path.join(__dirname, 'dist'),
            merge: true
        }))     //生成一个hash.json
        .pipe(gulp.dest('dist'));       //输出为dist/hash.json
});
// gulp.task('css-min',function(){
//     return gulp.src('src/css/*.css')
//         .pipe(cssmin())
//         .pipe(gulp.dest('dist/css'))
// });
gulp.task('js-min', ['sass-complie'], function () {
    return gulp.src('src/js/*.js', {base: 'src'})
        .pipe(jsmin())
        .pipe(rev())
        .pipe(gulp.dest('dist'))
        .pipe(rev.manifest({
            path: path.join(__dirname, 'dist/hash.json'),
            cwd: path.join(__dirname, 'dist'),
            merge: true
        }))
        .pipe(gulp.dest('dist'));
});
gulp.task('img-min', ['js-min'], function () {
    return gulp.src(['src/favicon.png','src/img/*'], {base: 'src'})
        .pipe(imgmin())
        .pipe(rev())
        .pipe(gulp.dest('dist'))
        .pipe(rev.manifest({
            path: path.join(__dirname, 'dist/hash.json'),
            cwd: path.join(__dirname, 'dist'),
            merge: true
        }))
        .pipe(gulp.dest('dist'));
});
gulp.task("revreplace", ['sass-complie', 'js-min', 'img-min'], function () {
    return gulp.src("src/html/*.html")
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('views'))
        .pipe(revReplace({manifest: gulp.src("dist/hash.json")}))
        .pipe(gulp.dest('views'));
});

//监听
gulp.task('watch', function () {
    gulp.watch('src/css/*.scss', ['sass-complie']);
    gulp.watch('src/js/*.js', ['js-min']);
    gulp.watch('src/img/*', ['img-min']);
});
//构建
gulp.task('build', ['revreplace']);
//清理
gulp.task('clean', function(){
    del(['dist', 'views']);
});