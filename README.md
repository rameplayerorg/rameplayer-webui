# RamePlayer WebUI
Angular Web UI for RamePlayer

[![Build Status](https://travis-ci.org/rameplayerorg/rameplayer-webui.svg?branch=master)](https://travis-ci.org/rameplayerorg/rameplayer-webui)

## Requirements

- Install Node
	- on Linux install [nvm](https://github.com/creationix/nvm)
	- on OSX install [home brew](http://brew.sh/) and type `brew install node`
	- on Windows install [chocolatey](https://chocolatey.org/) and type `choco install nodejs`
- On OSX you can alleviate the need to run as sudo by [following these instructions](https://github.com/sindresorhus/guides/blob/master/npm-global-without-sudo.md)
- Open terminal
- Type `npm install bower gulp`
- For building you need: `npm install del gulp-angular-templatecache gulp-load-plugins gulp-autoprefixer gulp-bytediff gulp-concat gulp-filter gulp-inject gulp-jscs gulp-jshint gulp-minify-css gulp-minify-html gulp-notify gulp-ng-annotate gulp-rev gulp-rev-replace gulp-task-listing gulp-uglify jshint-stylish merge-stream`

## Installing Node.js and Bower Packages
- Open terminal
- Type `npm install`

## Installing Bower Packages
`npm install` will install these too, but you can do it manually.
- Open terminal
- Type `bower install`

## Running

Just open `src/index.html` with your browser.

### Building

Type `gulp build` to make an optimized build. New build will be created into directory `build` (created if not exists). See the `gulpfile.js` for details.

### Cleaning

Type `gulp clean` to clean build directory.
