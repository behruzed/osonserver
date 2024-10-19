const User = require('../models/user');
const Seller = require('../models/seller')
const Invites = require('../models/invites')
const Operator = require('../models/operator')
const jwt = require('jsonwebtoken'); // to generate signed token
const expressJwt = require('express-jwt'); // for authorization check
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.signup = (req, res) => {
    const user = req.body;

    if (user.role === 'admin') {
        const admin = new User(user);
        admin.role = 1;
        admin.save((err, user) => {
            if (err) {
                return res.status(400).json({ error: errorHandler(err) });
            }
            res.json({ user });
        });
    } else if (user.role === 'operator') {

        const operator = new Operator(user);
        operator.role = 2;
        operator.balance = 0;
        operator.soldProduct = 0;
        operator.save((err, operator) => {
            if (err) {
                return res.status(400).json({ error: errorHandler(err) });
            }
            res.json({ operator });
        });
    } else {
        const seller = new Seller(user);
        seller.balance = 0;
        seller.soldProduct = 0;
        seller.save((err, seller) => {
            if (err) {
                return res.status(400).json({ error: errorHandler(err) });
            }

            // Agar referralId bor bo'lsa, Invite modeliga ham saqlaymiz
            if (user.referralId) {
                const invite = new Invites({
                    ownerId: user.referralId, // referralId ni ownerId sifatida saqlaymiz
                    userId: seller._id,       // Yangi sellerning ID sini userId sifatida saqlaymiz
                    paid: false               // default qiymati false
                });

                invite.save((err, invite) => {
                    if (err) {
                        return res.status(400).json({ error: errorHandler(err) });
                    }
                    console.log('Invite saqlandi:', invite);
                    res.json({ seller, invite });
                });
            } else {
                res.json({ seller });
            }
        });
    }
};

exports.signin = (req, res) => {
    const { phone, password, role } = req.body;

    if (role === 'admin') {
        User.findOne({ phone }, (err, user) => {
            if (err || !user) {
                return res.status(400).json({
                    error: 'Bu raqamga ega foydalanuvchi mavjud emas. Iltimos, roʻyxatdan oʻting'
                });
            }
            if (!user.authenticate(password)) {
                return res.status(401).json({
                    error: 'Login parol mos kelmaydi!'
                });
            }
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
            res.cookie('t', token, { expire: new Date() + 9999 });
            const { _id, name, phone, role } = user;
            return res.json({ token, user: { _id, phone, name, role } });
        });
    } else if (role === 'user') {
        Operator.findOne({ phone }, (err, operator) => {
            if (err || !operator) {
                Seller.findOne({ phone }, (err, seller) => {
                    if (err || !seller) {
                        return res.status(400).json({
                            error: 'Bu raqamga ega foydalanuvchi mavjud emas. Iltimos, roʻyxatdan oʻting'
                        });
                    }
                    if (!seller.authenticate(password)) {
                        return res.status(401).json({
                            error: 'Login parol mos kelmaydi!'
                        });
                    }
                    const token = jwt.sign({ _id: seller._id }, process.env.JWT_SECRET);
                    res.cookie('t', token, { expire: new Date() + 9999 });
                    const { _id, name, phone, role } = seller;
                    return res.json({ token, user: { _id, phone, name, role } });
                });
            } else {
                if (!operator.authenticate(password)) {
                    return res.status(401).json({
                        error: 'Login parol mos kelmaydi!'
                    });
                }
                const token = jwt.sign({ _id: operator._id }, process.env.JWT_SECRET);
                res.cookie('t', token, { expire: new Date() + 9999 });
                const { _id, name, phone, role } = operator;
                return res.json({ token, user: { _id, phone, name, role } });
            }
        });
    }
};

exports.signout = (req, res) => {
    res.clearCookie('t');
    res.json({ message: 'signout success' });
};

exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
    userProperty: 'auth'
});

exports.isAuth = (req, res, next) => {
    const profile = req.profile ? req.profile : (req.seller ? req.seller : req.operator);
    
    let user = profile && req.auth && profile._id == req.auth._id;
    console.log(user);
    if (!user) {
        return res.status(403).json({
            error: 'Access denied3'
        });
    }
    next();
};

exports.isAdmin = (req, res, next) => {
    if (req.profile.role === 0) {
        return res.status(403).json({
            error: 'Admin resourse! Access denied1'
        });
    }
    next();
};