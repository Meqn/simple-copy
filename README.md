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

// copy one file
copy('images/banner.jpg', 'statics/img/bg.jpg')

// copy files
copy('images/*.jpg', 'statics/img/')

// copy files
copy('images/*.jpg', file => `statics/${file}`)

// copy directory
copy('images/', file => `statics/${file}`)
copy('images/**', file => `statics/${file}`)

```



## option

```js
const copy = require('simple-copy')

/**
 * copy files or directory
 * 
 * @param {[string]} src 源文件
 * @param {[string]} dest 输出文件
 * @param {[number]} flag 是否覆盖: {0: 覆盖, 1: 不覆盖}
 * @param {[function]} cb 回调方法
 */
copy(src, dest, flag, callback)
```




