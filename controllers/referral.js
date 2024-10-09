const Referral = require('../models/referral');
const { errorHandler } = require('../helpers/dbErrorHandler');

// Referral by ID
exports.referralById = (req, res, next, id) => {
    Referral.findById(id).exec((err, referral) => {
        if (err || !referral) {
            return res.status(400).json({ error: 'Referral does not exist' });
        }
        req.referral = referral;
        next();
    });
};

// Create Referral
exports.create = (req, res) => {
    const referral = new Referral(req.body);
    referral.save((err, data) => {
        if (err) {
            console.error("Error details:", err, data);
            console.log(res.status);
            
            if (err.code === 11000) {
                return res.status(400).json({ error: 'Referralni yaratib bo`lmadi, ehtimol productId yoki boshqa qiymat takrorlanmoqda' });
            }
            return res.status(400).json({ error: 'Referralni yaratib bo`lmadi', details: err.message });
        }
        res.status(201).json({ data });
    });
};

// Read Referral
exports.read = (req, res) => {
    return res.json(req.referral);
};

// Update Referral
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

// Remove Referral
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

// List all Referrals
exports.list = (req, res) => {
    Referral.find().exec((err, data) => {
        if (err) {
            return res.status(400).json({ error: errorHandler(err) });
        }
        res.json(data);
    });
};