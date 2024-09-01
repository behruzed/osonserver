const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: Number,
        required: true,
        unique: true
    },
    marketId: {
        type: ObjectId,
        ref: 'Market',
        required: true
    },
    referralId: {
        type: ObjectId,
        ref: 'Referral',
    },
    productId: {
        type: ObjectId,
        ref: 'Product',
        required: true
    },
    sellerId: {
        type: ObjectId,
        ref: 'Seller',
        required: true
    },
    productAmount: {
        type: Number,
        trim: true,
        required: true,
        maxlength: 32
    },
    price: {
        type: Number,
        trim: true,
        required: true,
        maxlength: 32
    },
    name: {
        type: String,
        trim: true,
        required: true
    },
    phone: {
        type: String,
        trim: true,
        required: true,
        maxlength: 13
    },
    status: {
        type: String,
        default: "Buyurtma qabul qilindi",
        enum: ["Buyurtma qabul qilindi", "Bekor qilindi", "Jo'natilmoqda", "Jo'natildi", "To'landi"]
    },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);