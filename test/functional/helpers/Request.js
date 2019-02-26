const {Macroable} = require('macroable')

class Request extends Macroable {
  constructor (request, response, Config) {
    super()
    this.request = request
  }

  hasBody () {
    return this.request.headers['transfer-encoding'] !== undefined ||
    !isNaN(this.request.headers['content-length'])
  }

  match (route) {
    return false
  }

  is (types) {
    const contentType = this.request.headers['content-type']
    return types.indexOf('multipart/form-data') > -1 && contentType && contentType.startsWith('multipart/form-data')
  }
}

module.exports = Request