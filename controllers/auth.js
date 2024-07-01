const User = require('../models/user');
const Seller = require('../models/seller')
const jwt = require('jsonwebtoken'); // to generate signed token
const expressJwt = require('express-jwt'); // for authorization check
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.signup = (req, res) => {
    const user = req.body
    if (user.role === 'admin') {
        const admin = new User(user);
        admin.role = 1;
        admin.save((err, user) => {
            if (err) {
                return res.status(400).json({ error: errorHandler(err) });
            }
            res.json({ user });
        });
    } else {
        const seller = new Seller(user);
        seller.balance = 0;
        seller.soldProduct = 0;
        seller.save((err, seller) => {
            if (err) {
                return res.status(400).json({ error: errorHandler(err) });
            }
            res.json({ seller });
        });
    }
};

exports.signin = (req, res) => {
    // find the user based on number 
    const { phone, password, role } = req.body;
    if (role == 'admin') {
        User.findOne({ phone }, (err, user) => {
            if (err || !user) {
                return res.status(400).json({
                    error: 'Bu raqamga ega foydalanuvchi mavjud emas. Iltimos, roʻyxatdan oʻting'
                });
            }
            // if user is found make sure the email and password match
            // create authenticate method in user model
            if (!user.authenticate(password)) {
                return res.status(401).json({
                    error: 'Login parol mos kelmaydi!'
                });
            }
            // generate a signed token with user id and secret
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
            // persist the token as 't' in cookie with expiry date
            res.cookie('t', token, { expire: new Date() + 9999 });
            // return response with user and token to frontend client
            const { _id, name, phone, role } = user;
            return res.json({ token, user: { _id, phone, name, role } });
        });
    } else {
        Seller.findOne({ phone }, (err, user) => {
            if (err || !user) {
                return res.status(400).json({
                    error: 'Bu raqamga ega foydalanuvchi mavjud emas. Iltimos, roʻyxatdan oʻting'
                });
            }
            // if user is found make sure the email and password match
            // create authenticate method in user model
            if (!user.authenticate(password)) {
                return res.status(401).json({
                    error: 'Login parol mos kelmaydi!'
                });
            }
            // generate a signed token with user id and secret
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
            // persist the token as 't' in cookie with expiry date
            res.cookie('t', token, { expire: new Date() + 9999 });
            // return response with user and token to frontend client
            const { _id, name, phone, role } = user;
            return res.json({ token, user: { _id, phone, name, role } });
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
    const profile = req.profile ? req.profile : req.seller;
    let user = profile && req.auth && profile._id == req.auth._id;
    if (!user) {
        return res.status(403).json({
            error: 'Access denied'
        });
    }
    next();
};

exports.isAdmin = (req, res, next) => {
    if (req.profile.role === 0) {
        return res.status(403).json({
            error: 'Admin resourse! Access denied'
        });
    }
    next();
};

