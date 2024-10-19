// controllers/invites.js
const Invites = require('../models/invites');
const Seller = require('../models/seller'); // Seller modelini import qilish
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.getInvitesBySellerWithUserInfo = (req, res) => {
    const sellerId = req.params.sellerId;
    
    Invites.find({ ownerId: sellerId }).exec((err, invites) => {
        if (err || !invites) {
            return res.status(400).json({ error: 'No invites found for this seller' });
        }

        // Har bir invite uchun userId orqali Seller ma'lumotlarini olish
        const invitesWithUser = invites.map((invite) => {
            return Seller.findById(invite.userId).then((seller) => {
                return {
                    ...invite._doc, // invite ma'lumotlarini olish uchun _doc ishlatiladi
                    user: seller ? seller : null // Agar seller topilsa qo'shish, aks holda null
                };
            });
        });

        // Promise.all bilan barcha querylarni kutib, keyin natijalarni jo'natish
        Promise.all(invitesWithUser).then((results) => {
            res.json(results); // Barcha natijalarni JSON formatda jo'natish
        }).catch((err) => {
            return res.status(400).json({ error: errorHandler(err) });
        });
    });
};