const fs = require('fs')
const path = require('path')
const glob = require('glob')


function isDirectory(path) {
  try {
    const stat = fs.statSync(path)
    return stat.isDirectory()
  } catch (error) {
    return false
  }
}

function getSrc(src) {
  if (typeof src === 'string') {
    return src.substr(-1) === '/' ? src + '**' : isDirectory(src) ? src + '/**' : src
  }
  return src
}

function getDest(file, dest, depth) {
  let fullpath
  if (typeof dest === 'function') {
    dest = dest.call(this, file)
  }
  if (dest.substr(-1) === '/') {
    if (depth) {
      fullpath = path.resolve(dest, file)
    } else {
      fullpath = path.resolve(dest, file.split('/').pop())
    }
  } else {
    fullpath = path.resolve(dest)
  }
  
  return fullpath
}


/**
 * read files (JS | CLI)
 */
function readFiles(src) {
  let _src = getSrc(src)

  return new Promise(resolve => {
    if (Array.isArray(src)) {
      resolve([null, src])
    } else if (typeof src === 'string') {
      glob(_src, function (err, files) {
        resolve([err, files])
      })
    }
  })
}

/**
 * copy one file
 */
function copyOne(file, dest, flag, cb) {
  fs.copyFile(file, dest, flag, err => {
    if (err) {
      if (err.code === 'ENOENT') {    // file does not exist
        fs.mkdir(path.dirname(dest), { recursive: true }, err => {
          // if (err) throw err
          if (err) {
            return (typeof cb === 'function') && cb(err)
          }
          copyOne(file, dest, flag, cb)
        })
      }
      return (typeof cb === 'function') && cb(err)
    }
    typeof cb === 'function' && cb(null)
  })
}

/**
 * copy file or directory
 * @param {[String]} src Pattern to be matched
 * @param {[String | Function]} dest Destination directory
 * @param {[, Object | Function]} options 
 * @param {[, Function]} cb Called when an error occurs, or matches are found
 */
function copyFile(src, dest, options = {}, cb) {
  let _cb = cb

  let _opts = {
    overwrite: true,
    depth: true
  }

  if (typeof options === 'function') {
    _cb = options
  }
  if (Object.prototype.toString.call(options) === '[object Object]') {
    _opts = Object.assign(_opts, options)
  }

  let _flag = _opts.overwrite ? 0 : fs.constants.COPYFILE_EXCL
  
  readFiles(src).then(res => {
    const files = res[1]
    if (Array.isArray(files)) {
      files.map((file, index) => {
        let _dest = getDest(file, dest, _opts.depth)
        copyOne(path.resolve(file), _dest, _flag, err => {
          typeof _cb === 'function' && _cb(err, files, index)
        })
      })
    } else {
      return (typeof _cb === 'function') && _cb(err, [])
    }
  })
}


module.exports = copyFile
