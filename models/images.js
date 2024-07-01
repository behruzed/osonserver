const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;


const imagesSchema = new mongoose.Schema({
    productId: {
        type: ObjectId,
        ref: 'Product',
        required: true
    },
    photo: {
        data: Buffer,
        contentType: String
    }
}, { timestamps: true });

module.exports = mongoose.model("Images", imagesSchema);