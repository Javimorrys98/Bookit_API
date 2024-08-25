import Booking from "../models/Booking.js";

const getUserBookings = async (req, res) => {
    const { user } = req.params;

    if (user !== req.user._id.toString()) {
        const error = new Error('Acceso denegado');
        return res.status(400).json({ msg: error.message });
    }

    try {
        const query = req.user.admin ? { date: { $gte: new Date() } } : { user, date: { $gte: new Date() } };
        const bookings = await Booking
            .find(query)
            .populate('services')
            .populate({ path: 'user', select: 'name email' })
            .select('-password')
            .sort({ date: 'asc' });

        res.json(bookings);
    } catch (error) {
        console.log(error);
    }
}

export {
    getUserBookings
}