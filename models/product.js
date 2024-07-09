const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 120
    },
    description: {
        type: String,
        required: true,
        maxlength: 5000
    },
    price: {
        type: Number,
        trim: true,
        required: true,
        maxlength: 32
    },
    sellPrice: {
        type: Number,
        trim: true,
        required: true,
        maxlength: 32
    },
    category: {
        type: ObjectId,
        ref: "Category",
        required: true
    },
    market : {
        type: ObjectId,
        ref: "Market",
        required: true
    },
    quantity: {
        type: Number,
        trim: true,
        required: true,
        maxlength: 32
    },
    video_link: {
        type: String,
        trim: true,
        required: true,
        maxlength: 200
    },
    photo: {
        data: Buffer,
        contentType: String
    },
    photo1: {
        data: Buffer,
        contentType: String
    },
    photo2: {
        data: Buffer,
        contentType: String
    },
    sold: {
        type: Number,
        default: 0
    }
}, { timestamps: true } );

module.exports = mongoose.model("Product", productSchema);