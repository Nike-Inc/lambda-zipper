#! /usr/bin/env node
'use strict'

const zipper = require('./zipper')

// eslint-disable-next-line no-unused-expressions
require('yargs')
  .command({
    command: 'build',
    desc: 'package lambda with production dependendies',
    builder: profileOptions,
    handler: (yargs) => zipper.build({ files: yargs.f, workingDir: yargs.w, outputPath: yargs.o })
  })
  .demandCommand(1, 'Must provide at least one command')
  .help()
  .argv

function profileOptions (yargs) {
  return yargs
    .option('f', {
      alias: 'files',
      demandOption: true,
      normalize: true,
      type: 'array',
      describe: 'Files/Directories to include in the zip output'
    })
    .option('o', {
      alias: 'output',
      demandOption: true,
      normalize: true,
      type: 'string',
      describe: 'Name of the zip file to write to'
    })
    .option('w', {
      alias: 'working-dir',
      demandOption: false,
      normalize: true,
      describe: 'path to the root directory of the module. Will set the $CWD before executing command.'
    })
}
