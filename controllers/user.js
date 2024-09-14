const User = require('../models/user');
const Operator = require('../models/operator');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.userById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if (err || !user) {
            Operator.findById(id).exec((err, operator) => {
                if (err || !operator) {
                    return res.status(400).json({ error: 'Tizim sizni admin deb o`ylamadi' });
                }
                req.profile = operator;
                next();
            });
        } else {
            req.profile = user;
            next();
        }
    });
};

exports.read = (req, res) => {
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    return res.json(req.profile);
};

exports.update = (req, res) => {
    const { name, password } = req.body;

    // Birinchi Userni qidiring
    User.findOne({ _id: req.profile._id }, (err, user) => {
        if (err || !user) {
            // Agar User topilmasa, Operatorni qidiring
            Operator.findOne({ _id: req.profile._id }, (err, operator) => {
                if (err || !operator) {
                    return res.status(400).json({ error: 'Foydalanuvchi topilmadi' });
                }

                // Operatorni yangilash
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

                operator.save((err, updatedOperator) => {
                    if (err) {
                        console.log('OPERATOR UPDATE ERROR', err);
                        return res.status(400).json({ error: 'Operator update failed' });
                    }
                    updatedOperator.hashed_password = undefined;
                    updatedOperator.salt = undefined;
                    res.json(updatedOperator);
                });
            });
        } else {
            // Agar User topilgan bo'lsa, yangilash
            if (!name) {
                return res.status(400).json({ error: 'Name is required' });
            } else {
                user.name = name;
            }

            if (password) {
                if (password.length < 6) {
                    return res.status(400).json({
                        error: 'Password should be min 6 characters long'
                    });
                } else {
                    user.password = password;
                }
            }

            user.save((err, updatedUser) => {
                if (err) {
                    console.log('USER UPDATE ERROR', err);
                    return res.status(400).json({ error: 'User update failed' });
                }
                updatedUser.hashed_password = undefined;
                updatedUser.salt = undefined;
                res.json(updatedUser);
            });
        }
    });
};

exports.list = (req, res) => {
    User.find().exec((err, data) => {
        if (err) {
            return res.status(400).json({ error: errorHandler(err) });
        }
        res.json(data);
    });
};