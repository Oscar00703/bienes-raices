import jwt from 'jsonwebtoken'
import { Usuario } from '../models/index.js'

const protegerRuta = async (req, res, next) =>{
    //verificar si hay token
    const { _token } = req.cookies
    if(!_token){
        return res.redirect('/auth/login')
    }

    //comprobar token
    try {
        const decoded = jwt.verify(_token, process.env.JWT_SECRET)
        const usuario = await Usuario.scope('eliminarPassword').findByPk(decoded.id)
        
        //Almacenar el usuario al req
        if(usuario){
            req.usuario = usuario
        }else{
            return res.redirect('/auth/login')
        }
        // Llamada a next() para pasar al siguiente middleware
        next();
    } catch (error) {
        console.log(error)
        return res.clearCookie('_token').redirect('/auth/login')
    }
}

export default protegerRuta
