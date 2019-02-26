const fs = require('fs')
const path = require('path')
const test = require('japa')
const { Config } = require('@adonisjs/sink')
const PapaParse = require('../../src/PapaParse')

test.group('class PapaParse', (group) => {
  group.beforeEach(() => {
    this.config = new Config()
  })


  test('Default Config', (assert) => {
    const papa = new PapaParse(this.config)
    assert.hasAllKeys(papa.config, ['parse', 'unparse'], 'Provider Default Config')
  })

  test('Custom Config', (assert) => {
    this.config.set('papaParse.parse', {
      header: true,
      skipEmptyLines: true
    })
    
    this.config.set('papaParse.unparse', {
      header: false,
      skipEmptyLines: 'greedy'
    })

    const papa = new PapaParse(this.config)
    assert.strictEqual(papa.config.parse.header, true, 'Custom Config: parse.header')
    assert.strictEqual(papa.config.parse.skipEmptyLines, true, 'Custom Config: parse.skipEmptyLines')
    assert.strictEqual(papa.config.unparse.header, false, 'Custom Config: unparse.header')
    assert.strictEqual(papa.config.unparse.skipEmptyLines, 'greedy', 'Custom Config: unparse.header')
  })

  test('[sync] CSV string', (assert) => {
    const csv = `name,age\n\nTom,12\nAmy,9`

    let papa = new PapaParse(this.config)
    let result = papa.parse(csv)
    assert.sameDeepOrderedMembers(result.data, [['name', 'age'], [''], ['Tom', '12'], ['Amy', '9']], 'Default parse result')
    

    this.config.set('papaParse.parse', {header: true})
    papa = new PapaParse(this.config)
    result = papa.parse(csv)
    assert.sameDeepOrderedMembers(result.data,[{ name: ''}, {name: 'Tom', age: '12'}, {name: 'Amy', age: '9'}], 'Custom parse result (config file)')
    
    papa = new PapaParse(new Config())
    result = papa.parse(csv, {header: true, skipEmptyLines: true})
    assert.sameDeepOrderedMembers(result.data,[{name: 'Tom', age: '12'}, {name: 'Amy', age: '9'}], 'Custom parse result (runtime config)')
  })

  test('[sync] local CSV file (fs.readFileSync)', (assert) => {
    const csv = path.resolve(__dirname, '../test.csv')
    const csvString = fs.readFileSync(csv, 'utf8')
    const papa = new PapaParse(this.config)
    const result = papa.parse(csvString)
    assert.sameDeepOrderedMembers(result.data, [['Subject', 'score'], ['Math', '82'], ['Physics', '76']], 'Default parse result')
  })

  test('[async] local CSV file (fs.createReadStream)', async (assert) => {
    const csv = path.resolve(__dirname, '../test.csv')
    const stream = fs.createReadStream(csv, 'utf8')
    const papa = new PapaParse(this.config)

    const result = await new Promise ((resolve, reject) => {
      papa.parse(stream, {error:  reject, complete: resolve})
    })
    assert.sameDeepOrderedMembers(result.data, [['Subject', 'score'], ['Math', '82'], ['Physics', '76']], 'Default parse result')
  })

  test('[async] local CSV file (fs.createReadStream)', async (assert) => {
    const csv = path.resolve(__dirname, '../test.csv')
    const stream = fs.createReadStream(csv, 'utf8')
    const papa = new PapaParse(this.config)

    const result = await new Promise ((resolve, reject) => {
      papa.parse(stream, {error:  reject, complete: resolve})
    })
    assert.sameDeepOrderedMembers(result.data, [['Subject', 'score'], ['Math', '82'], ['Physics', '76']], 'Default parse result')
  })

  test('[async] local CSV file (stream.pipe())', async (assert) => {
    const csv = path.resolve(__dirname, '../test.csv')
    const stream = fs.createReadStream(csv, 'utf8')
    const papa = new PapaParse(this.config)
    const csvStream = stream.pipe(papa.parse(papa.NODE_STREAM_INPUT))

    let result = await new Promise ((resolve, reject) => {
      const data = []
      csvStream.on('error', reject)
      csvStream.on('data', (item) => data.push(item))
      csvStream.on('end', () => {resolve(data)})
    })
    assert.sameDeepOrderedMembers(result, [['Subject', 'score'], ['Math', '82'], ['Physics', '76']], 'Default parse result')
  })

  test('JSON (Array<Object>)', async (assert) => {
    const json = [{name: 'Tom', age: '12'}, {name: 'Amy', age: '9'}]
    const papa = new PapaParse(this.config)
    const result = papa.unparse(json)
    assert.strictEqual(result, 'name,age\r\nTom,12\r\nAmy,9', 'JSON to CSV')
  })

  test('JSON (Array<Array<any>>)', async (assert) => {
    const json = [['name', 'age'], [''], ['Tom', '12'], ['Amy', '9']]
    const papa = new PapaParse(this.config)
    const result = papa.unparse(json)
    assert.strictEqual(result, 'name,age\r\n\r\nTom,12\r\nAmy,9', 'JSON to CSV')
  })

  test('JSON (Papa.UnparseObject)', async (assert) => {
    const json = {
      fields: ['name', 'age'],
      data: [['Tom', '12'], ['Amy', '9']]
    }
    const papa = new PapaParse(this.config)
    const result = papa.unparse(json)
    assert.strictEqual(result, 'name,age\r\nTom,12\r\nAmy,9', 'JSON to CSV')
  })
})