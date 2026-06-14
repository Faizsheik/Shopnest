
const express = require('express');
const {authMiddleware,isAdmin} = require('../middleware/authMiddleware');
// named routing
const { getProducts , getSingleProduct,addProduct,deleteProduct } = require('../controllers/productControllers');    
const router = express.Router();
// router is an object
router.route('/products').get(getProducts);
router.route('/product/:id').get(getSingleProduct);
//router.route('/addProduct').post(addProduct);
router.post('/addProduct', authMiddleware, isAdmin, addProduct);
router.delete('/deleteProduct/:productId', authMiddleware, isAdmin, deleteProduct);
module.exports = router;