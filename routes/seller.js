const express = require('express');
const router = express.Router();

const { requireSignin, isAuth, isAdmin } = require('../controllers/auth');

const { sellerById, read, update, list, remove, create } = require('../controllers/seller');
const { userById } = require('../controllers/user');

router.get('/secret/:seller', requireSignin, isAuth, isAdmin, (req, res) => {
    res.json({ seller: req.profile });
});

router.get('/seller/:sellerId', read);
router.post('/seller/create/:userId', requireSignin, isAuth, isAdmin, create);
router.put('/seller/:sellerId', requireSignin, isAuth, update);
router.delete('/seller/:sellerId/:userId', requireSignin, isAuth, isAdmin, remove);
router.get('/sellers', list);

router.param('sellerId', sellerById);
router.param('userId', userById);


module.exports = router;