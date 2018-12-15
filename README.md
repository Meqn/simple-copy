# simple-copy

> Simple, copy files & directories width glob


## Installation

```
npm install simple-copy --save-dev
```

or

```
yarn add -D simple-copy
```



## Usage

> ⚠️  Directory must end with `/` 

eg. `/statics/images/`

```js
const copy = require('simple-copy')

/**
 * copy one file
 */
copy('images/banner.jpg', 'statics/img/bg.jpg')


/**
 * copy files
 */
copy('images/*.jpg', 'statics/img/')
// overwrite
copy('images/**', 'statics/img/')
// do not overwrite
copy('images/**', 'statics/img/', { overwrite: false })



/**
 * copy directory
 */
copy('images/', file => `statics/${Date.now()}/${file}`)
copy('images/**', file => `statics/${file}`)

```



## Options

```js
copy(srcPath, dstPath[, options, callback])
```

### src

- `src` `{String|Object|Array}` Pattern to be matched
- `dest` `{String | Function}` Destination directory
- `Options` `{Object}` flag or callback function.
  - `overwrite`  Overwrite existing files
  - `depth` Recursive source directory
- `cb` `{Function}` Called when an error occurs, or matches are found
  - `error` `{Error | null}`
  - `matches` `{Array<String>}` filenames found matching the pattern
  - `currentIndex` `{Number}` The index of the current matching file





