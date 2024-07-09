const express = require("express");
const router = express.Router();

const { 
    create, list, updateStatus, remove
} = require("../controllers/order");
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth');
const { userById } = require('../controllers/user');

router.get('/orders', list);
router.post('/order/:id', create);
router.put('/order/:id/:userId', requireSignin, isAuth, isAdmin, updateStatus);
router.delete('/order/:id/:userId', requireSignin, isAuth, isAdmin, remove);


router.param('userId', userById);

module.exports = router;