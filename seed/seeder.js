import { exit } from 'node:process'
import categorias from './categorias.js'
import Categoria from '../models/Categoria.js'
import db from '../config/db.js'
import Precio from '../models/Precios.js'
import precios from './precios.js'

const importarDatos = async () =>{
    try {
        //Autenticar

        await db.authenticate();

        //Generar las columnas

        await db.sync();

        //Inertar Datos

        await Promise.all([
            Categoria.bulkCreate(categorias),
            Precio.bulkCreate(precios)
        ])

        console.log('Datos exportados Correctamente');
        exit();
        
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}



//Recibir parametros desde la terminal y se manda a llamar datos
if(process.argv[2] === "-i"){
    importarDatos();
} 
