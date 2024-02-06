import { check, validationResult} from 'express-validator'
import { generaId } from '../helpers/tokens.js'
import Usuario from '../models/Usuario.js'
import { emailRegistro } from '../helpers/emails.js'


//fromulario para logearse
const fromularioLogin = (req,res) =>{
    res.render('auth/login', {
        pagina: 'Iniciar Sesión'
    })
}

//formulario para iRegistrarse

const fromularioRegistro = (req,res) =>{
    res.render('auth/registro', {
        pagina: 'Crear Cuenta'
    })
}
const registrar = async (req, res) =>{
//validacion
    //nombre
    await check('nombre').notEmpty().withMessage('El nombre no puede ir vacio').run(req)
    await check('email').isEmail().withMessage('Eso no parece un email').run(req)
    await check('password').isLength({min: 6}).withMessage('El password debe de ser almenos de 6 caracteres').run(req)
    // await check('repetir-password').equals(req.body.password).withMessage('Los passwords no son iguales').run(req)


    let resultado = validationResult(req)


    // return res.json(
    //     resultado.array
    // )

    if(!resultado.isEmpty()){

        return res.render('auth/registro', {
            pagina: 'Crear Cuenta',
            errores: resultado.array(),
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        })
    }

    const {nombre, email, password} = req.body

    //verificamos si el usuario ya esta registrado
    const existeUsurio = await Usuario.findOne( { where : { email }} )
    if(existeUsurio){
        return res.render('auth/registro', {
            pagina: 'Crear Cuenta',
            errores: [{msg: 'El usuario ya existe'}],
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        })
    }

   
    console.log(existeUsurio)
    // return;


    const usuario = await Usuario.create({
        nombre,
        email,
        password,
        token: generaId()
    })

    //Envia email de confirmacion
    emailRegistro({
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token
    })
    //usuario creado

    res.render('templates/mensaje',{
        pagina:'Cuenta Creada con Exito',
        mensaje: 'Hemos enviado un correo de confirmacion a tu cuenta'
    })

}

//funcion que comprueba una cuenta

const confirmar = (req, res) =>{
    const {token} = req.params;
    console.log( token )

}

//formulario para recuperar contrasenia

const fromularioOlvidePassword = (req,res) =>{
    res.render('auth/olvide-password', {
        pagina: 'Recupera tu acceso a Bienes Raices'
    })
}

//exportando 
export {
    fromularioLogin,
    fromularioRegistro,
    fromularioOlvidePassword,
    confirmar,
    registrar
}