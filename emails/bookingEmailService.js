import { createTransport } from "../config/nodemailer.js";

export async function sendEmailNewBooking({date, time}) {
    const transporter = createTransport(
        process.env.EMAIL_HOST,
        process.env.EMAIL_PORT,
        process.env.EMAIL_USER,
        process.env.EMAIL_PASSWORD
    )

    //Enviar email
    await transporter.sendMail({
        from: 'Bookit <bookings@bookit.com>',
        to: 'admin@bookit.com',
        subject: 'Bookit - Nueva reserva',
        text: 'Bookit - Nueva reserva.',
        html: `<p>Hola Administrador, tienes una nueva reserva.</p>
            <p>La reserva es para el día ${date} a las ${time}h.</p>
        `
    })
}

export async function sendEmailUpdateBooking({date, time}) {
    const transporter = createTransport(
        process.env.EMAIL_HOST,
        process.env.EMAIL_PORT,
        process.env.EMAIL_USER,
        process.env.EMAIL_PASSWORD
    )

    //Enviar email
    await transporter.sendMail({
        from: 'Bookit <bookings@bookit.com>',
        to: 'admin@bookit.com',
        subject: 'Bookit - Reserva actualizada',
        text: 'Bookit - Reserva actualizada.',
        html: `<p>Hola Administrador, una de tus reservas se ha actualizado.</p>
            <p>La nueva reserva es para el día ${date} a las ${time}h.</p>
        `
    })
}

export async function sendEmailDeleteBooking({date, time}) {
    const transporter = createTransport(
        process.env.EMAIL_HOST,
        process.env.EMAIL_PORT,
        process.env.EMAIL_USER,
        process.env.EMAIL_PASSWORD
    )

    //Enviar email
    await transporter.sendMail({
        from: 'Bookit <bookings@bookit.com>',
        to: 'admin@bookit.com',
        subject: 'Bookit - Reserva cancelada',
        text: 'Bookit - Reserva cancelada.',
        html: `<p>Hola Administrador, una de tus reservas se ha cancelado.</p>
            <p>La reserva del día ${date} a las ${time}h ha sido cancelada.</p>
        `
    })
}