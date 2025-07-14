const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    foodItems: { type: [String], required: true },
    trainNumber: { type: String, required: true },
    coachNumber: { type: String, required: true },
    seatNumber: { type: String, required: true }
});

module.exports = mongoose.model('Customer', CustomerSchema);