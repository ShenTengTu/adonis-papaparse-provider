'use strict'

const path = require('path')

const ConfigName = 'papaParse.js'
module.exports = async function (cli) {
  try {
    await cli.copy(
      path.join(__dirname, `./config/${ConfigName}`),
      path.join(cli.helpers.configPath(), ConfigName)
    )
    cli.command.completed('create', `config/${ConfigName}`)
  } catch (error) {
    // ignore error
  }
}