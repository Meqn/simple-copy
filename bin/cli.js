#!/usr/bin/env node

const copy = require('../lib')
const pkg = require('../package.json')
const argv = process.argv.slice(2)

const program = require('commander')
const chalk = require('chalk')
const log = require('diy-log')

program
  .version(pkg.version, '-v, --version')
  .description(pkg.description)
  .usage(`<source> <destination> [...]`)
  .option('-O, --no-overwrite', 'Do not overwrite the destination')
  .option('-D, --no-depth', 'Do not recursive source directory')

const help = `
Examples : 

    $ scopy -v
    $ scopy --help

  Copy the avatar image of the png to statics directory
    $ scopy imgs/avatar/*.png statics/ -D
      // dest: './statics/*.png'
  
  Copy the src/media directory to dist/statics/media/ directory
    $ scopy ./src/media/ ./dist/statics/
      // dest: './dist/statics/media/*'
  
    `

program.on('--help', () => {
  log(help)
})


program.parse(process.argv)

const options = {
  overwrite: false,
  depth: false
}

if (program.overwrite) {
  // console.log(' -- 不覆盖文件')
  options.overwrite = true
}
if (program.depth) {
  // console.log(' -- 不克隆文件目录')
  options.depth = true
}

if (!argv.length || argv.length === 1) {
  program.outputHelp()
  process.exit(1)
} else {
  copy(argv[0], argv[1], options, (err, files, index) => {
    if (err) {
      process.exit(1)
    } else {
      const len = files.length
      if (len) {
        const progress = `${index + 1}/${len}`
        log(`[${chalk.gray(progress)}]`, log.symbols.success, files[index])

        if (files.length - 1 === index) {
          setTimeout(() => {
            log('😏  Copy task completed !  🍺 🍺 🍺')
          }, 100)
        }
      } else {
        log.warn('No matching files !')
        process.exit(1)
      }
    }

  })

}
