const mysql = require('mysql')

var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'ChelseaFan1996',
    database: 'sera_legume'
  })
  
  mysqlConnection.connect(error => {
    if (error) {
      console.log('error catched while connectiong to DB:', error)
      throw error
    }
    console.log('Successfuly connected to MySQL')
  })

  module.exports = mysqlConnection