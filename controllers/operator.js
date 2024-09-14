const Operator = require('../models/operator');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.operatorById = (req, res, next, id) => {
    Operator.findById(id).exec((err, operator) => {
        if (err || !operator) {
            return res.status(400).json({ error: 'Tizim sotuvchi akkauntini aniqlay olmadi1' });
        }
        req.operator = operator;
        next();
    });
};

exports.read = (req, res) => {
    req.operator.hashed_password = undefined;
    req.operator.salt = undefined;
    return res.json(req.operator);
};

exports.create = (req, res) => {
    const operator = new Operator(req.body);
    operator.save((err, data) => {
        if (err) {
            console.log(err)
            return res.status(400).json({ error: 'cannot create' });
        }
        res.json({ data });
    });
};


exports.update = (req, res) => {
    const { name, password } = req.body;
    Operator.findOne({ _id: req.profile._id }, (err, operator) => {
        if (err || !operator) {
            return res.status(400).json({ error: 'Tizim sotuvchi akkauntini aniqlay olmadi2' });
        }
        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
        } else {
            operator.name = name;
        }

        if (password) {
            if (password.length < 6) {
                return res.status(400).json({
                    error: 'Password should be min 6 characters long'
                });
            } else {
                operator.password = password;
            }
        }

        operator.save((err, updatedUser) => {
            if (err) {
                console.log('OPERATOR UPDATE ERROR', err);
                return res.status(400).json({ error: 'operator update failed' });
            }
            updatedUser.hashed_password = undefined;
            updatedUser.salt = undefined;
            res.json(updatedUser);
        });
    });
};

exports.remove = (req, res) => {
    const operator = req.operator;
    Operator.find({ operator }).exec((err, data) => {
        if (data.length >= 1) {
            return res.status(400).json({
                message: `Sorry. You cant delete It has ${data.length} associated products.`
            });
        } else {
            operator.remove((err, data) => {
                if (err) {
                    return res.status(400).json({ error: errorHandler(err) });
                }
                res.json({ message: 'Operator deleted' });
            });
        }
    });
};

exports.list = (req, res) => {
    Operator.find().exec((err, data) => {
        if (err) {
            return res.status(400).json({ error: errorHandler(err) });
        }
        res.json(data);
    });
};