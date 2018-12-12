const fs = require('fs')
const path = require('path')
const glob = require('glob')

/**
 * parsing path
 */
function resolve(file, dest) {
  let fileName, filePath

  if (typeof dest === 'function') {
    dest = dest.call(this, file)
  }

  if (dest.indexOf('/') === -1) {
    fileName = dest
    filePath = ''
  } else {
    if (dest.substr(-1) === '/') {
      fileName = file.split('/').pop()
      filePath = dest
    } else {
      let _file = dest.split('/')
      fileName = _file.pop()
      filePath = _file.join('/')
    }
  }

  return {
    fileName,
    filePath
  }

}

/**
 * copy one file
 */
function copy(file, dest, flag, cb) {
  const { fileName, filePath } = resolve(file, dest)
  const _dest = path.resolve(filePath, fileName)
  fs.copyFile(path.resolve(file), _dest, flag, err => {
    if (err) {
      if (err.code === 'ENOENT') {    // file does not exist
        fs.mkdir(filePath, { recursive: true }, err => {
          // if (err) throw err
          if (err) {
            return (typeof cb === 'function') && cb(err)
          }
          copy(file, dest, cb)
        })
      }
      typeof cb === 'function' && cb(err)
      return
    }
    typeof cb === 'function' && cb(null)
  })
}

/**
 * copy file or directory
 * 
 * @param {[string]} src Pattern to be matched
 * @param {[string]} dest Destination directory
 * @param {[number]} flag is overwrite `0 | 1`
 * @param {[function]} cb Called when an error occurs, or matches are found
 */
function copyFile(src, dest, flag, cb) {
  let _src = src.substr(-1) === '/' ? src + '**' : src
  let _cb = cb, _flag = 0
  if (flag) {
    if (typeof flag === 'function') {
      _cb = flag
    } else {
      _flag = fs.constants.COPYFILE_EXCL
    }
  }
  
  glob(_src, function (err, files) {
    console.log('src : ', _src)
    // if (err) throw err
    if (err) {
      typeof _cb === 'function' && _cb(err, [], 0)
    }
    
    files.map((file, index) => {
      copy(file, dest, _flag, err => {
        typeof _cb === 'function' && _cb(err, files, index)
      })
    })
  })
}



// 1. copyFile('/imgs/**/*.jpg', 'a/b/c/')
// 2. copyFile('/imgs/**/*.jpg', 'a/b/c')
// 3. copyFile('/imgs/**/*.jpg', file => `${copy}/${file}`)
// 4. copyFile('/imgs/', file => `${copy}/${file}`)
module.exports = copyFile
