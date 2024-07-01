const Market = require('../models/market');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.marketById = (req, res, next, id) => {
    Market.findById(id).exec((err, market) => {
        if (err || !market) {
            return res.status(400).json({ error: 'market does not exists' });
        }
        req.market = market;
        next();
    });
};

exports.create = (req, res) => {
    const market = new Market(req.body);
    market.save((err, data) => {
        if (err) {
            return res.status(400).json({ error: 'cannot create' });
        }
        res.json({ data });
    });
};

exports.read = (req, res) => {
    return res.json(req.market);
};

exports.update = (req, res) => {
    const market = req.market;
    market.name = req.body.name;
    market.phone = req.body.phone;
    market.save((err, data) => {
        if (err) {
            return res.status(400).json({ error: `yaratib bo'lmadi`});
        }
        res.json(data);
    });
};

exports.remove = (req, res) => {
    const market = req.market;
    Market.find({ market }).exec((err, data) => {
        if (data.length >= 1) {
            return res.status(400).json({
                message: `Sorry. You cant delete ${market.name}. It has ${data.length} associated products.`
            });
        } else {
            market.remove((err, data) => {
                if (err) {
                    return res.status(400).json({ error: errorHandler(err) });
                }
                res.json({ message: 'Market deleted' });
            });
        }
    });
};

exports.list = (req, res) => {
    Market.find().exec((err, data) => {
        if (err) {
            return res.status(400).json({ error: errorHandler(err) });
        }
        res.json(data);
    });
};

