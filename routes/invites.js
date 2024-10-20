const express = require('express');
const router = express.Router();

const { sellerById } = require('../controllers/seller');
const { getInvitesBySellerWithUserInfo, updateInvite } = require('../controllers/invites');
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth');
const { userById } = require('../controllers/user');

router.get('/invites/:sellerId', getInvitesBySellerWithUserInfo);
router.put("/invites/update/:inviteId", updateInvite);

router.param('userId', userById);
router.param('sellerId', sellerById);

module.exports = router;