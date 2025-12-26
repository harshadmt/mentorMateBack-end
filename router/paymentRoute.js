const express = require('express');
const {createOrder,verifyAndUnlock} = require('../controller/paymentController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.post ('/create-order',protect,createOrder);
router.post('/verify-payment',protect,verifyAndUnlock);


module.exports = router