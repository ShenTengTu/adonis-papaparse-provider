/*
  Default PapaParseProvider Config
  The options are same as Original `PapaParse` package
*/

module.exports = {
  /*
  |--------------------------------------------------------------------------
  | Parse configuration
  |--------------------------------------------------------------------------
  |
  | configuration for converting CSV to JSON
  |
  */
  parse: {
    delimiter: "",
    newline: "",
    quoteChar: '"',
    escapeChar: '"',
    header: false,
    transformHeader: undefined,
    dynamicTyping: false,
    preview: 0,
    encoding: "",
    worker: false,
    comments: false,
    step: undefined,
    complete: undefined,
    error: undefined,
    download: false,
    skipEmptyLines: false,
    chunk: undefined,
    fastMode: undefined,
    beforeFirstChunk: undefined,
    withCredentials: undefined,
    transform: undefined,
    delimitersToGuess: [',', '\t', '|', ';', String.fromCharCode(30), String.fromCharCode(31)]
  },
  /*
  |--------------------------------------------------------------------------
  | Unparse configuration
  |--------------------------------------------------------------------------
  |
  | configuration for converting JSON to CSV
  |
  */
  unparse: {
    quotes: false,
    quoteChar: '"',
    escapeChar: '"',
    delimiter: ",",
    header: true,
    newline: "\r\n",
    skipEmptyLines: false,
    columns: null
  }
}
