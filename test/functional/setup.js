const { ioc, registrar, resolver } = require('@adonisjs/fold')
const { Config } = require('@adonisjs/sink')
const http = require('http')
const { join } = require('path')
const Server = require('./helpers/Server')
const Route = require('./helpers/Route')
const Request = require('./helpers/Request')

module.exports = {
  server: null,
  up (port, requestHandler) {
    return new Promise ((resolve, reject) => {
      
      ioc.bind('Adonis/Src/Server', () => new Server())
      ioc.bind('Adonis/Src/Route', () => Route)
      ioc.bind('Adonis/Src/Request', () => Request)
      ioc.bind('Adonis/Src/Config', () => new Config())

      resolver.appNamespace('App').directories({ validators: 'Validators' })

      registrar.providers([
        '@adonisjs/validator/providers/ValidatorProvider',
        '@adonisjs/bodyparser/providers/BodyParserProvider',
        join(__dirname, '../../providers/PapaParseProvider')
      ]).registerAndBoot()
      .then(() => {
        this.server = http.createServer(requestHandler)
        this.server.listen(port, resolve)
      }).catch(reject)

    })
  },
  down () {
    return new Promise((resolve) => this.server.close(resolve))
  }
}