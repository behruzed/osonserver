const Invites = require('../models/invites');
const Seller = require('../models/seller');
const { errorHandler } = require('../helpers/dbErrorHandler');
const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);


exports.getInvitesBySellerWithUserInfo = (req, res) => {
    const sellerId = req.params.sellerId;
    
    Invites.find({ ownerId: sellerId }).exec((err, invites) => {
        if (err || !invites) {
            return res.status(400).json({ error: 'No invites found for this seller' });
        }
        const invitesWithUser = invites.map((invite) => {
            return Seller.findById(invite.userId).then((seller) => {
                return {
                    ...invite._doc,
                    user: seller ? seller : null
                };
            });
        });
        Promise.all(invitesWithUser).then((results) => {
            res.json(results);
        }).catch((err) => {
            return res.status(400).json({ error: errorHandler(err) });
        });
    });
};
exports.updateInvite = async (req, res) => {
    const { amount, paid, inviteCount } = req.body;
    
    const ownerId = req.body.ownerId;
    

    try {
        const updatedInvite = await Invites.findByIdAndUpdate(
            req.params.inviteId,
            { $set: { amount, paid } },
            { new: true }
        );

        if (!updatedInvite) {
            return res.status(400).json({ error: "Invite yangilanmadi" });
        }

        const owner = await Seller.findById(ownerId);
        if (!owner) {            
            return res.status(400).json({ error: "Owner topilmadi" });
        }

        owner.balance = String(Number(owner.balance) + Number(amount*inviteCount));
        


        await owner.save();

        res.json({ updatedInvite, owner });
    } catch (err) {
        console.error("Xatolik yuz berdi:", err);
        return res.status(400).json({
            error: "Yangilashda xatolik yuz berdi",
        });
    }
};