const express = require("express");
const router = express.Router();

const { 
    order
} = require("../controllers/order");

router.post('/order/:id', order);

module.exports = router;