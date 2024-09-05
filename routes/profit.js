const express = require('express');
const router = express.Router();
const { updateProfitStatus } = require('../controllers/profit');

const { requireSignin, isAuth, isAdmin } = require('../controllers/auth');

const { profitById, read, update, list, remove, create, updateProfit, profitBySellerId, getAllProfits, gettoken } = require('../controllers/profit');
const { sellerById } = require('../controllers/seller');
const { userById } = require('../controllers/user');

router.get('/profit-by-user/:sellerId', profitBySellerId); 
router.get('/profit/:referralId', read);
router.post('/profit/create/:sellerId', requireSignin, isAuth, create);
router.put('/profit/:profitId/:userId', requireSignin, isAuth, isAdmin, update);
router.delete('/profit/:profitId/:userId', requireSignin, isAuth, isAdmin, remove);
router.get('/profits', list, updateProfit, getAllProfits);
router.put('/profit/status/:profitId', requireSignin, isAuth, updateProfitStatus);
router.param('sellerId', sellerById);
router.put('/profit/:profitId/status', requireSignin, isAuth, isAdmin, updateProfitStatus);
router.get('/gettoken', gettoken);
router.param('userId', userById);
router.param('profitId', profitById);
router.put('/updateProfit/:prId', requireSignin, isAuth, isAdmin, (req, res) => {
    const { prId } = req.params;
    const { status } = req.body; // Yangi status qiymatini oling
    
    // Profit obyektini prId orqali qidiring va statusini yangilang
    Profit.findByIdAndUpdate(prId, { status }, { new: true }, (err, updatedProfit) => {
        if (err || !updatedProfit) {
            return res.status(400).json({ error: 'Error updating profit' });
        }
        res.json(updatedProfit);
    });
});
module.exports = router;