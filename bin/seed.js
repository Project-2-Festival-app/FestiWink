require("dotenv").config()
const mongoose = require('mongoose');
const Festival = require('../models/Festival.model');
const FESTIVALS = require('../data/festivals.json')

// Conectarme a la base de datos

require('../config/db.config');


// VaciarlaS

mongoose.connection.once('open', () => {
  mongoose.connection.db.dropDatabase()
    .then(() => {
      console.info('Db dropped')

      return Festival.create(FESTIVALS)
    })
    .then(createdFestivals => {
        createdFestivals.forEach(festival => console.log(`${festival.name} was created`))

      // Cerrar la conexion
      return mongoose.connection.close()
    })
    .then(() => {
      console.log('Connection closed')

      process.exit(1)
    })
    .catch(err => {
      console.error(err)
      process.exit(0)
    })
})