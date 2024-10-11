const express = require("express");
const router = express.Router();

const { 
    create, list, updateStatus, remove, multipleOrders, metaOrder, listByDateRange
} = require("../controllers/order");
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth');
const { userById } = require('../controllers/user');

router.get('/orders', list); // Bu '/orders' yo'lida faqat list funksiyasini ishlatadi
router.get('/ordersByDate', listByDateRange); // Yangi yo'l orqali listByDateRange funksiyasini ishlatadirouter.post('/order/:id', create);
router.post('/meta-order', metaOrder)
router.post('/orders', multipleOrders);
router.put('/order/:id/:userId', requireSignin, isAuth, isAdmin, updateStatus);
router.delete('/order/:id/:userId', requireSignin, isAuth, isAdmin, remove);


router.param('userId', userById);

module.exports = router;