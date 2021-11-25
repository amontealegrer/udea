'use strict'

function errorHandler(error){
    console.error(error)
    throw new Error('Fallo en la operación del Servidor')
}

module.exports = errorHandler