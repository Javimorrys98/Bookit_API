import Booking from "../models/Booking.js";

const getUserBookings = async (req, res) => {
    const { user } = req.params;
    
    //TODO añadir validación si es admin
    const role = 'user';

    if (user !== req.user._id.toString() && role !== 'admin') {
        const error = new Error('Acceso denegado');
        return res.status(400).json({ msg: error.message });
    }

    try {
        const bookings = await Booking.find({ 
            user,
            date: {
                $gte: new Date()
            }
        }).populate('services').sort({ date: 'asc' });
        res.json(bookings);
    } catch (error) {
        console.log(error);
    }
}

export {
    getUserBookings
}