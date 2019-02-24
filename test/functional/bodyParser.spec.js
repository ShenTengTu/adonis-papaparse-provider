const test = require('japa')
const supertest = require('supertest')
const { ioc } = require('@adonisjs/fold')
const { Helpers } = require('@adonisjs/sink')
const fs = require('fs')
const { join } = require('path')
const setup = require('./setup')
const Request = require('./helpers/Request')

const PORT = 1234
const URL = `http://localhost:${PORT}`
const HELPER = new Helpers(join(__dirname, './'))

function newRequestHandler (asyncCallback) {
  return async function requestHandler (req, res) {
    const request = new Request(req)

    const bodyParser = use('Adonis/Middleware/BodyParser')

    await bodyParser.handle({ request }, async () => {
      await asyncCallback(request, res)
    })
  }
}

test.group('body Parser', (group) => {
  group.before(async () => {

  })

  group.after(async () => {

  })

  test('Upload CSV File to JSON', async (assert) => {
    const  requestHandler = newRequestHandler(async (request, response) => {
      const importFile = request.file('importFile')
      const tmpPath = HELPER.tmpPath('imports')
      await importFile.move(tmpPath, { name: 'temp.csv', overwrite: true })

      const stream = fs.createReadStream(join(tmpPath, 'temp.csv'), 'utf8')
      const result = await new Promise ((resolve, reject) => {
        const Papa = use('Papa')
        Papa.parse(stream, {error:  reject, complete: resolve})
      })
      
      response.writeHead(200, { 'content-type': 'application/json' })
      response.write(JSON.stringify(result))
      response.end()
    })
    
    await setup.up(PORT, requestHandler)
  
    const {body} = await supertest(URL).post('/')
    .attach('importFile', join(__dirname, '../test.csv'))

    assert.sameDeepOrderedMembers(body.data, [['Subject', 'score'], ['Math', '82'], ['Physics', '76']], 'Default parse result')

    await setup.down()
  })
})