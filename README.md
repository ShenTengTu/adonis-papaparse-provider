# Adonis PapaParse Provider
A [**AdonisJS**](https://adonisjs.com/) service Provider which wraps [**Papa Parse**](https://www.papaparse.com/), a powerful CSV parser .

## installation
Install via npm:
```
npm i --save adonis-papaparse-provider
```

Register the provider inside `start/app.js` file :
```js
const providers = [
  'adonis-papaparse-provider/providers/PapaParseProvider'
]
```

After register, import the parser as below :
```js
const Papa = use('Papa')
```

## Provider Config
The config file `config/papaParse.js` contains `Papa Parse` configuration options : 
- **parse** : configuration for converting CSV to JSON
- **unparse** : configuration for converting JSON to CSV

## Features
The provider exposes base functions of `Papa Parse`.

### Parse CSV to JSON
**CSV string** :
 ```js
const Papa = use('Papa')
const csv = `name,age\n\nTom,12\nAmy,9`
let result = Papa.parse(csv)
/*
result.data === [['name', 'age'], [''], ['Tom', '12'], ['Amy', '9']]
*/
```

**Local csv file (fs.readFileSync)** :
 ```js
const Papa = use('Papa')
const csv = path.resolve(__dirname, '../test.csv')
const csvString = fs.readFileSync(csv, 'utf8')
let result = Papa.parse(csvString)
```

**Local CSV file (fs.createReadStream)**
```js
const Papa = use('Papa')
const csv = path.resolve(__dirname, '../test.csv')
const stream = fs.createReadStream(csv, 'utf8')

// in async function
const result = await new Promise ((resolve, reject) => {
  Papa.parse(stream, {error:  reject, complete: resolve})
})
```

**Local CSV file (stream.pipe())** :
```js
const Papa = use('Papa')
const csv = path.resolve(__dirname, '../test.csv')
const stream = fs.createReadStream(csv, 'utf8')
const csvStream = stream.pipe(Papa.parse(Papa.NODE_STREAM_INPUT))

// in async function
let result = await new Promise ((resolve, reject) => {
  const data = []
  csvStream.on('error', reject)
  csvStream.on('data', (item) => data.push(item))
  csvStream.on('end', () => {resolve(data)})
})
```

### JSON to Parse CSV
```js
const Papa = use('Papa')

/* Array<Object> */
let json = [{name: 'Tom', age: '12'}, {name: 'Amy', age: '9'}]

/* Array<Array<any>> */
json = [['name', 'age'], [''], ['Tom', '12'], ['Amy', '9']]

/* Papa.UnparseObject */
json = {
  fields: ['name', 'age'],
  data: [['Tom', '12'], ['Amy', '9']]
}

Papa.unparse(json)
```