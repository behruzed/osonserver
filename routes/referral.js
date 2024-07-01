const express = require('express');
const router = express.Router();

const { create, referralById, read, update, remove, list, getReferralsBySellerId } = require('../controllers/referral');
const { requireSignin, isAuth } = require('../controllers/auth');
const { sellerById } = require('../controllers/seller');

router.get('/referral-by-user/:sellerId', getReferralsBySellerId); 
router.get('/referral/:referralId', read);
router.post('/referral/create/:sellerId', requireSignin, isAuth, create);
router.put('/referral/:referralId/:sellerId', requireSignin, isAuth, update);
router.delete('/referral/:referralId/:sellerId', requireSignin, isAuth, remove);
router.get('/referrals', list);

router.param('referralId', referralById);
router.param('sellerId', sellerById);


module.exports = router;
// Compare this snippet from routes/user.js: