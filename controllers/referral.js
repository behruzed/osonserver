const Referral = require('../models/referral');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.referralById = (req, res, next, id) => {
    Referral.findById(id).exec((err, referral) => {
        if (err || !referral) {
            return res.status(400).json({ error: 'referral does not exists' });
        }
        req.referral = referral;
        next();
    }   
)}

exports.create = (req, res) => {
    const referral = new Referral(req.body);
    referral.save((err, data) => {
        if (err) {
            console.log(err)
            return res.status(400).json({ error: 'cannot create' });
        }
        res.status(201).json({ data });
    });
};

exports.read = (req, res) => {
    return res.json(req.referral);
};

exports.update = (req, res) => {
    const referral = req.referral;
    referral.name = req.body.name;
    referral.phone = req.body.phone;
    referral.save((err, data) => {
        if (err) {
            return res.status(400).json({ error: `yaratib bo'lmadi`});
        }
        res.json(data);
    });
};

exports.remove = (req, res) => {
    const referral = req.referral;
    Referral.find({ referral }).exec((err, data) => {
        if (data.length >= 1) {
            return res.status(400).json({
                message: `Sorry. You cant delete ${referral.name}. It has ${data.length} associated products.`
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
}

// get all referals filtered seller id 
exports.getReferralsBySellerId = (req, res) => {
    const seller = req.seller;
    Referral.find({ seller: seller._id }).exec((err, data) => {
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
}