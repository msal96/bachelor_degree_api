const express = require('express')
const moment = require('moment')
const mysqlConnection = require('../connection')


const Router = express.Router()

Router.get('/', (req, res) => {
  mysqlConnection.query('SELECT * FROM data', (error, rows, fields) => {
    if (error) {
      console.log('error catched while getting all serum data from DB:', error)
      throw error
    }
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.send(rows.reduce((acc, row) => ([...acc, {
      id: row.id,
      airHumidity: {
        value: row.airHumidity,
        desired: {
          min: row.desiredAirHumidityMin,
          max: row.desiredAirHumidityMax
        }
      },
      airTemperature: {
        value: row.airTemperature,
        desired: {
          min: row.desiredAirTemperatureMin,
          max: row.desiredAirTemperatureMax
        }
      },
      soilHumidity: {
        value: row.soilHumidity,
        desired: {
          min: row.desiredSoilHumidityMin,
          max: row.desiredSoilHumidityMax
        }
      },
      soilTemperature: {
        value: row.soilTemperature,
        desired: {
          min: row.desiredSoilTemperatureMin,
          max: row.desiredSoilTemperatureMax
        }
      }
    }]), []))
  })
})

Router.post('/', (req, res) => {
  const { airHumidity = {}, airTemperature = {}, soilHumidity = {}, soilTemperature = {} } = req.body
  const timestamp = new Date().getTime()
  const updatedAt = moment(timestamp).format("DD/MM/YYYY")
  
  const columnsToChange = `
      ${airHumidity.value ? 'airHumidity, ' : ''} ${airHumidity.desired.min ? 'desiredAirHumidityMin, ' : ''} ${airHumidity.desired.max ? 'desiredAirHumidityMax, ' : ''}
      ${airTemperature.value ? 'airTemperature, ' : ''} ${airTemperature.desired.min ? 'desiredAirTemperatureMin, ' : ''} ${airTemperature.desired.max ? 'desiredAirTemperatureMax, ' : ''}
      ${soilHumidity.value ? 'soilHumidity, ' : ''} ${soilHumidity.desired.min ? 'desiredSoilHumidityMin, ' : ''} ${soilHumidity.desired.max ? 'desiredSoilHumidityMax, ' : ''}
      ${soilTemperature.value ? 'soilTemperature, ' : ''} ${soilTemperature.desired.min ? 'desiredSoilTemperatureMin, ' : ''} ${soilTemperature.desired.max ? 'desiredSoilTemperatureMax, ' : ''}
      updatedAt
    `
  const valuesForColumns = `
      ${airHumidity.value ? `${airHumidity.value}, ` : ''}
      ${airHumidity.desired.min ? `${airHumidity.desired.min}, ` : ''}
      ${airHumidity.desired.max ? `${airHumidity.desired.max}, ` : ''}
      ${airTemperature.value ? `${airTemperature.value}, ` : ''}
      ${airTemperature.desired.min ? `${airTemperature.desired.min}, ` : ''}
      ${airTemperature.desired.max ? `${airTemperature.desired.max}, ` : ''}
      ${soilHumidity.value ? `${soilHumidity.value}, ` : ''}
      ${soilHumidity.desired.min ? `${soilHumidity.desired.min}, ` : ''}
      ${soilHumidity.desired.max ? `${soilHumidity.desired.max}, ` : ''}
      ${soilTemperature.value ? `${soilTemperature.value}, ` : ''}
      ${soilTemperature.desired.min ? `${soilTemperature.desired.min}, ` : ''}
      ${soilTemperature.desired.max ? `${soilTemperature.desired.max}, ` : ''}
      ${updatedAt}
    `

  mysqlConnection.query(`INSERT INTO data (${columnsToChange}) VALUES (${valuesForColumns})`, (error, rows, fields) => {
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