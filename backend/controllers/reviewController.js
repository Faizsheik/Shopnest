const reviewModel = require('../models/reviewModel')
const productModel = require('../models/productModel');

exports.createProductReview = async (req,res) =>
{

    try
    {
        const productId = req.params.id;
        const userid = req.user._id;
        const {rating,title,description,image} = req.body;

        const review = await reviewModel.findOneAndUpdate(
            { userId: userid, productId: productId }, 
            {
                userId: userid,
                productId: productId,
                rating: Number(rating),
                title,
                description,
                image
            },
            { upsert: true, new: true, runValidators: true } // Creates if missing, returns the fresh doc
        );

        const productReviews = await reviewModel.find({productId: productId});
        const numOfReviews = productReviews.length;
        const totalRatingSum = productReviews.reduce((acc, item) => item.rating + acc, 0);
        const averageRating = totalRatingSum / numOfReviews;

        const updatedProduct = await productModel.findByIdAndUpdate(
            productId,
            {
                ratings: averageRating,
                numOfReviews: numOfReviews
            },
            {new: true, runValidators: true}
        );


        return res.status(201).json({
            success: true,
            review,
            product: updatedProduct
        })


    }
    catch(error)
    {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }

}
