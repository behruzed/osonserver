const mongoose = require('mongoose');
const crypto = require('crypto');
const { v1: uuidv1 } = require('uuid');

const operatorSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32
    }, 
    phone: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    status: {
        type: String,
        trim: true,
        required: true,
        default: "operator"
    }, 
    hashed_password: {
        type: String,
        required: true
    },
    role: {
        type: Number,
        default: 2
    },
    balance: {
        type: String,
        trim: true,
        default: 0
    },
    soldProduct: {
        type: String,
        trim: true
    },
    salt: {
        type: String,
    },
}, { timestamps: true });

// virtual field
operatorSchema.virtual('password')
.set(function(password) {
    this._password = password;
    this.salt = uuidv1();
    this.hashed_password = this.encryptPassword(password);
})
.get(function() {
    return this._password;
});

operatorSchema.methods = {
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

module.exports = mongoose.model('Operator', operatorSchema);
