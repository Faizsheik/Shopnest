
const express = require('express');
const router = express.Router();
const {authMiddleware} = require('../middleware/authMiddleware');
const {verifyPayment} = require('../controllers/paymentController');
//router.route('/order').post(createOrder);
//router.post('/payment/verify',authMiddleware, verifyPayment);
router.route('/payment/verify').post(authMiddleware, verifyPayment);

// request handler
module.exports = router;