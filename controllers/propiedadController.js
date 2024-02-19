import { validationResult } from 'express-validator'
import { Categoria, Precio, Propiedad } from '../models/index.js'


const admin = (req,res) =>{
    res.render('propiedades/admin', {
        pagina: 'Mis Propiedades'
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
        csrfToken: req.csrfToken(),
        categorias,
        precios,
        datos: {}
    })
}

const guardar = async (req, res) =>{
    //Validacion
        let resultado = validationResult(req)
        if(!resultado.isEmpty()){
        //Consultar modelo de precio y categorias
        const [categorias, precios] = await Promise.all([
            Categoria.findAll(),
            Precio.findAll()
        ])
        console.log(req.body)

        return res.render('propiedades/crear', {
            pagina: 'Crear Propiedades',
            csrfToken: req.csrfToken(),
            categorias,
            precios,
            errores: resultado.array(),
            datos: req.body
            

        })
    }

        //Crear un registro
        const { titulo, descripcion, habitaciones, estacionamiento, wc, calle, lat, lng, precio: precioId,  categoria: categoriaId } = req.body

        const { id: usuarioId } = req.usuario
        
    
        try {
            const propiedadGuardada = await Propiedad.create({
                titulo,
                descripcion,
                habitaciones,
                estacionamiento,
                wc,
                calle,
                lat,
                lng,
                precioId,
                categoriaId,
                usuarioId,
                imagen: ''

            })

            const { id } = propiedadGuardada

            res.redirect(`/propiedades/agregar-imagen/${id}`)


        } catch (error) {
            console.log(error)
        }

    
}

const agregarImagen = async (req, res) => {
    const { id } = req.params
    //Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id)
    if (!propiedad) {
        return res.redirect('/mis-propiedades')
    }

    //validar que la propiedad no esté publicada
    if (propiedad.publicado) {
        return res.redirect('/mis-propiedades')
    }

    //validar que la propiedad pertenece a quien visita esta página

    if (req.usuario.id.toString() !== propiedad.usuarioId.toString()) {
        return res.redirect('/mis-propiedades');
    }    

    res.render('propiedades/agregar-imagen', {
        pagina: 'Agregar Imagen'
    })
}


export{
    admin,
    crear,
    guardar,
    agregarImagen
}