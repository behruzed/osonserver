const Product = require('../models/product');
const TelegramBot = require('node-telegram-bot-api')
const Token = process.env.TOKEN

const bot = new TelegramBot(Token, {
    polling: true
})

bot.on('message', msg => {
    const chatId = msg.chat.id
    const text = msg.text
    bot.sendMessage(chatId, text)
})

let orderNumber = 1

exports.order = (req, res) => {
    const {id} = req.params
    const {emaunt, price, name, tel} = req.body
    Product.findById(id).exec((err, product) => {
        if (err || !product) {
            return res.status(400).json({
                error: 'product not found'
            });
        } 
        if (product) {
            product.sold = product.sold + emaunt;
            product.save(function(err) {
                if(err) {
                    console.log("Error: could not save contact " + product.sold);
                }
            });
            const media_group = []
            media_group.push({
                type: 'photo',
                media: product.photo.data,
                caption: `<b>Buyurtma raqami ${orderNumber}</b>\n\n<b>🧾Mahsulot nomi:</b> ${product.name}\n<b>💰Narxi:</b> ${price} so'm\n<b>🔢Mahsulot soni:</b> ${emaunt}\n<b>👨Buyutmachi:</b> ${name}\n<b>☎️Tel:</b> ${tel}\n`,
                parse_mode: 'HTML'
            })
            bot.sendMediaGroup(-1001834215405, media_group)
            orderNumber ++
            res.status(200).json({message: 'ok'})
        }
    });
};