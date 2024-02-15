import Precio from '../models/Precios.js'
import Categoria from '../models/Categoria.js'


const admin = (req,res) =>{
    res.render('propiedades/admin', {
        pagina: 'Mis Propiedades',
        barra:true
    })

}
//form para crear una nueva propiedad

const crear = async (req,res) =>{
    //Consultar modelo de precio y categorias
    const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ])


    res.render('propiedades/crear', {
        pagina: 'Crear Propiedades',
        barra:true,
        categorias,
        precios
    })
}

const guardar = (req, res) =>{

}


export{
    admin,
    crear,
    guardar
}