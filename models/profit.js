const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const profitSchema = new mongoose.Schema({
    sellerId: {
        type: ObjectId,
        ref: 'Seller',
        required: true
    },
    sellerName: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32
    },
    sellerPhone: {
        type: String,
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
    cardNumber: {
        type: String,
        trim: true,
        required: true,
        maxlength: 16,
        minlength: 16
    },
    status: {
        type: String,
        default: "Jo'natilmoqda",
        enum: ["Jo'natilmoqda", "To'landi", "To`landi", "Bekor qilindi", "Qabul qilindi"]
    },
}, { timestamps: true });

module.exports = mongoose.model('Profit', profitSchema);