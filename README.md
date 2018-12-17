# simple-copy

> Simple copy-cli, copy files & directories width glob



## Table of Contents

- [Installation](#Installation)
- [Usage](#Usage)
- [Options](#Options)
- [CLI](#CLI)




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

// copy(srcPath, dstPath[, options, callback])



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

- `src` `{String|Object|Array}` Pattern to be matched
- `dest` `{String | Function}` Destination directory
- `Options` `{Object}` flag or callback function.
  - `overwrite` `{Boolean}`  Overwrite existing files
  - `depth` `{Boolean}`  Recursive source directory
- `cb` `{Function}` Called when an error occurs, or matches are found
  - `error` `{Error | null}`
  - `matches` `{Array<String>}` filenames found matching the pattern
  - `currentIndex` `{Number}` The index of the current matching file




## CLI


```
npm install --global simple-copy
```

or  

```
yarn add -g simple-copy
```


### CLI Useage

```
$ scopy <src> <dest> [...]

$ scopy --help
$ scopy -v
```

- `src`  Pattern to be matched
- `dest`  Destination directory
- `[options]`
  - `-O` , `--no-overwrite`  Do not overwrite the destination 
  - `-D` , `--no-depth`  Do not recursive source directory 



### Example

```bash
# Clone media to statics
$ scopy ./src/media/ ./dist/statics/

# Copy the avatar image of the png to statics directory
$ scopy imgs/avatar/*.png statics/ -D

```

