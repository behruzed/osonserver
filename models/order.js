const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const orderScheme = new mongoose.Schema({
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
        type: String,
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
    region: {
        type: String,
        trim: true,
        required: true,
        default: "Tanlanmagan"
    },
    operator: {
        type: String,
        trim: true,
        required: true,
        default: "Tanlanmagan"
    },
    paid: {
        type: Boolean,
        trim: true,
        required: true,
        default: false
    },
    oldPrice: {
        type: Number,
        trim: true,
        required: false,
        default: 0
    },
    promo: {
        type: Boolean,
        trim: true,
        required: false,
    },
    phone: {
        type: String,
        trim: true,
        required: true,
        maxlength: 13
    },
    status: {
        type: String,
        default: "Jarayonda",
        enum: ["Buyurtma qabul qilindi", "Bekor qilindi",  "Jarayonda", "Jo'natilmoqda", "Jo'natildi", "To'landi", "Arxivlandi"]
    },
}, { timestamps: true });
module.exports = mongoose.model("Order", orderScheme);