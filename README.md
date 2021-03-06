# grunt-image-diff

> Grunt implementation of Perceptual Image Diff

## Getting Started
This plugin requires Grunt `~0.4.2`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins.

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-image-diff');
```

## The "image_diff" task

### Overview
In your project's Gruntfile, add a section named `image_diff` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  image_diff: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

#### options.orig
Type: `String`
Default value: `'_orig'`

A string value original file pattern.

#### options.test
Type: `String`
Default value: `'_test'`

A string value test of difference file pattern.

#### options.diff
Type: `String`
Default value: `'_diff'`

A string value difference file pattern to write difference to the file.

#### options.fuzz
Type: `Bool`
Default value: `true`

Colors within this distance are considered equal. A number of algorithms search for a target color. By default the color must be exact. Use this option to match colors that are close to the target color in RGB space.

#### options.highlight
Type: `String`
Default value: `'red'`

when comparing images, emphasize pixel differences with this color.

### Usage Examples

#### Default Options

```js
grunt.initConfig({
  image_diff: {
	options: {
	  orig: '_orig',
	  test: '_test',
	  diff: '_diff',
	},
	src: './screenshots/*.png'
  },
});
```
## Release History
0.1.0 - First version.
