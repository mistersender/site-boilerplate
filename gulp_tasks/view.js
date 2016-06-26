var pug = require('gulp-pug');

module.exports = function (gulp, $, globals, subtask) {
  return {
    default: function() {
      gulp.src([`./${globals.local_paths.view}/**/[!_]*.pug`])
        .pipe(pug({pretty: true}))
        .pipe(gulp.dest(globals.destination_paths.view))
        .pipe($.connect.reload());

      gulp.src([`./${globals.local_paths.view}/**/*.html`])
        .pipe(gulp.dest(globals.destination_paths.view))
        .pipe($.connect.reload());
    },
    clean: function() {
      $.del([ `${globals.destination_paths.view}/*`], { dryRun: globals.dry_run, force: true }).then(paths => {
       console.log('Deleted view files and folders:\n', paths.join('\n'));
      });
    },
    watch: function() {
      gulp.watch(`./${globals.local_paths.view}/**/*.pug`, ['view']);
      gulp.watch(`./${globals.local_paths.view}/**/*.html`, ['view']);
    }
  };
};
