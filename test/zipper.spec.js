'use strict'

const test = require('blue-tape')
const proxyquire = require('proxyquire')
const fsStub = {}
let archiver
const archiveStub = function () {
  return archiver()
}

const zipper = proxyquire('../src/zipper', { 'archiver': archiveStub, 'fs': fsStub })

test('build requires files', t => {
  t.plan(1)
  t.throws(() => zipper.build({outputPath: './test.zip'}), /required.+?files/, 'throws')
})

test('build requires outputPath', t => {
  t.plan(1)
  t.throws(() => zipper.build({files: ['src']}), /required.+?outputPath/, 'throws')
})
