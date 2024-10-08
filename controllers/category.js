const Category = require('../models/category');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.categoryById = (req, res, next, id) => {
    Category.findById(id).exec((err, category) => {
        if (err || !category) {
            return res.status(400).json({ error: 'category does not exists' });
        }
        req.category = category;
        next();
    });
};

exports.create = (req, res) => {
    const category = new Category(req.body);
    
    category.save((err, data) => {
        if (err) {
            return res.status(400).json({ error: 'cannot create' });
        }
        res.json({ data });
    });
};

exports.read = (req, res) => {
    
    return res.json(req.category);
};

exports.update = (req, res) => {
    const category = req.category;
    category.name = req.body.name;
    
    // Agar icon yuborilgan bo'lsa, uni ham yangilaymiz
    if (req.body.icon) {
        category.icon = req.body.icon;
    }
    category.save((err, data) => {
        if (err) {
            return res.status(400).json({ error: `yaratib bo'lmadi` });
        }
        res.json(data);
    });
};

exports.remove = (req, res) => {
    const category = req.category;
    Category.find({ category }).exec((err, data) => {
        if (data.length >= 1) {
            return res.status(400).json({
                message: `Sorry. You cant delete ${category.name}. It has ${data.length} associated products.`
            });
        } else {
            category.remove((err, data) => {
                if (err) {
                    return res.status(400).json({ error: errorHandler(err) });
                }
                res.json({ message: 'Category deleted' });
            });
        }
    });
};

exports.list = (req, res) => {    
    Category.find().exec((err, data) => {
        if (err) {
            return res.status(400).json({ error: errorHandler(err) });
        }        
        res.json(data);
    });
};

