
const express = require('express');
const router = express.Router();
const {authMiddleware} = require('../middleware/authMiddleware');

// named routing
const { getCartDetails , addToCart,deleteCartItem} = require('../controllers/cartController');    
// router is an object


router.post('/addToCart', authMiddleware, addToCart);
router.get('/getCartDetails', authMiddleware, getCartDetails);
router.delete('/deleteCartItem',authMiddleware, deleteCartItem);
module.exports = router;