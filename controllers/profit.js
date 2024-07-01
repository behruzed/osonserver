const Profit = require("../models/profit");
const Seller = require("../models/seller");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.profitById = (req, res, next, id) => {
    Profit.findById(id).exec((err, profit) => {
        if (err || !profit) {
        return res.status(400).json({ error: "profit does not exists" });
        }
        req.profit = profit;
        next();
    });
};

exports.list = (req, res) => {
    Profit.find().exec((err, data) => {
        if (err) {
            return res.status(400).json({ error: errorHandler(err) });
        }
        res.json(data);
    });
}

exports.profitBySellerId = (req, res) => {
    const seller = req.seller;
    Profit.find({ sellerId: seller._id }).exec((err, data) => {
        if (err) {
            return res.status(400).json({ error: errorHandler(err) });
        }
        res.json(data);
    });
}

exports.create = (req, res) => {
    const profit = new Profit(req.body);
    const seller = new Seller(req.seller);
    console.log(profit);
    if (parseInt(profit.cardNumber.length) !== 16) {
        return res.status(400).json({ error: "Karta raqami 16 xonali bo'lishi kerak" });
    }
    if (Number(seller.balance) < Number(profit.price)) {
        return res.status(400).json({ error: "Hisobda yetarli mablag' yo'q" });
    } else {
        profit.save((err, data) => {
            if (err) {
                return res.status(400).json({ error: "cannot create" });
            }
            seller.balance = seller.balance - profit.price;
            seller.save((err, data) => {
                if (err) {
                    return res.status(400).json({ error: "cannot create" });
                }
                res.json({ data });
            }

            );
        });
    }
};

exports.read = (req, res) => {
    return res.json(req.profit);
};

exports.update = (req, res) => {
    const profit = req.profit;
    profit.status = req.body.status;
    profit.save((err, data) => {
        if (err) {
            return res.status(400).json({ error: `yaratib bo'lmadi` });
        }
        res.json(data);
    });
};

exports.remove = (req, res) => {
    const profit = req.profit;
    Profit.find({ profit }).exec((err, data) => {
        if (data.length >= 1) {
            return res.status(400).json({
                message: `Sorry. You cant delete ${profit.name}. It has ${data.length} associated products.`,
            });
        } else {
            profit.remove((err, data) => {
                if (err) {
                    return res.status(400).json({ error: errorHandler(err) });
                }
                res.json({ message: "Profit deleted" });
            });
        }
    });
};