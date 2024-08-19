import { createTransport } from "../config/nodemailer.js";

export async function sendEmailVerification({name, email, token}) {
    const transporter = createTransport(
        process.env.EMAIL_HOST,
        process.env.EMAIL_PORT,
        process.env.EMAIL_USER,
        process.env.EMAIL_PASSWORD
    )

    //Enviar email
    const info = await transporter.sendMail({
        from: 'Bookit <accounts@bookit.com>',
        to: email,
        subject: 'Bookit - Verifica tu cuenta',
        text: 'Haz click en el siguiente enlace para verificar tu cuenta.',
        html: `<p>Hola ${name}, confirma tu cuenta en Bookit.</p>
            <p>Tu cuenta está casi lista, solo necesitas confirmarla en el siguiente enlace:</p>
            <a href="${process.env.FRONTEND_URL}/auth/verify-account/${token}">Verificar cuenta</a>
            <p>Si tú no creaste esta cuenta, por favor ignora este mensaje.</p>
        `
    })
}