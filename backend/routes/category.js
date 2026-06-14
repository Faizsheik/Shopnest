
const express = require('express');
const {authMiddleware,isAdmin} = require('../middleware/authMiddleware');
const { addCategory , addSubCategory, getCategoryItems,getSubCategoryItems,deleteCategory,deleteSubCategory} = require('../controllers/categoryControllers');    
const router = express.Router();
router.route('/addcategory',authMiddleware,isAdmin).post(addCategory);
router.route('/addsubcategory',authMiddleware,isAdmin).post(addSubCategory);

router.route('/getcategoryitems',authMiddleware,isAdmin).get(getCategoryItems);
router.route('/getsubcategoryitems/:categoryId',authMiddleware,isAdmin).get(getSubCategoryItems);

router.route('/deletecategory/:categoryId',authMiddleware,isAdmin).delete(deleteCategory);
router.route('/deletesubcategory/:subCategoryId',authMiddleware,isAdmin).delete(deleteSubCategory);
module.exports = router;