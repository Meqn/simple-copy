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

> ⚠️  directory required `/` 

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
// do not overwrite
copy('images/*.jpg', 'statics/img/', 1)
// overwrite
copy('images/*.jpg', 'statics/img/', (error, files, index) => consoel.log(files[index]))


/**
 * copy files
 */
copy('images/*.jpg', file => `statics/${file}`)


/**
 * copy directory
 */
copy('images/', file => `statics/${file}`)
copy('images/**', file => `statics/${file}`)

```



## Options

```js
const copy = require('simple-copy')


copy(src, dest, flag, callback)
```

### src

- `src` `{String|Object|Array}` Pattern to be matched
- `dest` `{String | Function}` Destination directory
- `flag` `{Number}` flag or callback function. `{0 | 1}` or `{Function}`
- `cb` `{Function}` Called when an error occurs, or matches are found
  - `error` `{Error | null}`
  - `matches` `{Array<String>}` filenames found matching the pattern
  - `currentIndex` `{Number}` The index of the current matching file


