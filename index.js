// const express = require('express')
import express from 'express'
import bodyParser from 'body-parser'
import csurf from 'csurf'
import cookieParser from 'cookie-parser'
import usuarioRoutes from './routes/usuarioRoutes.js'
import propiedadesRoutes from './routes/propiedadesRoutes.js'
import db from './config/db.js'

//create app

const app = express();

// Configurar body-parser para analizar los datos de formularios HTML
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//habilitar lectura de datos de form

app.use( express.urlencoded({extended:true}))

//Habilitar cookie parser

app.use( cookieParser() )

//Habilitar CSRF

app.use( csurf({cookie:true}))

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

app.use('/', propiedadesRoutes)



// definied ports

const port = process.env.PORT || 3000;

app.listen(port, () => {
console.log(`El servidor está funcionando en el puerto ${port}`);

});