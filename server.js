const express = require('express')
const bodyParser = require('body-parser')

const mysqlConnection = require('./connection')
const DataRoutes = require('./routes/data')


var app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/data', DataRoutes)

app.listen('4000', () => {
  console.log('Server started on port 4000')
})