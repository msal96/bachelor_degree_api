const express = require('express')
const bodyParser = require('body-parser')

const mysqlConnection = require('./connection')
const RealParametersRoutes = require('./routes/realParameters')
const DesiredParametersRoutes = require('./routes/desiredParameters')

var app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/real-parameters', RealParametersRoutes)
app.use('/desired-parameters', DesiredParametersRoutes)


app.listen('4000', () => {
  console.log('Server started on port 4000')
})