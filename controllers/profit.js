const Profit = require("../models/profit");
const Seller = require("../models/seller");
const { errorHandler } = require("../helpers/dbErrorHandler");
const jwt = require('jsonwebtoken'); // Agar JWT ishlatayotgan bo'lsangiz

exports.profitById = (req, res, next, id) => {
    Profit.findById(id).exec((err, profit) => {
        if (err || !profit) {
        return res.status(400).json({ error: "profit does not exists" });
        }
        req.profit = profit;
        next();
    });
};
// Express serverdagi controller funksiyasi
exports.list = (req, res, token) => {

    Profit.find().exec((err, data) => {
        if (err) {
            return res.status(400).json({ error: errorHandler(err) });
        }
        res.json(data);
    });
};
exports.gettoken = (req, res) => {
    const { prId, status } = req.query;

    if (!prId || !status) {
        return res.status(400).json({ error: 'prId and status are required' });
    }

    // Profitni qidirish
    Profit.findById(prId).exec((err, profit) => {
        if (err) {
            return res.status(400).json({ error: errorHandler(err) });
        }
        if (!profit) {
            return res.status(404).json({ error: 'Profit not found' });
        }

        // Statusni yangilash
        profit.status = status;

        // O'zgarishni saqlash
        profit.save((saveErr, updatedProfit) => {
            if (saveErr) {
                return res.status(400).json({ error: errorHandler(saveErr) });
            }

            // Yangilangan ob'ektni qaytarish
            res.json(updatedProfit);
        });
    });
};
exports.updateProfit = (req, res, prId) => {    
    
    return res.json(req.profit);
};
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
exports.getAllProfits = (req, res, prId) => {    
    
    return res.json(req.profit);
};
exports.updateProfitStatus = (req, res) => {
    
    const { status } = req.body;
    
    Profit.findByIdAndUpdate(
        req.params.profitId, 
        { status: status }, 
        { new: true },
        (err, profit) => {
            if (err) {
                return res.status(400).json({ error: "Could not update profit status" });
            }
            res.json(profit);
        }
    );
};
exports.update = (req, res) => {    
    const profit = req.profit;
    profit.status = req.body.status;    
    profit.save((err, data) => {
        if (err) {
            return res.status(400).json({ error: `Yaratib bo'lmadi` });
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