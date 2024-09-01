const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const Product = require('../models/product');
const Market = require('../models/market')
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.productById = (req, res, next, id) => {
    Product.findById(id).exec((err, product) => {
        if (err || !product) {
            return res.status(400).json({
                error: 'product not found'
            });
        } 
        req.product = product;
        next();
    });
};

exports.read = (req, res) => {
    const { referralId } = req.params;
    req.product.photo = undefined;
    return res.json(req.product);
};

exports.create = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Image could not be uploaded'
            });
        }

        // check for all fields
        const { name, description, price, category, quantity, market, video_link } = fields;

        if (!name || !description || !price || !category || !quantity || !market) {
            return res.status(400).json({
                error: 'All fields are required'
            });
        }
        // market's product count should be updated
        Market.findById(market).exec((err, market) => {
            if (err || !market) {
                return res.status(400).json({
                    error: 'Market not found'
                });
            }
            market.products = market.products + 1;
            market.save();
        });

        let product = new Product(fields);
        if (files.photo) {
            if (files.photo.size > 1000000) {
                return res.status(400).json({
                    error: 'Image should be less than 1mb in size'
                });
            }
            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType = files.photo.type;
        }
        if (files.photo1) {
            if (files.photo1.size > 1000000) {
                return res.status(400).json({
                    error: 'Image should be less than 1mb in size'
                });
            }
            product.photo1.data = fs.readFileSync(files.photo1.path);
            product.photo1.contentType = files.photo1.type;
        }
        if (files.photo2) {
            if (files.photo2.size > 1000000) {
                return res.status(400).json({
                    error: 'Image should be less than 1mb in size'
                });
            }
            product.photo2.data = fs.readFileSync(files.photo2.path);
            product.photo2.contentType = files.photo2.type;
        }

        product.save((err, result) => {
            if (err) {
                console.log('PRODUCT CREATE ERROR ', err);
                return res.status(400).json({ error: errorHandler(err) });
            }
            res.json(result);
        });
    });
};

exports.remove = (req, res) => {
    let product = req.product;
    product.remove((err, deletedProduct) => {
        if (err) {
            return res.status(400).json({ error: errorHandler(err) });
        }
        res.json({ message: 'Product deleted successfully' });
        // market's product count should be updated
        Market.findById(product.market).exec((err, market) => {
            if (err || !market) {
                return res.status(400).json({
                    error: 'Market not found'
                });
            }
            market.products = market.products - 1;
            market.save();
        });
    });
};

exports.update = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Image could not be uploaded'
            });
        }

        // check for all fields
        const { name, description, price, category } = fields;

        if (!name || !description || !price || !category) {
            return res.status(400).json({
                error: 'All fields are required'
            });
        }
        
        let product = req.product;
        product = _.extend(product, fields);

        if (files.photo) {
            // console.log("FILES PHOTO: ", files.photo);
            if (files.photo.size > 1000000) {
                return res.status(400).json({
                    error: 'Image should be less than 1mb in size'
                });
            }
            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType = files.photo.type;
        }

        product.save((err, result) => {
            if (err) {
                return res.status(400).json({ error: errorHandler(err) });
            }
            res.json(result);
        });
    });
};


/**
 * sell / arrival
 * by sell = /products?sortBy=sold&order=desc&limit=4
 * by arrival = /products?sortBy=createdAt&order=desc&limit=4
 * if no params are sent, then all products are returned
 */

exports.list = (req, res) => {
    let order = req.query.order ? req.query.order : 'asc';
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
    let limit = req.query.limit ? parseInt(req.query.limit) : 6;

    Product.find()
        .select('name')
        .select('_id')
        .select('price')
        .populate('market', '_id name')
        .sort([[sortBy, order]])
        .limit(limit)
        .exec((err, products) => {
            if (err) {
                return res.status(400).json({ error: 'Products not found' });
            }
            res.json(products);
        });
};

/**
 * it will find the products based on the req product category
 * other products that has the same category, will be returned
 */

exports.listRelated = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 6;

    Product.find({ _id: { $ne: req.product }, category: req.product.category })
        .limit(limit)
        .populate('category', '_id name')
        .exec((err, products) => {
            if (err) {
                return res.status(400).json({ error: 'Products not found' });
            }
            res.json(products);
        });
};

exports.listCategories = (req, res) => {
    Product.distinct('category', {}, (err, categories) => {
        if (err) {
            return res.status(400).json({ error: 'Categories not found' });
        }
        res.json(categories);
    });
};


/**
 * list products by search
 * we will implement product search in react frontend
 * we will show categories in checkbox and price range in radio buttons
 * as the user clicks on those checkbox and radio buttons
 * we will make api request and show the products to users based on what he wants
 */

exports.listBySearch = (req, res) => {
    let order = req.body.order ? req.body.order : 'desc';
    let sortBy = req.body.sortBy ? req.body.sortBy : '_id';
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);
    let findArgs = {};

    // console.log(order, sortBy, limit, skip, req.body.filters);
    // console.log("findArgs", findArgs);

    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === 'price') {
                // gte -  greater than price [0-10]
                // lte - less than
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                };
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }

    Product.find(findArgs)
        .select('-photo')
        .populate('category')
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({ error: 'Products not found' });
            }
            res.json({ size: data.length, data });
        });
};

exports.photo = (req, res, next) => {
    if (req.product.photo.data) {
        res.set('Content-Type', req.product.photo.contentType);
        return res.send(req.product.photo.data);
    }
    next();
};

exports.photo1 = (req, res, next) => {
    if (req.product.photo1.data) {
        res.set('Content-Type', req.product.photo1.contentType);
        return res.send(req.product.photo1.data);
    }
    next();
}

exports.photo2 = (req, res, next) => {
    if (req.product.photo2.data) {
        res.set('Content-Type', req.product.photo2.contentType);
        return res.send(req.product.photo2.data);
    }
    next();
}

exports.listSearch = (req, res) => {
    const query = {};
    if (req.query.search) {
        query.name = { $regex: req.query.search, $options: 'i' };
       
        if (req.query.category && req.query.category != 'All') {
            query.category = req.query.category;
        }
        Product.find(query, (err, products) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(products);
        }).select('-photo');
    }
};

exports.listProducts = (req, res) => {
    var page = Math.max(0, req.query.page)
    var limit = Math.max(0, req.query.limit)

    Product.find()
        .sort('-createdAt')
        .select('-photo1')
        .select('-photo2')
        .select('-description')
        .limit(limit)
        .skip(page)
        .populate('category', '_id name')
        .populate('market', '_id name')
        .exec((err, products) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            res.json(products);
    });
}

exports.getButtons = (req, res) => {
    const limit = req.query.limit;
    Product.count().exec((err, products) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        let btns = [];
        for (let i = 1; i <= Math.ceil(products / limit); i++) {
            btns.push(i)
        }
        res.json(btns)
    })
}