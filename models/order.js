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
        required: false,
        default: null
    },
    productId: {
        type: ObjectId,
        ref: 'Product',
        required: true
    },
    sellerId: {
        type: String,
        required: false
    },
    productAmount: {
        type: Number,
        required: true,
        trim: true,
        maxlength: 32
    },
    price: {
        type: Number,
        required: true,
        trim: true,
        maxlength: 32
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    region: {
        type: String,
        required: true,
        trim: true,
        default: "Tanlanmagan"
    },
    operator: {
        type: String,
        required: true,
        trim: true,
        default: "Tanlanmagan"
    },
    paid: {
        type: String,
        required: true,
        trim: true,
        default: "Yoq"
    },
    paidOperator: {
        type: String,
        required: true,
        trim: true,
        default: "Yoq"
    },
    oldPrice: {
        type: Number,
        required: false,
        trim: true,
        default: 0
    },
    promo: {
        type: Boolean,
        required: false,
        trim: true,
        default: false // Yana default qiymat qo'shildi
    },
    phone: {
        type: String,
        required: true,
        trim: true,
        maxlength: 13
    },
    status: {
        type: String,
        default: "Jarayonda",
        enum: [
            "Buyurtma qabul qilindi",
            "Bekor qilindi",
            "Jarayonda",
            "Jo'natilmoqda",
            "Jo'natildi",
            "To'landi",
            "Arxivlandi"
        ]
    },
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);