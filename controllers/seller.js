const Seller = require('../models/seller');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.sellerById = (req, res, next, id) => {
    Seller.findById(id).exec((err, seller) => {
        if (err || !seller) {
            return res.status(400).json({ error: 'Tizim sotuvchi akkauntini aniqlay olmadi' });
        }
        req.seller = seller;
        next();
    });
};

exports.read = (req, res) => {
    req.seller.hashed_password = undefined;
    req.seller.salt = undefined;
    return res.json(req.seller);
};

exports.create = (req, res) => {
    const seller = new Seller(req.body);
    seller.save((err, data) => {
        if (err) {
            console.log(err)
            return res.status(400).json({ error: 'cannot create' });
        }
        res.json({ data });
    });
};


exports.update = (req, res) => {
    const { name, password } = req.body;
    Seller.findOne({ _id: req.profile._id }, (err, seller) => {
        if (err || !seller) {
            return res.status(400).json({ error: 'Tizim sotuvchi akkauntini aniqlay olmadi' });
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

exports.remove = (req, res) => {
    const seller = req.seller;
    Seller.find({ seller }).exec((err, data) => {
        if (data.length >= 1) {
            return res.status(400).json({
                message: `Sorry. You cant delete It has ${data.length} associated products.`
            });
        } else {
            seller.remove((err, data) => {
                if (err) {
                    return res.status(400).json({ error: errorHandler(err) });
                }
                res.json({ message: 'Seller deleted' });
            });
        }
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