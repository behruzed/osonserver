const mongoose = require("mongoose");
mongoose.set('useFindAndModify', false);

const { ObjectId } = mongoose.Schema;

const invitesSchema = new mongoose.Schema({
    ownerId : {
        type: ObjectId,
        ref: "Seller",
        required: true
    },
    amount: {
        type: String,
        trim: true,
        default: 0
    },
    userId : {
        type: ObjectId,
        ref: "Seller",
        required: true
    },
    paid: {
        type: Boolean,
        required: true,
        trim: true,
        default: false
    },
}, { timestamps: true });

module.exports = mongoose.model("Invites", invitesSchema);