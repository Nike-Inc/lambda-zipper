#! /usr/bin/env node
'use strict'

const zipper = require('./zipper')

// eslint-disable-next-line no-unused-expressions
require('yargs')
  .command({
    command: 'build',
    desc: 'package lambda with production dependendies',
    builder: profileOptions,
    handler: yargs =>
      zipper.build({
        files: yargs.f,
        workingDir: yargs.w,
        outputPath: yargs.o,
        flattenRoot: yargs.r
      })
  })
  .demandCommand(1, 'Must provide at least one command')
  .help().argv

function profileOptions(yargs) {
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
      describe:
        'path to the root directory of the module. Will set the $CWD before executing command.'
    })
    .option('r', {
      alias: 'root',
      demandOption: false,
      default: false,
      type: 'boolean',
      describe:
        'Include "files" folders in root of archive. If false, folders will be flattened so that contents, but not the folders themselves, are in the root.'
    })
}
