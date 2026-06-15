const crypto = require("crypto");
const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");        
const ProductModel = require("../models/productModel");
const sendEmail = require("../utils/sendEmails");   

exports.verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, dbOrderId } = req.body;

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET) 
            .update(sign.toString())
            .digest("hex");

        const isAuthentic = expectedSign === razorpay_signature;

        if (!isAuthentic) {
            return res.status(400).json({
                success: false,
                message: "Invalid signature! Transaction might be tampered"
            });
        }

        const order = await Order.findById(dbOrderId).populate("user", "username email");

        if (!order) 
        {
            return res.status(404).json({
                success: false,
                message: "Order not found in the database"
            });
        }

        order.paymentInfo = { id: razorpay_payment_id, status: "Paid" };
        order.orderStatus = "processing...";
        await order.save();

        if (order.orderItems && order.orderItems.length > 0) {
            for (const item of order.orderItems) {
                const prodId = item.productId && typeof item.productId === 'object' 
                    ? item.productId._id 
                    : item.productId;

                await ProductModel.findByIdAndUpdate(
                    prodId,
                    { $inc: { stock: -(item.quantity || 1) } },
                    { runValidators: true }
                );
            }
        }

        try 
        {
            if (req.user && req.user.id) 
            {
                await Cart.findOneAndUpdate({ userId: req.user.id }, { items: [] });
            }

            if (order.user && order.user.email) {
                const shortOrderId = `ORD-${order._id.toString().slice(-6).toUpperCase()}`;

                await sendEmail({
                    email: order.user.email, 
                    subject: "Order Placed Successfully",
                    message: `Hello ${order.user.username || "Customer"},\n\nYour order has been placed successfully.\nOrder ID: ${shortOrderId}\nTotal Amount: ₹${order.totalPrice}\n\nThank you for shopping with us.`
                });
            }
        } 
        catch (bgError) 
        {
            console.error("Background task error (Cart/Email failed, but payment succeeded):", bgError.message);
        }

        return res.status(200).json({
            success: true,
            message: "Payment verified and processed successfully",
        });

    } 
    catch (error) 
    {
        console.error("Verification logic structural crash error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error occurred during signature authorization processing."
        });
    }
};