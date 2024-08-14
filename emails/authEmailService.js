import { createTransport } from "../config/nodemailer.js";

export async function sendEmailVerification({name, email, token}) {
    const transporter = createTransport(
        'sandbox.smtp.mailtrap.io',
        2525,
        '047955b69058cb',
        'fa88ef004ece4a'
    )

    //Enviar email
    const info = await transporter.sendMail({
        from: 'Bookit',
        to: email,
        subject: 'Bookit - Verifica tu cuenta',
        text: 'Haz click en el siguiente enlace para verificar tu cuenta.',
        html: `<p>Hola: ${name}, confirma tu cuenta en Bookit</p>
            <p>Tu cuenta está casi lista, solo necesitas confirmarla en el siguiente enlace:</p>
            <a href="http://localhost:4000/api/auth/verify/${token}">Verificar cuenta</a>
            <p>Si tú no creaste esta cuenta, por favor ignora este mensaje.</p>
        `
    })

    console.log('Mensaje enviado: ', info.messageId);
}