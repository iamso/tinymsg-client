'use strict';

const gulp            = require('gulp');

const babel           = require('gulp-babel');
const rename          = require('gulp-rename');
const banner          = require('gulp-banner');
const replace         = require('gulp-replace');
const notify          = require('gulp-notify');
const bump            = require('gulp-bump');
const strip           = require('gulp-strip-comments');

const pkg             = require('./package.json');

const comment         = `/*!
 * ${pkg.name} - version ${pkg.version}
 *
 * Made with ❤ by ${pkg.author.name} ${pkg.author.email}
 *
 * Copyright (c) ${(new Date()).getFullYear()} ${pkg.author.name}
 */
`;

const src             = {
  jsAll:        'src/*.js',
  jsDest:       'build',
  jsEmbed:      'build/embed',
};

const babelMinify = [
  'minify',
  {
    mangle: {
      exclude: []
    },
    deadcode: true,
    removeConsole: true,
    removeDebugger: true,
    removeUndefined: true,
    builtIns: false,
  }
];

gulp.task('js:es5', () => {
  return gulp.src(src.jsAll)
    .pipe(rename('Msg.js'))
    .pipe(babel({
      presets: [
        ['@babel/env', {
          modules: false,
          targets: {
            ie: 11
          },
        }],
        {comments: false}
      ],
      plugins: [
        ['remove-import-export', {
          'removeImport': false,
          'removeExport': true,
          'removeExportDefault': false,
          'preseveNamedDeclaration': false
        }]
      ]
    }))
    .pipe(rename('client.js'))
    .pipe(banner(comment))
    .pipe(gulp.dest(src.jsEmbed))
    .pipe(strip())
    .pipe(babel({
      presets: [babelMinify, {comments: false}]
    }))
    .pipe(rename('client.min.js'))
    .pipe(banner(comment))
    .pipe(gulp.dest(src.jsEmbed));
});

gulp.task('js:esm', () => {
  return gulp.src(src.jsAll)
    .pipe(rename('client.esm.js'))
    .pipe(banner(comment))
    .pipe(gulp.dest(src.jsEmbed))
    .pipe(strip())
    .pipe(babel({
      presets: [babelMinify, {comments: false}]
    }))
    .pipe(rename('client.esm.min.js'))
    .pipe(banner(comment))
    .pipe(gulp.dest(src.jsEmbed));
});

gulp.task('js', gulp.series('js:es5', 'js:esm', () => {
  return gulp.src(`${src.jsEmbed}/**/*.js`)
    .pipe(replace(/<%=url%>/g, ''))
    .pipe(gulp.dest(src.jsDest))
    .pipe(notify('js done'));
}));

gulp.task('watch', (done) => {
  gulp.watch(src.jsAll, ['js']);
  done();
});

gulp.task('bump:pre', () => {
   return gulp.src(['./bower.json', './component.json', './package.json', './package-lock.json'])
    .pipe(bump({type: 'prerelease'}))
    .pipe(gulp.dest('./'));
});

gulp.task('bump:patch', () => {
   return gulp.src(['./bower.json', './component.json', './package.json', './package-lock.json'])
    .pipe(bump({type: 'patch'}))
    .pipe(gulp.dest('./'));
});

gulp.task('bump:minor', () => {
   return gulp.src(['./bower.json', './component.json', './package.json', './package-lock.json'])
    .pipe(bump({type: 'minor'}))
    .pipe(gulp.dest('./'));
});

gulp.task('bump:major', () => {
   return gulp.src(['./bower.json', './component.json', './package.json', './package-lock.json'])
    .pipe(bump({type: 'major'}))
    .pipe(gulp.dest('./'));
});

gulp.task('dist', gulp.series('js', () => {
  return gulp.src('./')
    .pipe(notify('dist done'));
}));

gulp.task('default', gulp.series('dist', 'watch'));

// generic error handler
function onError(err) {
  gutil.log(err.message);
  this.emit('end');
}
