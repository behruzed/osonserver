const express = require('express');
const router = express.Router();

const { sellerById } = require('../controllers/seller');
const { getInvitesBySellerWithUserInfo } = require('../controllers/invites');
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth');
const { userById } = require('../controllers/user');

// sellerId asosida invites va user ma'lumotlarini olish uchun
router.get('/invites/:sellerId', getInvitesBySellerWithUserInfo);

router.param('userId', userById);
router.param('sellerId', sellerById);

module.exports = router;