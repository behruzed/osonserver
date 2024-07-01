const express = require('express');
const router = express.Router();

const { create, marketById, read, update, remove, list } = require('../controllers/market');
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth');
const { userById } = require('../controllers/user');

router.get('/market/:marketId', read);
router.post('/market/create/:userId', requireSignin, isAuth, isAdmin, create);
router.put('/market/:marketId/:userId', requireSignin, isAuth, isAdmin, update);
router.delete('/market/:marketId/:userId', requireSignin, isAuth, isAdmin, remove);
router.get('/markets', list);

router.param('marketId', marketById);
router.param('userId', userById);

module.exports = router;