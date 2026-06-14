
const express = require('express');
// named routing
const { createUserDetails , loginUserDetails} = require('../controllers/userController');    
const router = express.Router();
// router is an object
router.route('/adduser').post(createUserDetails);
router.route('/loginuser').post(loginUserDetails);

module.exports = router;
