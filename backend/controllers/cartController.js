

const   Cart = require('../models/cartModel')  //any variable you can use for extracting model name
const User = require('../models/userModel');
const Product = require('../models/productModel');

// -- Add item to cart
exports.addToCart = async(req,res)=>
{
    try
    {
        const userId = req.user.id;
        const {productId,quantity,price} = req.body;

        // -- create user's cart
        let cart = await Cart.findOne({userId});
        if(!cart)
        {
            cart = await Cart.create({
                userId,
                items:[]
            })
        }

        // -- check if already item exists in the cart array
        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
         
        if(itemIndex > -1)
        {
            cart.items[itemIndex].quantity += quantity;
        }
        else
        {
            cart.items.push({productId,quantity,price});
        }
        await cart.save();

        res.status(200).json({
            success: true,
            message: "Item added to cart",
            cart
        });
    }
    catch(error)
    {
        console.error("Error adding to cart:", error.message);
        return res.status(500).json({
            success: false,
            message: "Server error. Unable to add item to cart."
        });
    }
}

//fetch cart details
exports.getCartDetails = async (req , res, next) =>
{
   
    try
    {

        const userId = req.user.id;//Extract from JWT
        let cart = await Cart.findOne({userId}).populate('items.productId');

        // -- Return 404 if no cart exists for the user --
        if (!cart || cart.items.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Your cart is currently empty."
            });
        }
        
        return res.status(200).json({
            success: true,
            cart
        });

    }
    catch(error)
    {
        console.error("Error getting cart details:", error.message);
        return res.status(500).json({
            success: false,
            message: "Server error. Unable to retrieve cart items."
        });
    }
}


//delete cartItems
exports.deleteCartItem = async (req , res, next) =>
{
            try 
            {
                const userId = req.user.id; // from auth middleware
                const { productId } = req.body;

                const cart = await Cart.findOneAndUpdate(
                { userId: userId },
                {
                    $pull: {
                    items: { productId: productId }
                    }
                },
                { new: true }
                );


                if (!cart) {
                    return res.status(404).json({
                        success: false,
                        message: "Cart not found."
                    });
                }

                return res.status(200).json({
                    success: true,
                    message: "Item removed from cart.",
                    items: cart.items
                });
            } 
            catch (error) 
            {
                console.error("Error deleting cart item:", error.message);
                return res.status(500).json({
                    success: false,
                    message: "Server error. Unable to delete cart item."
                });
            }
}


