# Site Boilerplate
Something to get started with for creating new sites.
All files are pushed to the `dist` folder.

## Gulp
To initialize the site, run `gulp`. This will install necessary folders. Should only need to run once.
@todo- Probably can automate this with `npm install`

#### Primary Gulp Tasks
- `gulp watch` - watches for changes (also issues clean & build commands)
- `gulp build --production` - builds a more optimized `dist` directory for deploying.

## HTML
compiles `html` or `pug` templates (formerly `jade`)

## JS
- compiles `es6`
- sourcemaps added
- minifies
- renames to have `.min` in name

## CSS
- compiles `stylus`
- adds sourcemaps
- autoprefixer
- mqpacker
- minifies
- renames to have `.min` in name

## Images
- auto-compresses images
