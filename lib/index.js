const fs = require('fs')
const path = require('path')
const glob = require('glob')

/**
 * 分析输出文件路径
 * 
 * @param {[string]} file 源文件
 * @param {[string]} dest 输出文件
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
 * 复制单个文件
 * 
 * @param {[string]} file 源文件
 * @param {[string]} dest 输出文件
 * @param {[function]} cb 回调方法
 */
function copy(file, dest, cb) {
  const { fileName, filePath } = resolve(file, dest)
  const _dest = path.resolve(filePath, fileName)
  fs.copyFile(path.resolve(file), _dest, err => {
    if (err) {
      if (err.code === 'ENOENT') {    // 文件不存在
        fs.mkdir(filePath, { recursive: true }, err => {
          if (err) throw err
          copy(file, dest, cb)
        })
      }
      return
    }
    typeof cb === 'function' && cb()
  })
}

/**
 * 复制文件或目录
 * 
 * @param {[string]} src 源文件
 * @param {[string]} dest 输出文件
 * @param {[function]} cb 回调方法
 */
function copyFile(src, dest, cb) {
  glob(src, function (err, files) {
    if (err) throw err
    files.map((file, index) => {
      copy(file, dest, () => {
        typeof cb === 'function' && cb(files, index)
      })
    })
  })
}



// 1. copyFile('/imgs/**/*.jpg', 'a/b/c/')
// 2. copyFile('/imgs/**/*.jpg', 'a/b/c')
// 3. copyFile('/imgs/**/*.jpg', file => `${copy}/${file}`)
module.exports = copyFile
