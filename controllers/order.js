const Product = require('../models/product');
const Operator = require('../models/operator');
const User = require('../models/user');
const Market = require('../models/market');
const Order = require('../models/order');
const Referral = require('../models/referral');
const Seller = require('../models/seller');
const TelegramBot = require('node-telegram-bot-api');
const market = require('../models/market');
const Token = process.env.TOKEN;

// const bot = new TelegramBot(Token, {
//     polling: true
// });

// bot.on('message', msg => {
//     const chatId = msg.chat.id;
//     const text = msg.text;
//     bot.sendMessage(chatId, text);
// });


exports.metaOrder = async (req, res) => {
    try {
        let { phone, name, offer_id, referral } = req.query;

        if (phone && phone.length > 13) {
            phone = phone.substring(0, 13);
        }

        const product = await Product.findById(offer_id)
            .select("-photo1 -photo2 -description -oldPrice -sellPrice -video_link");

        if (!product) {
            return res.json({ error: 'Product not found' });
        }

        const orderNumber = Math.floor(Math.random() * 1000000);
        const price = product.price || (Math.random() * 100).toFixed(2);

        const newOrder = new Order({
            phone,
            name,
            productId: offer_id,
            referralId: referral,
            orderNumber,
            productAmount: 1,
            price,
            sellerId: "Instagram",
            marketId: product.market
        });

        await newOrder.save();

        res.status(200).json({ message: 'Order created successfully', orderId: newOrder._id });
    } catch (error) {
        console.log(error);

        const randomErrors = [
            "Path `price` is required.",
            "Path `productAmount` is required.",
            "Path `sellerId` is required.",
            "Path `marketId` is required.",
            "Path `orderNumber` is required."
        ];

        const randomError = randomErrors[Math.floor(Math.random() * randomErrors.length)];

        if (!res.headersSent) {
            res.status(400).json({ error: `Order validation failed: ${randomError}, ${error.message}` });
        }
    }
};

exports.create = (req, res) => {
    let orderNumber = Math.floor(Math.random() * 1000000000);
    const { id } = req.params;

    const { emaunt, price, oldPrice, promo, name, tel, marketId, referralId } = req.body;

    // referralId mavjud bo'lmasa, null qilib o'rnatamiz
    let referralValue = referralId || null;

    // Agar referralId mavjud bo'lsa, referral ma'lumotlarini olish
    if (referralValue) {
        Referral.findById(referralValue)
            .exec((err, referralData) => {
                if (err || !referralData) {
                    referralValue = null; // referralData yo'q bo'lsa, referralni null qilamiz
                } else {
                    // referralData mavjud bo'lsa, watched maydonini yangilaymiz
                    referralData.processing += emaunt;
                    referralData.save((err) => {
                        if (err) {
                            return res.json({
                                error: 'Error updating referral'
                            });
                        }
                    });
                }

                // Sotuvchi ID ni referralData dan olish yoki mavjud emasligini tekshirish
                const sellerId = referralData ? referralData.seller || "Sotuvchisi yo`q bo`lgan mahsulot" : "Sotuvchisi yo`q bo`lgan mahsulot";

                // Order yaratish
                const order = new Order({
                    orderNumber,
                    marketId,
                    referralId: referralValue || null, // ReferralID mavjud bo'lsa saqlaymiz
                    productId: id,
                    productAmount: emaunt,
                    price,
                    promo,
                    oldPrice,
                    name,
                    phone: tel,
                    sellerId
                });

                order.save((err, data) => {
                    if (err) {
                        console.error(err); // Xatolikni konsolga chiqarish
                        return res.status(500).json({
                            error: 'Error saving order'
                        });
                    }
                    res.status(200).json({
                        data,
                        message: 'Order created successfully'
                    });
                });

                // Mahsulot yangilash
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

                        // Media group yaratish
                        let media_group = [];
                        media_group.push({
                            type: 'photo',
                            media: product.photo.data,
                            caption: `<b>Buyurtma raqami ${orderNumber}</b>\n\n<b>🧾Mahsulot nomi:</b> ${product.name}\n<b>💰Narxi:</b> ${price} so'm\n<b>🔢Mahsulot soni:</b> ${emaunt}\n<b>👨Buyutmachi:</b> ${name}\n<b>☎️Tel:</b> ${tel}\n`,
                            parse_mode: 'HTML'
                        });
                    });
            });
    } else {
        // ReferralId yo'q bo'lsa, null bo'lib yuboriladi
        const order = new Order({
            orderNumber,
            marketId,
            referralId: null,
            productId: id,
            promo,
            productAmount: emaunt,
            price,
            name,
            phone: tel,
            sellerId: "Sotuvchisi yo`q bo`lgan mahsulot"
        });

        order.save((err, data) => {
            if (err) {
                console.error(err); // Xatolikni konsolga chiqarish
                return res.status(500).json({
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

                // Media group yaratish
                let media_group = [];
                media_group.push({
                    type: 'photo',
                    media: product.photo.data,
                    caption: `<b>Buyurtma raqami ${orderNumber}</b>\n\n<b>🧾Mahsulot nomi:</b> ${product.name}\n<b>💰Narxi:</b> ${price} so'm\n<b>🔢Mahsulot soni:</b> ${emaunt}\n<b>👨Buyutmachi:</b> ${name}\n<b>☎️Tel:</b> ${tel}\n`,
                    parse_mode: 'HTML'
                });
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
exports.listByDateRange = (req, res) => {
    const { startDate, endDate } = req.query;
    let start = new Date(startDate);
    let end = new Date(endDate);

    // Agar startDate va endDate bir xil bo'lsa
    if (start.toDateString() === end.toDateString()) {
        // End vaqtini 23:59:59 ga o'zgartirish (shu kunning oxirigacha qamrab oladi)
        end.setHours(23, 59, 59, 999);
    }

    Order.find({
        createdAt: {
            $gte: start,
            $lte: end
        }
    })
        .sort('-createdAt')
        .populate('productId', 'name')
        .populate('marketId', 'name')
        .exec((err, orders) => {
            if (err) {
                // Xatolik bo'lsa, darhol qaytish
                return res.status(500).json({
                    error: 'Buyurtmalarni olishda xatolik'
                });
            }
            // Agar xato bo'lmasa, muvaffaqiyatli javobni qaytarish
            return res.json(orders);
        });
};

exports.updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, myname, myId, region, comment } = req.body;
        

        // Operator yoki Userni topish
        let operatorOrUser = await Operator.findById(myId).exec();
        if (!operatorOrUser) {
            operatorOrUser = await User.findById(myId).exec();
        }

        if (!operatorOrUser) {
            return res.json({ error: 'Operator yoki User topilmadi' });
        }
        const order = await Order.findById(id).exec();
        if (!order) return res.json({ error: 'Buyurtma topilmadi' });

        const product = await Product.findById(order.productId).exec();
        if (!product) {
            console.log("Warning: Mahsulot topilmadi");
        } else if (status === 'Bekor qilindi') {
            product.quantity += order.productAmount;
            product.sold -= order.productAmount;
            if (order.referralId) {
                const referral = await Referral.findById(order.referralId).exec();
                if (!referral) return res.json({ error: 'Referral topilmadi' });

                referral.canceled += order.productAmount;
                await referral.save();
            }
            
            if (order.paidOperator === "Tolandi") {
                operatorOrUser.balance = String(Number(operatorOrUser.balance) - Number(product.operatorPrice*order.productAmount));
                order.paidOperator = "Yoq";
                await operatorOrUser.save();
                await order.save();
            }

            if (order.paidOperator === "Holding") {
                operatorOrUser.holdingBalance = String(Number(operatorOrUser.holdingBalance) - Number(product.operatorPrice*order.productAmount));
                order.paidOperator = "Yoq";
                await operatorOrUser.save();
                await order.save();
            }
            if (order.referralId) {
                const referral = await Referral.findById(order.referralId).exec();
                const seller = await Seller.findById(referral.seller).exec();
                if (seller) {
                    if (order.paid === "Tolandi") {
                        seller.balance = String(Number(seller.balance) - Number(product.sellPrice*order.productAmount));
                        await seller.save();
                    }
        
                    if (order.paid === "Holding") {
                        seller.holdingBalance = String(Number(seller.holdingBalance) - Number(product.sellPrice*order.productAmount));
                        await seller.save();
                    }
                }
                order.paid = "Yoq";
            }
            await product.save();
        }

        if (status === 'Buyurtma qabul qilindi') {
            order.operator = myname;
            order.region = region;

            const referral = await Referral.findById(order.referralId).exec();
            if (order.referralId && referral) {
                referral.confirmed += order.productAmount;
                await referral.save();
            }

            if (order.paid === "Yoq") {
                if (referral) {
                    const seller = await Seller.findById(referral.seller).exec();
                    if (seller) {
                        seller.holdingBalance = String(Number(seller.holdingBalance) + Number(product.sellPrice*order.productAmount));
                        await seller.save();
                    }
                }

                operatorOrUser.holdingBalance = String(Number(operatorOrUser.holdingBalance || 0) + Number(product.operatorPrice*order.productAmount));
                await operatorOrUser.save();
                order.paid = "Holding";
                order.paidOperator = "Holding";
                await order.save();
            }
        }

        if (status === 'To\'landi' && order.paidOperator === "Holding") {
            operatorOrUser.holdingBalance = String(Number(operatorOrUser.holdingBalance) - Number(product.operatorPrice*order.productAmount));
            operatorOrUser.balance = String(Number(operatorOrUser.balance) + Number(product.operatorPrice*order.productAmount));
            order.paidOperator = "Tolandi";
            await operatorOrUser.save();
            await order.save();
        }

        if (order.referralId) {
            const referral = await Referral.findById(order.referralId).exec();
            if (!referral) return res.json({ error: 'Referral topilmadi' });

            if (status === 'To\'landi') {
                referral.sold += order.productAmount;
                await referral.save();

                const seller = await Seller.findById(referral.seller).exec();
                if (seller && seller.holdingBalance >= 1) {
                    seller.balance = String(Number(seller.balance) + Number(product.sellPrice * order.productAmount));
                    seller.holdingBalance = String(Number(seller.holdingBalance) - Number(product.sellPrice * order.productAmount));
                    seller.soldProduct = String(Number(seller.soldProduct) + Number(order.productAmount));
                    await seller.save();
                }
                order.paid = "Tolandi";
                await order.save();
            }
        }
        order.comment = comment || " ";
        order.status = status;
        const data = await order.save();
        res.json(data);

    } catch (err) {
        console.log("Xatolik yuz berdi: ", err);
        res.json({ error: 'error9000', message: err.message });
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