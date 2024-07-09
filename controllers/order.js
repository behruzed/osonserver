const Product = require('../models/product');
const Market = require('../models/market');
const Order = require('../models/order')
const Referral = require('../models/referral')
const Seller = require('../models/seller')
const TelegramBot = require('node-telegram-bot-api')
// const textflow = require("textflow.js");
const Token = process.env.TOKEN

const bot = new TelegramBot(Token, {
    polling: true
})

bot.on('message', msg => {
    const chatId = msg.chat.id
    const text = msg.text
    bot.sendMessage(chatId, text)
})



exports.create = (req, res) => {
    let orderNumber = Math.floor(Math.random() * 1000000000)
    const {id} = req.params
    const {emaunt, price, name, tel, marketId, referral} = req.body
    // textflow.useKey("5p0vvuJrLXNrKJPmmY2yo3DIHfLtJ7u7N9MAWEOde30jPJHSYJfWrkMMsKt8c0G0");

    // textflow.sendSMS(tel, `Buyurtma raqami ${price} so'm buyutmangiz qabul qilindi`, (result) => {
    //     console.log(result)
    //     if (result.ok) {
    //       console.log("SUCCESS");
    //     }
    //   })
    const order = new Order({
        orderNumber,
        marketId,
        referralId: referral ? referral : null,
        productId: id,
        productAmount: emaunt,
        price,
        name,
        phone: tel
    });
    order.save((err, data) => {
        if (err) {
            return res.json({
                error: 'error'
            });
        }
        res.status(200).json({
            data,
            message: 'success'
        });
    }
    );
    Product.findById(id)
    .select("-photo1")
    .select("-photo2")
    .select("-description")
    .exec((err, product) => {
        if (err || !product) {
            return res.json({
                error: 'error'
            });
        } 
        if (product) {
            product.sold = product.sold + emaunt;
            product.quantity = product.quantity - emaunt;
            product.save()
            let media_group = []
            media_group.push({
                type: 'photo',
                media: product.photo.data,
                caption: `<b>Buyurtma raqami ${orderNumber}</b>\n\n<b>🧾Mahsulot nomi:</b> ${product.name}\n<b>💰Narxi:</b> ${price} so'm\n<b>🔢Mahsulot soni:</b> ${emaunt}\n<b>👨Buyutmachi:</b> ${name}\n<b>☎️Tel:</b> ${tel}\n`,
                parse_mode: 'HTML'
            })
            bot.sendMediaGroup(-1002007856253, media_group)
        }
    });
};

exports.list = (req, res) => {
    Order.find()
        .sort('-createdAt')
        .populate('productId', 'name')
        .populate('marketId', 'name')
        .exec((err, orders) => {
        if (err) {
            return res.json({
                error: 'error'
            });
        }
        res.json(orders);
    });
}

exports.updateStatus = (req, res) => {
    const {id} = req.params
    const {status} = req.body
    Order.findById(id).exec((err, order) => {
        console.log(order)
        if (err || !order) {
            return res.json({
                error: 'error'
            });
        }
        Product.findById(order.productId).exec((err, product) => {
            if (err || !product) {
                return res.json({
                    error: 'error'
                });
            }
            if(status === 'Bekor qilindi') {
                product.quantity = product.quantity + order.productAmount;
                product.sold = product.sold - order.productAmount;

                if(order.referralId) {
                    Referral.findById(order.referralId).exec((err, referral) => {
                        if (err || !referral) {
                            return res.json({
                                error: 'error'
                            });
                        }
                        referral.canceled = referral.canceled + order.productAmount;
                        referral.save()
                    });
                }
            }
            if(status === 'To\'landi') {
                Market.findById(order.marketId).exec((err, market) => {
                    if (err || !market) {
                        return res.json({
                            error: 'error'
                        });
                    }
                    market.soldProduct = market.soldProduct + order.productAmount;
                    market.save()
                });

                if(order.referralId) {
                    Referral.findById(order.referralId).exec((err, referral) => {
                        if (err || !referral) {
                            return res.json({
                                error: 'error'
                            });
                        }

                        Seller.findById(referral.seller).exec((err, seller) => {
                            if (err || !seller) {
                                return res.json({
                                    error: 'error'
                                });
                            }
                            seller.balance = seller.balance + product.sellPrice;
                            seller.save()
                        });
                        referral.sold = referral.sold + order.productAmount;
                        referral.delivered = referral.delivered + order.productAmount;
                        referral.save()
                    });
                }
            }
            product.save()
        }
        );

        order.status = status
        order.save((err, data) => {
            if (err) {
                console.log(err)
                return res.json({
                    error: 'error'
                });
            }
            res.json(data);
        });
    });
}

exports.remove = (req, res) => {
    const {id} = req.params
    Order.findById(id).exec((err, order) => {
        if (err || !order) {
            return res.json({
                error: 'error'
            });
        }
        order.remove((err, data) => {
            if (err) {
                return res.json({
                    error: 'error'
                });
            }
            res.json({
                message: 'success'
            });
        });
    });
}