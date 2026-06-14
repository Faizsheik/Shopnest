
const mongoose = require('mongoose');
const productReviewSchema = new mongoose.Schema({
 
    userId :{
        type: mongoose.Schema.Types.ObjectId,
        ref:'user',
        required: true,
        
       
    },
    productId:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref:'product',
        required: true,
        

    },
    rating:{
        type: Number,
        required: true,
        min: 1,
        max: 5
        
    },
    title: {
        type: String,
       
    },
    description: {
        type: String,
        required:true
    },

    image:{
        type: String,
        
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
    

})
productReviewSchema.index({ userId: 1, productId: 1 }, { unique: true });

const productReviewModel = mongoose.model('productreview',productReviewSchema);
module.exports = productReviewModel;