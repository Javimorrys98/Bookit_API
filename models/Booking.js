import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    services: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Services"
        }
    ],
    date: {
        type: Date,
    },
    time: {
        type: String,
    },
    totalAmount: {
        type: Number,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;