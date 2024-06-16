const Seller = require('../models/seller');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.sellerById = (req, res, next, id) => {
    Seller.findById(id).exec((err, seller) => {
        if (err || !seller) {
            return res.status(400).json({ error: 'Seller not found' });
        }
        req.profile = seller;
        next();
    });
};

exports.read = (req, res) => {
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    return res.json(req.profile);
};

exports.update = (req, res) => {
    const { name, password } = req.body;

    Seller.findOne({ _id: req.profile._id }, (err, seller) => {
        if (err || !seller) {
            return res.status(400).json({ error: 'Seller not found' });
        }
        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
        } else {
            seller.name = name;
        }

        if (password) {
            if (password.length < 6) {
                return res.status(400).json({
                    error: 'Password should be min 6 characters long'
                });
            } else {
                seller.password = password;
            }
        }

        seller.save((err, updatedUser) => {
            if (err) {
                console.log('SELLER UPDATE ERROR', err);
                return res.status(400).json({ error: 'Seller update failed' });
            }
            updatedUser.hashed_password = undefined;
            updatedUser.salt = undefined;
            res.json(updatedUser);
        });
    });
};

exports.list = (req, res) => {
    Seller.find().exec((err, data) => {
        if (err) {
            return res.status(400).json({ error: errorHandler(err) });
        }
        res.json(data);
    });
};