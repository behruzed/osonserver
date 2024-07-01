const express = require('express');
const router = express.Router();

const { requireSignin, isAuth, isAdmin } = require('../controllers/auth');

const { profitById, read, update, list, remove, create, profitBySellerId } = require('../controllers/profit');
const { sellerById } = require('../controllers/seller');
const { userById } = require('../controllers/user');

router.get('/profit-by-user/:sellerId', profitBySellerId); 
router.get('/profit/:referralId', read);
router.post('/profit/create/:sellerId', requireSignin, isAuth, create);
router.put('/profit/:profitId/:userId', requireSignin, isAuth, isAdmin, update);
router.delete('/profit/:profitId/:userId', requireSignin, isAuth, isAdmin, remove);
router.get('/profits', list);

router.param('sellerId', sellerById);
router.param('userId', userById);
router.param('profitId', profitById);

module.exports = router;