// backend/models/Order.js

const mongoose = require('mongoose');
const { Schema } = mongoose;

const OrderSchema = new Schema({
    // CHANGE: Replaced 'email' with 'user_id'
    user_id: {
        type: String,
        required: true,
    },
    order_data: {
        type: Array,
        required: true,
    },
});

module.exports = mongoose.model('order', OrderSchema);