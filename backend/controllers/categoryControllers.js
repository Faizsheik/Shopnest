// default routing
const categoryModel = require('../models/categoryModel');
const subCategoryModel = require('../models/subCategoryModel');
const productModel = require('../models/productModel')


exports.addCategory = async (req,res,next) =>
{
    try
    {
        const newItem = new categoryModel(req.body);
        
        await newItem.save();
        res.json({
            success: true,
        })
         
    }
    catch(error)
    {
        res.status(404).json({
            success: false,
            message: 'unable to add the category item'
        })
    }
}

exports.deleteCategory = async (req,res) =>
{
    try
    {
        //const categoryId = req.params.categoryId;
        const { categoryId } = req.params;
        const category = await categoryModel.findById(categoryId);
        console.log("backend categort need to delete",category)

        if(!category)
        {
            return res.status(404).json({
                sucess: false,
                message: 'Category not found'
            })
        }

        await subCategoryModel.deleteMany({
            categoryId: categoryId
        })

        await categoryModel.findByIdAndDelete(categoryId);

        res.status(200).json({
            success: true,
            message: 'Category and its sub category are deleted'
        })
         
    }
    catch(error)
    {
        res.status(404).json({
            success: false,
            message: 'unable to delete the category item'
        })
    }
}

exports.deleteSubCategory = async (req,res) =>
{
    try
    {
        //const categoryId = req.params.categoryId;
        const { subCategoryId } = req.params;
        const subcategory = await subCategoryModel.findById(subCategoryId);

        if(!subcategory)
        {
            return res.status(404).json({
                sucess: false,
                message: 'Sub Category not found'
            })
        }

        await productModel.deleteMany({
            subCategoryId: subCategoryId
        })

        await subCategoryModel.findByIdAndDelete(subCategoryId);

        res.status(200).json({
            success: true,
            message: 'SubCategory and its related products are deleted'
        })
         
    }
    catch(error)
    {
        res.status(404).json({
            success: false,
            message: 'unable to delete the subcategory item'
        })
    }
}

exports.addSubCategory = async (req,res) =>
{
    try
    {
        const newItem = new subCategoryModel(req.body);
        await newItem.save();
        res.json({
            success: true,
        })
         
    }
    catch(error)
    {
        res.status(404).json({
            success: false,
            message: 'unable to add the sub category'
        })
    }
}

// -- get category items  --
exports.getCategoryItems = async(req,res) =>{
    try
    {
        const categoryItems = await categoryModel.find();

        // -- check if category exists
        if (!categoryItems || categoryItems.length === 0) 
        {
            return res.status(404).json({
                success: false,
                message: 'No category items found.'
            });
        }

        // -- categories found
        return res.status(200).json({
            success: true,
            count: categoryItems.length,
            categoryItems
        });

    }
    catch(error)
    {
        res.status(404).json({
            success: false,
            message: 'unable to fetch the category items'
        })
    }
}


exports.getSubCategoryItems = async(req,res) =>{
    try{

        const { categoryId } = req.params;
        const subCategoryItems = await subCategoryModel.find({categoryId: categoryId});

        //-- sub category found
        if (!subCategoryItems || subCategoryItems.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No subcategories found for this category.'
            });
        }

        // 2. Success response
        return res.status(200).json({
            success: true,
            count: subCategoryItems.length,
            subCategoryItems
        });


    }
    catch(error)
    {
        console.error("Error fetching subcategories:", error.message);
        return res.status(500).json({
            success: false,
            message: 'Unable to fetch the subcategory items due to a server error.'
        });
    }
}


