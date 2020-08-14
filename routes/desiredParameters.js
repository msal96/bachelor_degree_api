const express = require('express')
const moment = require('moment')
const mysqlConnection = require('../connection')


const Router = express.Router()

Router.get('/', (req, res) => {
  mysqlConnection.query('SELECT * FROM desired_parameters_values', (error, rows, fields) => {
    if (error) {
      console.log('error catched while getting desired parameters values from DB:', error)
      throw error
    }
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    console.log('rows -> desiredParameters: ', rows)
    res.send(rows[0] || [])
  })
})

Router.put('/', (req, res) => {
  const { airHumidity = {}, airTemperature = {}, soilHumidity = {}, soilTemperature = {} } = req.body
  const timestamp = new Date().getTime()
  const updatedAt = moment(timestamp).format("DD/MM/YYYY")
  const rowId = 1

  mysqlConnection.query(`SELECT * FROM desired_parameters_values`, (error, rows, fields) => {
    if (error) {
      console.log('error catched while getting desired parameters data from DB:', error)
      throw error
    }

    // if we add for the first time desired values
    if (rows.length === 0) {
      const columnsToChange = `
      ${airHumidity.min ? 'airHumidityMin, ' : ''} ${airHumidity.max ? 'airHumidityMax, ' : ''}
      ${airTemperature.min ? 'airTemperatureMin, ' : ''} ${airTemperature.max ? 'airTemperatureMax, ' : ''}
      ${soilHumidity.min ? 'soilHumidityMin, ' : ''} ${soilHumidity.max ? 'soilHumidityMax, ' : ''}
      ${soilTemperature.min ? 'soilTemperatureMin, ' : ''} ${soilTemperature.max ? 'soilTemperatureMax, ' : ''}
      id, updatedAt
    `

      const valuesForColumns = `
      ${airHumidity.min ? `${airHumidity.min}, ` : ''} ${airHumidity.max ? `${airHumidity.max}, ` : ''}
      ${airTemperature.min ? `${airTemperature.min}, ` : ''} ${airTemperature.max ? `${airTemperature.max}, ` : ''}
      ${soilHumidity.min ? `${soilHumidity.min}, ` : ''} ${soilHumidity.max ? `${soilHumidity.max}, ` : ''}
      ${soilTemperature.min ? `${soilTemperature.min}, ` : ''} ${soilTemperature.max ? `${soilTemperature.max}, ` : ''}
      ${rowId}, ${updatedAt}
    `

      mysqlConnection.query(`INSERT INTO desired_parameters_values (${columnsToChange}) VALUES (${valuesForColumns})`, (error, rows, fields) => {
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

    } else {
      // if we already added desired values we just update that row
      mysqlConnection.query(`UPDATE desired_parameters_values
      SET 
          airHumidityMin=${airHumidity.min},
          airHumidityMax=${airHumidity.max},
          airTemperatureMin=${airTemperature.min},
          airTemperatureMax=${airTemperature.max},
          soilHumidityMin=${soilHumidity.min},
          soilHumidityMax=${soilHumidity.max},
          soilTemperatureMin=${soilTemperature.min},
          soilTemperatureMax=${soilTemperature.max}
      WHERE id=${rowId}`,
        (error, rows, fields) => {
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
    }
    console.log('rows -> desiredParameters: ', rows)
  })
})

module.exports = Router
