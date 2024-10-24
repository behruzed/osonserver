const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const referralSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        unique: false,
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
        required: true
    },
    productPrice: {
        type: Number,
        trim: true,
        required: true
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
        unique: false,
        required: true
    },
    sold: {
        type: Number,
        default: 0
    },
    processing: {
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
    delivering: {
        type: Number,
        default: 0
    },
    archived: {
        type: Number,
        default: 0
    },
    confirmed: {
        type: Number,
        default: 0
    },
}, { timestamps: true });

module.exports = mongoose.model('Referral', referralSchema);