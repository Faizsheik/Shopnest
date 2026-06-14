// default routing
const productModel = require('../models/productModel');

// -- All products and fetch products based on category and subcategory
exports.getProducts = async (req,res,next) => 
{

        try
        {
            //    let query =  req.query.keyword?{name:{
            //         $regex: req.query.keyword,
            //          $options: 'i' 
            //     }}:{}

            const { category, subCategory } = req.query;
            let filter = {};
            if (category && subCategory) {
                filter.categoryId = category;
                filter.subCategoryId = subCategory;
            }
            const products = await productModel.find(filter);

            // no products in the database
            if (!products || products.length === 0) 
            {
                return res.status(404).json({
                    success: false,
                    message: "No products found."
                });
            }

            //id products are found
            return res.status(200).json({
            success: true,
            count: products.length, 
            products
        });

            
        }
        catch(error)
        {
            return res.status(500).json({
            success: false,
            message: "Internal Server Error. Failed to fetch products."
            });

        } 

}

//Get single product API - api/v1/product/:id
exports.getSingleProduct = async (req,res,next) => 
{
   try
   {
        const product = await productModel.findById(req.params.id);
        if (!product) 
        {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found.'
                });
            }

            // product is found
            return res.status(200).json({
                success: true,
                product
        });
    
   }
   catch(error) 
   {
     res.status(404).json({
        success: false,
        message: 'unable to get the product due to server error'
    })
   }
   
}


// -- add product by admin --
exports.addProduct = async (req,res,next) =>
{
    try
    {
        const newItem = new productModel(req.body);
        await newItem.save();
        res.json({
            success: true,
        })
         
    }
    catch(error)
    {
        res.status(404).json({
            success: false,
            message: 'unable to add the product'
        })
    }
}

// -- delete product by admin --
exports.deleteProduct = async (req,res,next) =>
{
    try
    {
                const { productId } = req.params;
                const product = await productModel.findById(productId);
        
                if(!product)
                {
                    return res.status(404).json({
                        sucess: false,
                        message: 'product not found'
                    })
                }
                await productModel.findByIdAndDelete(productId);
        
                res.status(200).json({
                    success: true,
                    message: 'product deleted'
                })
         
    }
    catch(error)
    {
        res.status(404).json({
            success: false,
            message: 'unable to delete the product due to server error'
        })
    }
}



