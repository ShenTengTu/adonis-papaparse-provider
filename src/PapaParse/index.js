'use strict'

const Papa = require('papaparse')
const defaultConfig = require('../../config/papaParse')

/** @typedef {import('stream').Readable} stream.Readable */
/** @typedef {import('papaparse').NODE_STREAM_INPUT} NODE_STREAM_INPUT */
/** @typedef {import('papaparse').UnparseObject} UnparseObject */
/** @typedef {import('papaparse').UnparseConfig} UnparseConfig */
/** @typedef {import('papaparse').ParseConfig} ParseConfig */

class PapaParse {
  static get NODE_STREAM_INPUT () { return Papa.NODE_STREAM_INPUT }
  
  constructor (Config) {
    this.config = Config.merge('papaParse', defaultConfig, (obj, src, key) => {})
  }

  /**
   * `Papa Parse` default `parse()` function warpper
   * @param {string|stream.Readable|NODE_STREAM_INPUT} csv  CSV string, Readable stream or `papaparse.NODE_STREAM_INPUT`
   * @param {ParseConfig} config  `Papa Parse` parse config
   */
  parse (csv, config) {
    const _config = Object.assign({}, this.config.parse, config)
    return Papa.parse(csv, _config)
  }

  /**
   * `Papa Parse` default `unparse()` function warpper
   * @param {object[]|array[]|UnparseObject} obj
   * @param {UnparseConfig} config  `Papa Parse` unparse config
   */
  unparse (obj, config) {
    const _config = Object.assign({}, this.config.unparse, config)
    return Papa.unparse(obj, _config)
  }
}

module.exports = PapaParse
