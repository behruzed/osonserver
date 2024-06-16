const express = require('express');
const router = express.Router();

const { requireSignin, isAuth, isAdmin } = require('../controllers/auth');

const { sellerById, read, update, list } = require('../controllers/seller');

router.get('/secret/:seller', requireSignin, isAuth, isAdmin, (req, res) => {
    res.json({ seller: req.profile });
});

router.get('/seller/:sellerId', requireSignin, isAuth, read);
router.put('/seller/:sellerId', requireSignin, isAuth, update);
router.get('/sellers', list);

router.param('sellerId', sellerById);

module.exports = router;