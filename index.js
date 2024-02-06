// const express = require('express')
import express from 'express'
import usuarioRoutes from './routes/usuarioRoutes.js'
import db from './config/db.js'

//create app

const app = express();

//habilitar lectura de datos de form

app.use( express.urlencoded({extended:true}))

//conxion bd
try {
    await db.authenticate();
    db.sync()
    console.log('conexion correcta')
} catch (error) {
    console.log(error)
}

//habilitar pug

app.set('view engine', 'pug')
app.set('views', './views')

//Carpeta publica

app.use( express.static('public') )

//Routing

app.use('/auth', usuarioRoutes)



// definied ports

const port = 4000;

app.listen(port, () => {
console.log(`El servidor está funcionando en el puerto ${port}`);

});