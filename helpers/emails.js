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
                <p>Preciona el enlace para confirmar <a href="${process.env.PORT}">Confirmar Cuenta</a> </p>
                <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
        `
    })
}


export {
emailRegistro

}