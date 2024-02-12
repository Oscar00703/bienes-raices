import { check, validationResult} from 'express-validator'
import bcrypt from 'bcrypt'
import { generaId, generarJWT  } from '../helpers/tokens.js'
import Usuario from '../models/Usuario.js'
import { emailRegistro, emailOlvidePassword } from '../helpers/emails.js'


//fromulario para logearse
const fromularioLogin = (req,res) =>{
    res.render('auth/login', {
        pagina: 'Iniciar Sesión',
        csrfToken: req.csrfToken()
    })
}

const autenticar = async (req,res) => {
    //validacion
    await check('email').isEmail().withMessage('Email obligatorio').run(req)
    await check('password').notEmpty().withMessage('El password es obligatorio').run(req)

    let resultado = validationResult(req)


    if(!resultado.isEmpty()){

        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            errores: resultado.array(),
            csrfToken: req.csrfToken(),
        })
    }

    //coprobando si el usuario existe

    const { email, password } = req.body
    const usuario = await Usuario.findOne({where: {email}})
    if(!usuario){
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            errores: [{msg: 'El usuario no existe'}],
            csrfToken: req.csrfToken(),
        })
    }
    //comprobar si el usuario esta confirmado
if(!usuario.confirmado){
    return res.render('auth/login', {
        pagina: 'Iniciar Sesión',
        errores: [{msg: 'Tu cuenta no ha sido confirmado'}],
        csrfToken: req.csrfToken(),
    })
}

//revisar el password
    if(!usuario.verificarPassword(password)){
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            errores: [{msg: 'El password es incorrecto'}],
            csrfToken: req.csrfToken(),
        })
    }

    //autenticar al usuario
    const token = generarJWT({id: usuario.id, nombre:usuario.nombre});

    //almacenar en un cookie
    return res.cookie('_token', token, {
        httpOnly: true,
        //secure: true
    }).redirect('/mis-propiedades')

}
//formulario para Registrarse

const fromularioRegistro = (req,res) =>{

    

    res.render('auth/registro', {
        pagina: 'Crear Cuenta',
        csrfToken: req.csrfToken()
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
            csrfToken: req.csrfToken(),
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
            csrfToken: req.csrfToken(),
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

const confirmar = async (req, res) =>{
    const {token} = req.params;
    console.log( token )

    //verificar si el token es valido
    const usuario = await Usuario.findOne({ where: {token} })
    console.log(usuario)

    if(!usuario) {
        return res.render('auth/confirmar-cuenta', {
            pagina: 'Erro al confirmar tu cuenta',
            mensaje: 'Hubo un erro al confirmar tu cuenta, intenta de nuevo',
            error: true
        })
    }

    //confirmar la cuenta
    usuario.token = null;
    usuario.confirmado = true;
    await usuario.save();
    return res.render('auth/confirmar-cuenta', {
        pagina: 'Cuenta Confirmada',
        mensaje: 'La cuenta se confirmo correctamente',
        error: false
    })

    console.log(usuario)


    

}

//formulario para recuperar contrasenia

const fromularioOlvidePassword = (req,res) =>{
    res.render('auth/olvide-password', {
        pagina: 'Recupera tu acceso a Bienes Raices',
        csrfToken: req.csrfToken()
    })
}

const resetPassword = async (req, res) =>{
    //validacion
    await check('email').isEmail().withMessage('Eso no parece un email').run(req)

    let resultado = validationResult(req)

    if(!resultado.isEmpty()){

        return res.render('auth/olvide-password', {
            pagina: 'Recupera tu acceso a Bienes Raices',
            errores: resultado.array(),
            csrfToken: req.csrfToken(),
        })
    }

    //Buscar user

    const { email } =req.body
    
    const usuario = await Usuario.findOne({where: {email}})
    if(!usuario){
        return res.render('auth/olvide-password', {
            pagina: 'Recupera tu acceso a Bienes Raices',
            errores: [{msg: 'El email no pertenece a ningun usuario'}],
            csrfToken: req.csrfToken(),
        })
    }

    //Generar token y enviar el email

    usuario.token = generaId();
    await usuario.save();

    //Enviar un email
    emailOlvidePassword({
        email: usuario.email,
        nombre: usuario.nombre,
        token: usuario.token
    })

    //Renderizar mensaje email
    res.render('templates/mensaje', {
        pagina: 'Reestablace tu Password',
        mensaje: 'Hemos enviado un email con las instrucciones'
    })
}
    const comprobarToken = async (req, res) =>{

        const { token } = req.params;
        const usuario = await Usuario.findOne({where: {token}})
        if(!usuario){
            return res.render('auth/confirmar-cuenta', {
                pagina: 'Restablece tu password',
                mensaje: 'Hubo un error al validar tu información, intenta de nuevo',
                error: true
            })
        }
        //mostrar formulario
        res.render('auth/reset-password',{
            pagina:'Reestablece tu password',
            csrfToken: req.csrfToken()
        })
    }

    const nuevoPassword = async (req, res) =>{
        //validar password
        await check('password').isLength({min: 6}).withMessage('El password debe de ser almenos de 6 caracteres').run(req)
        let resultado = validationResult(req)

        if(!resultado.isEmpty()){

            return res.render('auth/reset-password', {
                pagina: 'Reestablece tu Password',
                errores: resultado.array(),
                csrfToken: req.csrfToken()
            })
    }

        const { token } = req.params;
        const { password } = req.body;
        //quien hace el cambio
        const usuario = await Usuario.findOne({where :{token}})
        //hash
        const salt = await bcrypt.genSalt(10)
        usuario.password = await bcrypt.hash(password, salt);
        usuario.token = null;

        await usuario.save();

        res.render('auth/confirmar-cuenta',{
            pagina: 'Password Restablecido',
            manesaje: 'El Password se guardo correctamente'
        })
    }


//exportando 
export {
    fromularioLogin,
    autenticar,
    fromularioRegistro,
    fromularioOlvidePassword,
    confirmar,
    registrar,
    resetPassword,
    nuevoPassword,
    comprobarToken
}