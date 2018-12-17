const fs = require('fs')
const path = require('path')
const glob = require('glob')


function isDir(path) {
  try {
    const stat = fs.statSync(path)
    return stat.isDirectory()
  } catch (error) {
    return false
  }
}

function getSrc(src) {
  return src.substr(-1) === '/' ? src + '**' : isDir(src) ? src + '/**' : src
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
 * copy one file
 */
function copy(file, dest, flag, cb) {
  fs.copyFile(file, dest, flag, err => {
    if (err) {
      if (err.code === 'ENOENT' || err.code === 'ENOTDIR') {    // file does not exist
        let filepath = dest.substr(0, dest.lastIndexOf('/'))
        fs.mkdir(filepath, { recursive: true }, err => {
          // if (err) throw err
          if (err) {
            return (typeof cb === 'function') && cb(err)
          }
          copy(file, dest, flag, cb)
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

  let _src = getSrc(src)

  if (typeof options === 'function') {
    _cb = options
  }
  if (Object.prototype.toString.call(options) === '[object Object]') {
    _opts = Object.assign(_opts, options)
  }

  let _flag = _opts.overwrite ? 0 : fs.constants.COPYFILE_EXCL
  
  glob(_src, function (err, files) {
    if (err || !files.length) {
      return (typeof _cb === 'function') && _cb(err, [])
    }
    
    files.map((file, index) => {
      let _dest = getDest(file, dest, _opts.depth)
      copy(path.resolve(file), _dest, _flag, err => {
        typeof _cb === 'function' && _cb(err, files, index)
      })
    })

  })
}


module.exports = copyFile
