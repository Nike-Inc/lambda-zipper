'use strict'

const concat = require('concat-stream')
const exec = require('child_process').exec
const path = require('path')
const fs = require('fs')
const archiver = require('archiver')
const bytes = require('bytes')
const mkdirp = require('mkdirp')
const globby = require('globby')

module.exports = {
  build
}

function build({ files, workingDir, outputPath, flattenRoot }) {
  if (!files) {
    throw new Error('missing required parameter "files"')
  }
  if (!outputPath) {
    throw new Error('missing required parameter "outputPath"')
  }
  if (!workingDir) workingDir = process.cwd()

  let npm = exec('npm ls --prod --parseable', { cwd: workingDir })
  npm.stderr.pipe(process.stderr)
  npm.stdout.pipe(
    concat(dependencies => {
      dependencies = dependencies
        .split('\n')
        .slice(1) // skip the first entry, its the root
        .filter(f => !!f) // remove empty
        .map(f => path.relative(workingDir, f))
      archive({ workingDir, outputPath, dependencies, files, flattenRoot })
    })
  )
}

function archive({ files, workingDir, outputPath, dependencies, flattenRoot }) {
  mkdirp.sync(path.dirname(path.join(workingDir, outputPath)))
  let output = fs.createWriteStream(path.join(workingDir, outputPath)) //, { flags: 'r+' })
  let archive = archiver('zip', { zlib: { level: 9 } })

  output.on('close', function () {
    console.log(`Archive done, final size ${bytes(archive.pointer())}`)
  })

  archive.on('warning', function (err) {
    if (err.code === 'ENOENT') {
      console.error('archive error: ' + err.toString())
    } else {
      throw err
    }
  })

  archive.on('error', function (err) {
    throw err
  })

  archive.pipe(output)

  const paths = globby.sync(files, { cwd: workingDir, expandDirectories: true })

  paths.forEach(file => {
    let stat = fs.statSync(path.resolve(workingDir, file))
    if (stat.isDirectory()) {
      archive.directory(file, flattenRoot && file)
    } else if (stat.isFile()) {
      archive.file(file, { name: file })
    } else {
      throw new Error(
        'Stat is not a file or directory, unable to append. ' + file
      )
    }
  })

  dependencies.forEach(dep => archive.directory(dep, dep))
  archive.finalize()
}
