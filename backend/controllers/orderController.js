
const Order = require('../models/orderModel')
const Cart = require('../models/cartModel');
const Razorpay = require('razorpay');
const sendEmail = require("../utils/sendEmails");
const User = require("../models/userModel")

// -- Initialize Razorpay with the test keys --
const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,

});

//  --create Order - api/v1/order --
exports.createOrder = async (req, res, next) => {
    try {
        const {
            shippingInfo,
            orderItems,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice
        } = req.body;

        // Tell Razorpay to create the Razorpay Order instance
        const razorpayOrder = await razorpayInstance.orders.create({
            amount: Math.round(totalPrice * 100),
            currency: "INR",
            receipt: `receipt_order_${Date.now()}`
        });


        // Save the order to MongoDB with "Pending status"
        const order = await Order.create({
            user: req.user.id,
            shippingInfo,
            orderItems,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            paymentInfo: {
                id: razorpayOrder.id,
                status: "Pending"
            }
        });

            res.status(201).json({
            success: true,
            razorpayOrderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            dbOrderId: order._id
        });


    } catch (error) {
        // Prevent catch-block execution from throwing header errors if initial response succeeded
        if (!res.headersSent) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        } else 
        {
            console.error("Error after headers sent:", error.message);
            //Have we already responded to the user? If no, send them the error. If yes, stay quiet and just log the error in our private terminal."

            //The code is written this way as a bulletproof shield. 
            // Even if you think nothing happens after your success response, Node.js is asynchronous.
            //  If any background task, database disconnection, or third-party API fails a split second
            //  after the order is completed, this logic guarantees 
            // your server logs the issue safely instead of completely crashing.
        }
    }
};




//  -- get order details  --
exports.getOrderDetails = async (req, res, next) => {
    try 
    {
        const orders = await Order.find({
            user: req.user.id

        })
        // Ensure path targets 'productId' exactly as declared in the Order Schema
            .populate('orderItems.productId') // Try populating the whole object first
            .sort({ createdAt: -1 });

        // DEBUG LOG: Look at your backend terminal!
        console.log("POPULATED ORDERS DATA:", JSON.stringify(orders[0], null, 2));

        res.status(200).json({
            success: true,
            count: orders.length,
            orders
        })
        

    } catch (error) 
    {
        if (!res.headersSent) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        } else {
            console.error("Error after headers sent:", error.message);
        }
        
    }
};


//  -- view all orders [Admin]
exports.getAllOrders = async (req, res) => 
{
    try {
        
        const orders = await Order.find()
            .populate("user", "username email") 
            .populate("orderItems.productId", "name price images stock")
            .sort({ createdAt: -1 });
        
        // --- Check if orders exist ---
        if (!orders || orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No order history found."
            });
        }

        // -- orders found -- 
        return res.status(200).json({
            success: true,
            count: orders.length,
            orders
        });

    } 
    catch (error) 
    {
        console.error("Error in getAllOrders backend logic:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error occurred while retrieving order history lines."
        });
    }
};


// -- Number of orders places for each products -- 
exports.getProductSalesCount = async (req, res) => {
    try 
    {
        const productId = req.params.id;

        // Find all orders containing this productId in their orderItems array
        const totalOrdersCount = await Order.countDocuments({
            "orderItems.productId": productId,
            "paymentInfo.status": "Paid"
        });

        res.status(200).json({
            success: true,
            count: totalOrdersCount
        });

    } catch (error) 
    {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
