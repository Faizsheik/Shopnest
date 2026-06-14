
const mongoose = require('mongoose');


const cartItemSchema = new mongoose.Schema({
 

    userId :{
        type: mongoose.Schema.Types.ObjectId,
        ref:'user',
        required: true,
        unique: true
    },

    items:[
        {
            productId:{
                type: mongoose.Schema.Types.ObjectId,
                ref:'product',
                required:true

            },

            quantity:{
                type: Number,
                default:1,
                
            },
            price:{
                type: Number,

            }
      }
    ],

    totalAmount:{
        type: String,  
        //default: 0
    },
    

},{timestamps:true})

const cartItemsModel = mongoose.model('cartItems',cartItemSchema);
module.exports = cartItemsModel;