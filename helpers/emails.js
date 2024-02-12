import nodemailer from 'nodemailer'

const emailRegistro = async (datos) =>{
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    const {email, nombre, token} = datos
    //enviar el email

    await transport.sendMail({
        from:'BienesRaices',
        to: email,
        subject: 'Confirma tu cuenta en Bienes Raices',
        text: 'Confirma tu cuenta en Bienes Raices',
        html: `
                <p>Hola ${nombre}, confirma tu cuenta en bienes raices</p>
                <p>Preciona el enlace para confirmar <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirmar/${token}">Confirmar Cuenta</a> </p>
                
                <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
        `
    })
}


const emailOlvidePassword = async (datos) =>{
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    const {email, nombre, token} = datos
    //enviar el email

    await transport.sendMail({
        from:'BienesRaices',
        to: email,
        subject: 'Recupera tu cuenta en Bienes Raices',
        text: 'Recupera tu cuenta en Bienes Raices',
        html: `
                <p>Hola ${nombre}, Recupera tu cuenta en bienes raices</p>
                <p>Preciona el enlace para restablecer tu password <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/olvide-password/${token}">Cambiar Password</a> </p>
                
                <p>Si tu no solicitaste este cambio de password, puedes ignorar el mensaje</p>
        `
    })
}

export {
emailRegistro,
emailOlvidePassword

}