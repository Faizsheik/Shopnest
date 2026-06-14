

const express = require('express');
const router = express.Router();

const {authMiddleware} = require('../middleware/authMiddleware');
const {createProductReview} = require('../controllers/reviewController');

router.post('/createproductreview/:id', authMiddleware,createProductReview);
module.exports = router;