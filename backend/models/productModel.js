
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    price:Number,
    description: String,
    ratings: Number,
    images : [
        {
            image: String
        }
    ],
    categoryId :{
            type: mongoose.Schema.Types.ObjectId,
            ref:'category',
            required: true,
            
        },
    subCategoryId :{
            type: mongoose.Schema.Types.ObjectId,
            ref:'subcategory',
            required: true,
            
        },
    seller: String,
    stock: {
        min: [0, "Stock cannot be less than 0"],
    },
    numOfReviews: Number,
    createdAt: {
        type: Date,
        default: Date.now // Automatically sets the date if frontend leaves it blank
    }
});

const productModel = mongoose.model('product',productSchema); 
// product is our variable
module.exports = productModel;