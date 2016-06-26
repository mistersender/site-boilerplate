'use strict';

const gulp = require('gulp');
const pkg = require('./package.json');
const minimist = require('minimist');
const runSequence = require('run-sequence');

// set up our defaults and options
const options = minimist(process.argv.slice(2), {
  default: {
    production: false
  }
});

// these are used by our gulp tasks
const $ = {
  spawn: require('child_process').spawnSync,
  chalk: require('chalk'),
  runSequence: require('run-sequence'),
  del: require('del'),
  rename: require('gulp-rename'),
  if: require('gulp-if'),
  sourcemaps: require('gulp-sourcemaps'),
  connect: require('gulp-connect')
}
const globals = {
  options: options,
  dry_run: false,
  destination_paths: {
    view: `dist`,
    lib: `dist/lib`
  },
  local_paths: {
    view: `app`,
    lib: `app/lib`
  },
  lib_included_files: { // what files should we run special gulp building on for each type of lib item?
    js: `js,jsm`,
    css: `styl,css`,
    images: `jpg,jpeg,png,gif,svg,io,ico`
  }
}

// get the abstracted gulp tasks so we can keep our logic for each thing separated out
function getTask(task, subtask) {
  let sub = subtask || 'default';
  let tasks = require('./gulp_tasks/' + task)(gulp, $, globals);
  if(tasks[sub]){
   return tasks[sub];
  }
  return tasks;
}

// Util tasks

// run this the first time the project is created to build out the folders we will need.
gulp.task('default', getTask('init'));

// Main tasks
const files = [ 'view', 'lib'];
var tasks = {
  clean: [],
  watch: [],
  build: []
};

for(var file of files) {
  // create a task for each major file type
  gulp.task(`${file}`, getTask(`${file}`, `default`));
  gulp.task(`${file}:clean`, getTask(`${file}`, `clean`));
  gulp.task(`${file}:watch`, [ `${file}` ], getTask(`${file}`, `watch`));

  // add default tasks to the list
  tasks.clean.push(`${file}:clean`);
  tasks.watch.push(`${file}:watch`);
  tasks.build.push(`${file}`);
}


// lib-specific tasks
const libs = [ 'css', 'javascript', 'images' ];
for(var file of libs) {
  // create a task for each major file type
  gulp.task(`${file}`, getTask(`${file}`, `default`));
  gulp.task(`${file}:watch`, [ `${file}` ], getTask(`${file}`, `watch`));

  // add default tasks to the list
  tasks.watch.push(`${file}:watch`);
  tasks.build.push(`${file}`);
}

// create the default tasks, like `build`
for(var task in tasks) {
  gulp.task(task, tasks[task]);
}

// override the `watch` task so we can add connect in
gulp.task('watch', function(callback){
  return runSequence(
    'serve',
    tasks.watch
  );
});

// override the `build` task if we detect `--production` build attempt
if(options.production) {
  gulp.task('build', $.runSequence(
    tasks.build
  ));
}

// And finally the connect task
gulp.task('serve', function() {
  $.connect.server({
    port: 8888,
    livereload: true
  });
});