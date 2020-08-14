const express = require('express')
const moment = require('moment')
const mysqlConnection = require('../connection')


const Router = express.Router()

Router.get('/', (req, res) => {
  mysqlConnection.query('SELECT * FROM real_parameters', (error, rows, fields) => {
    if (error) {
      console.log('error catched while getting all serum data from DB:', error)
      throw error
    }
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.send(rows)
  })
})

Router.post('/', (req, res) => {
  const { airHumidity, airTemperature, soilHumidity, soilTemperature } = req.body
  const timestamp = new Date().getTime()
  const updatedAt = moment(timestamp).format("DD/MM/YYYY")

  const columnsToChange = `
      ${airHumidity || airHumidity === 0 ? 'airHumidity, ' : ''}
      ${airTemperature || airTemperature === 0 ? 'airTemperature, ' : ''}
      ${soilHumidity || soilHumidity === 0 ? 'soilHumidity, ' : ''}
      ${soilTemperature || soilTemperature === 0 ? 'soilTemperature, ' : ''}
      updatedAt
    `
  const valuesForColumns = `
      ${airHumidity || airHumidity === 0 ? `${airHumidity}, ` : ''}
      ${airTemperature || airTemperature === 0 ? `${airTemperature}, ` : ''}
      ${soilHumidity || soilHumidity === 0 ? `${soilHumidity}, ` : ''}
      ${soilTemperature || soilTemperature === 0 ? `${soilTemperature}, ` : ''}
      ${updatedAt}
    `

  mysqlConnection.query(`INSERT INTO real_parameters (${columnsToChange}) VALUES (${valuesForColumns})`, (error, rows, fields) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    if (error) {
      console.log('error catched while adding serum values into data table from DB:', error)
      res.status(404).json({
        success: false,
        error
      })
    }
    res.status(200).json({ success: true })
  })
})

module.exports = Router
