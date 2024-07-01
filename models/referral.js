const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const referralSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        maxlength: 32
    },
    seller: {
        type: ObjectId,
        ref: 'Seller',
        required: true
    },
    price: {
        type: Number,
        trim: true,
        required: true,
        maxlength: 32
    },
    productPrice: {
        type: Number,
        trim: true,
        required: true,
        maxlength: 32
    },
    productName: {
        type: String,
        trim: true,
        required: true,
        maxlength: 64
    },
    productId: {
        type: ObjectId,
        ref: 'Product',
        unique: true,
        required: true
    },
    watched: {
        type: Number,
        default: 0
    },
    sold: {
        type: Number,
        default: 0
    },
    canceled: {
        type: Number,
        default: 0
    },
    delivered: {
        type: Number,
        default: 0
    },
}, { timestamps: true });

module.exports = mongoose.model('Referral', referralSchema);