import { check, validationResult} from 'express-validator'
import Usuario from '../models/Usuario.js'

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
    await check('email').isEmail.withMessage('Eso no parece un email').run(req)
    await check('password').isLength({min: 6}).withMessage('El password debe de ser almenos de 6 caracteres').run(req)
    await check('repetir-password').equals('password').withMessage('Los passwords no son iguales').run(req)
    let resultado = validationResult(req)
    // verificar resultado vacio
    
    res.json(resultado.array())
    
    const usuario = await Usuario.create(req.body)

    res.json(usuario)
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
    registrar
}