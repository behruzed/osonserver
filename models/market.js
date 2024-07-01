const mongoose = require("mongoose");
const crypto = require('crypto');
const { v1: uuidv1 } = require('uuid');

const marketSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32,
        unique: true
    },
    phone: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    balance: {
        type: Number,
        default: 0
    },
    products: {
        type: Number,
        default: 0
    },
    soldProduct: {
        type: Number,
        default: 0
    },
    hashed_password: {
        type: String,
        required: true
    },
    salt: {
        type: String,
    },
}, { timestamps: true });

marketSchema.virtual('password')
.set(function(password) {
    this._password = password;
    this.salt = uuidv1();
    this.hashed_password = this.encryptPassword(password);
})
.get(function() {
    return this._password;
});

marketSchema.methods = {
    authenticate: function(plainText) {
        return this.encryptPassword(plainText) === this.hashed_password;
    },
    
    encryptPassword: function(password) {
        if (!password) return '';
        try {
            return crypto. createHmac('sha1', this.salt)
                            .update(password)
                            .digest('hex');
        } catch(err) {
            return '';
        }
    }
};

module.exports = mongoose.model("Market", marketSchema);