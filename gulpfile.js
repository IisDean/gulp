/**
 * Created by Dean on 2018/7/31.
 */
var gulp = require('gulp'),
    sass = require('gulp-sass'),//sass编译
    browserSync = require('browser-sync'),//浏览器刷新
    useref = require('gulp-useref'),//文件合并
    uglify = require('gulp-uglify'),//文件压缩
    gulpIf = require('gulp-if'),//
    minifyCss = require('gulp-minify-css'),//css压缩
    imagemin = require('gulp-imagemin'),//图片压缩
    cache = require('gulp-cache'),//
    del = require('del'),//删除
    runSequence = require('run-sequence');//运行顺序

gulp.task('sass', function () {
    //scass编译
    return gulp.src('app/scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('browserSync',function(){
    //浏览器刷新
    return browserSync({
        server: {
            baseDir: 'app'
        }
    });
});

gulp.task('watch',['sass', 'browserSync'], function () {
    //自动检测
    gulp.watch('app/scss/**/*scss', ['sass']);
});

gulp.task('useref',function(){
    //js/css压缩
    return gulp.src('app/*.html')
        .pipe(gulpIf('*.css', minifyCss()))
        .pipe(gulpIf('*.js',uglify()))
        .pipe(useref())
        .pipe(gulp.dest('dist'));
});

gulp.task('imagemin',function(){
    //图片压缩
    return gulp.src('app/images/*.+(png|jpg|gif|svg)')
        .pipe(cache(imagemin({
            interlaced: true
        })))
        .pipe(gulp.dest('dist/images'));
});

gulp.task('clean',function(callback){
//删除
    del('dist');
    return cache.clearAll(callback);
});

gulp.task('clean:dist',function(callback){
    return del(['dist/**/*','!dist/images','!dist/images/**/*'],callback);
});

gulp.task('build',function(){
    runSequence('clean:dist',['sass','useref','imagemin']);
});

gulp.task('default',function(){
    runSequence(['sass','browserSync','watch']);
})