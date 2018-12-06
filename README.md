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

```js
const copy = require('simple-copy')

// copy one file
copy('images/banner.jpg', 'statics/img/bg.jpg')

// copy files
copy('images/*.jpg', 'statics/img/')

// copy files
copy('images/*.jpg', file => `statics/${file}`)

```







