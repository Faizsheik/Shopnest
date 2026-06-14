
const express = require('express');
const router = express.Router();
const {authMiddleware,isAdmin} = require('../middleware/authMiddleware');
const {createOrder,getOrderDetails,getProductSalesCount,getAllOrders} = require('../controllers/orderController');
//router.route('/order').post(createOrder);
router.post('/order',authMiddleware, createOrder);
router.get('/getorderdetails',authMiddleware, getOrderDetails);
router.get('/getProductSalesCount/:id',getProductSalesCount);
router.get('/getallorders',authMiddleware,isAdmin,getAllOrders);



// request handler
module.exports = router;