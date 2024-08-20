import { parse, formatISO, startOfDay, endOfDay, isValid } from 'date-fns';
import { validateObjectId, handleNotFoundError } from '../utils/index.js';
import Booking from '../models/Booking.js';

const createBooking = async (req, res) => {
    const booking = req.body;
    booking.user = req.user._id.toString();

    try {
        const newBooking = new Booking(booking);
        await newBooking.save();

        res.json({
            msg: 'Reserva creada correctamente.',
        })
    } catch (error) {
        console.log(error);
    }
}

const getBookingsByDate = async (req, res) => {
    const { date } = req.query;
    
    const newDate = parse(date, 'dd/MM/yyyy', new Date());

    if(!isValid(newDate)) {
        const error = new Error('Fecha no válida.');
        return res.status(400).json({
            msg: error.message,
        });
    }

    const isoDate = formatISO(newDate);
    const bookings = await Booking.find({
        date: {
            $gte: startOfDay(new Date(isoDate)),
            $lte: endOfDay(new Date(isoDate)),
        }
    }).select('time');

    res.json(bookings);
}

const getBookingById = async (req, res) => {
    const { id } = req.params;

    // Validar un object id
    if (validateObjectId(id, res)) return;

    // Validar si la reserva existe
    const booking = await Booking.findById(id).populate('services');
    if (!booking) {
        return handleNotFoundError('La reserva no existe.', res);
    }

    // Validar si el usuario es el dueño de la reserva
    if (booking.user.toString() !== req.user._id.toString()) {
        const error = new Error('No tienes permiso para acceder a esta reserva.');
        return res.status(403).json({
            msg: error.message,
        });
    }

    // Devolver la reserva
    res.json(booking);
}

const updateBooking = async (req, res) => {
    const { id } = req.params;

    // Validar un object id
    if (validateObjectId(id, res)) return;

    // Validar si la reserva existe
    const booking = await Booking.findById(id).populate('services');
    if (!booking) {
        return handleNotFoundError('La reserva no existe.', res);
    }

    // Validar si el usuario es el dueño de la reserva
    if (booking.user.toString() !== req.user._id.toString()) {
        const error = new Error('No tienes permiso para acceder a esta reserva.');
        return res.status(403).json({
            msg: error.message,
        });
    }

    const { services, date, time, totalAmount } = req.body;
    booking.services = services;
    booking.date = date;
    booking.time = time;
    booking.totalAmount = totalAmount;

    try {
        await booking.save();

        res.json({
            msg: 'Reserva actualizada correctamente.',
        });
    } catch (error) {
        console.log(error);
    }
}

const deleteBooking = async (req, res) => {
    const { id } = req.params;

    // Validar un object id
    if (validateObjectId(id, res)) return;

    // Validar si la reserva existe
    const booking = await Booking.findById(id).populate('services');
    if (!booking) {
        return handleNotFoundError('La reserva no existe.', res);
    }

    // Validar si el usuario es el dueño de la reserva
    if (booking.user.toString() !== req.user._id.toString()) {
        const error = new Error('No tienes permiso para acceder a esta reserva.');
        return res.status(403).json({
            msg: error.message,
        });
    }

    try {
        await booking.deleteOne();

        res.json({
            msg: 'Reserva cancelada correctamente.',
        });
    } catch (error) {
        console.log(error);        
    }
}

export {
    createBooking,
    getBookingsByDate,
    getBookingById,
    updateBooking,
    deleteBooking,
};