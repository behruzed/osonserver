const Referral = require('../models/referral');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.referralById = (req, res, next, id) => {
    Referral.findById(id).exec((err, referral) => {
        if (err || !referral) {
            return res.status(400).json({ error: 'Referral does not exist' });
        }
        req.referral = referral;
        next();
    });
};

exports.create = (req, res) => {
    const referral = new Referral(req.body);
    referral.save((err, data) => {
        if (err) {
            console.error("Error details:", err);
            return res.status(400).json({ error: 'Cannot create referral', details: err.message });
        }
        res.status(201).json({ data });
    });
};

exports.update = (req, res) => {
    const referral = req.referral;
    referral.name = req.body.name;
    referral.phone = req.body.phone;
    referral.save((err, data) => {
        if (err) {
            return res.status(400).json({ error: `Couldn't update referral` });
        }
        res.json(data);
    });
};

exports.remove = (req, res) => {
    const referral = req.referral;
    Referral.find({ referral }).exec((err, data) => {
        if (err) {
            return res.status(400).json({ error: errorHandler(err) });
        }
        if (data.length >= 1) {
            return res.status(400).json({
                message: `Sorry. You can't delete ${referral.name}. It has ${data.length} associated products.`
            });
        } else {
            referral.remove((err, data) => {
                if (err) {
                    return res.status(400).json({ error: errorHandler(err) });
                }
                res.json({ message: 'Referral deleted' });
            });
        }
    });
};

// Get all referrals filtered by seller ID
exports.getReferralsBySellerId = (req, res) => {
    const seller = req.seller;    
    Referral.find({ seller: seller._id })
        .populate('productId', '_id name video_link')
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({ error: errorHandler(err) });
            }
            res.json(data);
        });
};

exports.list = (req, res) => {
    Referral.find().exec((err, data) => {
        if (err) {
            return res.status(400).json({ error: errorHandler(err) });
        }
        res.json(data);
    });
};