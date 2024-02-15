import { exit } from 'node:process'
import categorias from './categorias.js'
import db from '../config/db.js'
import precios from './precios.js'
import { Categoria, Precio} from '../models/index.js'

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

//Funcion para eliminar datos

    const eliminarDatos = async () =>{
        try {
            await db.sync({force:true})
        } catch (error) {
            console.log(error)
            exit(1)
        }
    }

//Recibir parametros desde la terminal y se manda a llamar datos
if(process.argv[2] === "-i"){
    importarDatos();
} 
if(process.argv[2] === "-e"){
    eliminarDatos();
} 
