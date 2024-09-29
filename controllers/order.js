const Product = require('../models/product');
const Market = require('../models/market');
const Order = require('../models/order');
const Referral = require('../models/referral');
const Seller = require('../models/seller');
const TelegramBot = require('node-telegram-bot-api');
const Token = process.env.TOKEN;

// const bot = new TelegramBot(Token, {
//     polling: true
// });

// bot.on('message', msg => {
//     const chatId = msg.chat.id;
//     const text = msg.text;
//     bot.sendMessage(chatId, text);
// });

exports.create = (req, res) => {
    let orderNumber = Math.floor(Math.random() * 1000000000);
    const { id } = req.params;
    const { emaunt, price, oldPrice, name, tel, marketId, referral } = req.body;

    if (referral) {
        Referral.findById(referral)
            .exec((err, referralData) => {
                if (err || !referralData) {
                    return res.json({
                        error: 'Referral not found'
                    });
                }

                // `watched` qiymatini 1 taga ko'paytirish
                referralData.watched += 1;

                // Referral ma'lumotlarini saqlash
                referralData.save((err) => {
                    if (err) {
                        return res.json({
                            error: 'Error updating referral'
                        });
                    }

                    // Referral topildi, sellerId ni orderga qo'shish
                    const sellerId = referralData.seller || "Sotuvchisi yo`q bo`lgan mahsulot";

                    const order = new Order({
                        orderNumber,
                        marketId,
                        referralId: referral,
                        productId: id,
                        productAmount: emaunt,
                        price,
                        oldPrice,
                        name,
                        phone: tel,
                        sellerId // sellerId ni qo'shdik
                    });

                    order.save((err, data) => {
                        if (err) {
                            return res.json({
                                error: 'Error saving order'
                            });
                        }
                        res.status(200).json({
                            data,
                            message: 'Order created successfully'
                        });
                    });

                    // Mahsulotni yangilash
                    Product.findById(id)
                        .select("-photo1")
                        .select("-photo2")
                        .select("-description")
                        .exec((err, product) => {
                            if (err || !product) {
                                return res.json({
                                    error: 'Product not found'
                                });
                            }
                            product.sold += emaunt;
                            product.quantity -= emaunt;
                            product.save();

                            let media_group = [];
                            media_group.push({
                                type: 'photo',
                                media: product.photo.data,
                                caption: `<b>Buyurtma raqami ${orderNumber}</b>\n\n<b>🧾Mahsulot nomi:</b> ${product.name}\n<b>💰Narxi:</b> ${price} so'm\n<b>🔢Mahsulot soni:</b> ${emaunt}\n<b>👨Buyutmachi:</b> ${name}\n<b>☎️Tel:</b> ${tel}\n`,
                                parse_mode: 'HTML'
                            });

                            // bot.sendMediaGroup(-1002007856253, media_group);
                        });
                });
            });
    } else {
        // Referral bo'lmasa, sellerId ni "Sotuvchisi yo'q bo`lgan mahsulot" deb qo'shish
        const order = new Order({
            orderNumber,
            marketId,
            referralId: null,
            productId: id,
            productAmount: emaunt,
            price,
            // oldPrice ni qo'shmaymiz
            name,
            phone: tel,
            sellerId: "Sotuvchisi yo`q bo`lgan mahsulot"
        });

        order.save((err, data) => {
            if (err) {
                return res.json({
                    error: 'Error saving order2'
                });
            }
            res.status(200).json({
                data,
                message: 'Order created successfully'
            });
        });

        // Mahsulotni yangilash
        Product.findById(id)
            .select("-photo1")
            .select("-photo2")
            .select("-description")
            .exec((err, product) => {
                if (err || !product) {
                    return res.json({
                        error: 'Product not found'
                    });
                }
                product.sold += emaunt;
                product.quantity -= emaunt;
                product.save();

                let media_group = [];
                media_group.push({
                    type: 'photo',
                    media: product.photo.data,
                    caption: `<b>Buyurtma raqami ${orderNumber}</b>\n\n<b>🧾Mahsulot nomi:</b> ${product.name}\n<b>💰Narxi:</b> ${price} so'm\n<b>🔢Mahsulot soni:</b> ${emaunt}\n<b>👨Buyutmachi:</b> ${name}\n<b>☎️Tel:</b> ${tel}\n`,
                    parse_mode: 'HTML'
                });

                // bot.sendMediaGroup(-1002007856253, media_group);
            });
    }
};

// `multipleOrders`, `list`, `updateStatus`, `remove` funksiyalari quyidagicha qoladi:

exports.multipleOrders = (req, res) => {
    const { orders } = req.body;
    orders.map(order => {
        let orderNumber = Math.floor(Math.random() * 1000000000);
        const { id, emaunt, price, oldPrice, name, tel, marketId, referral } = order;
        const orderDb = new Order({
            orderNumber,
            marketId,
            referralId: referral ? referral : null,
            productId: id,
            productAmount: emaunt,
            price,
            oldPrice,
            name,
            phone: tel
        });

        orderDb.save((err, data) => {
            if (err) {
                return res.json({
                    error: 'error'
                });
            }
            res.status(200).json({
                data,
                message: 'success'
            });
        });

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
                    product.save();

                    let media_group = [];
                    media_group.push({
                        type: 'photo',
                        media: product.photo.data,
                        caption: `<b>Buyurtma raqami ${orderNumber}</b>\n\n<b>🧾Mahsulot nomi:</b> ${product.name}\n<b>💰Narxi:</b> ${price} so'm\n<b>🔢Mahsulot soni:</b> ${emaunt}\n<b>👨Buyutmachi:</b> ${name}\n<b>☎️Tel:</b> ${tel}\n`,
                        parse_mode: 'HTML'
                    });

                    // bot.sendMediaGroup(-1002007856253, media_group);
                }
            });

        // Referral bilan bog'liq ma'lumotlarni olish uchun qo'shimcha kod:
        if (referral) {
            Referral.findById(referral)
                .exec((err, referralData) => {
                    if (err || !referralData) {
                        console.log("Referral topilmadi.");
                    } else {
                        console.log("Privet");

                    }
                });
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
};

exports.updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const order = await Order.findById(id).exec();
        if (!order) return res.json({ error: 'error0' });

        const product = await Product.findById(order.productId).exec();
        if (!product) {
            console.log("Warning: Mahsulot mavjud emas");
        } else if (status === 'Bekor qilindi') {
            product.quantity += order.productAmount;
            product.sold -= order.productAmount;

            if (order.referralId) {
                const referral = await Referral.findById(order.referralId).exec();
                if (!referral) return res.json({ error: 'error2' });

                referral.canceled += order.productAmount;
                await referral.save();
            }

            await product.save();
        }
        const market = await Market.findById(order.marketId).exec();
        if (!market) {
            console.log("Warning: Do`kon topilmadi");
        } else if (status === 'To\'landi') {
            market.soldProduct += order.productAmount;
            await market.save();

            if (order.referralId) {
                const referral = await Referral.findById(order.referralId).exec();
                if (!referral) return res.json({ error: 'error4' });

                const seller = await Seller.findById(referral.seller).exec();
                if (!seller) return res.json({ error: 'error5' });

                seller.balance = String(Number(seller.balance) + Number(product.sellPrice));
                await seller.save();

                referral.sold += order.productAmount;
                referral.delivered += order.productAmount;
                await referral.save();
            }
        }
        order.status = status;
        const data = await order.save();
        res.json(data);

    } catch (err) {
        console.log("Xatolik yuz berdi: ", err);
        res.json({ error: 'error88', message: err.message });
    }
};

exports.remove = (req, res) => {
    const { id } = req.params;
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
};