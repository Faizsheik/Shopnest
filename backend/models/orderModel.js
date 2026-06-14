const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      required: true
    },

    shippingInfo: {
      fullName: String,
      phoneNo: String,
      address: String,
      city: String,
      postalCode: String,
      state: String,
      country: String
    },

    orderItems: [
      {
        productId: {
          type: mongoose.Schema.ObjectId,
          ref: "product"
        },
        name: String,
        quantity: Number,
        price: Number
      }
    ],

    paymentMethod: {
      type: String,
      default: "Razorpay"
    },

    paymentInfo: {
        id: { type: String },
        status: { type: String, default: "Pending" }
      },

    itemsPrice: Number,
    taxPrice: Number,
    shippingPrice: Number,
    totalPrice: Number,

    orderStatus: {
      type: String,
      default: "Processing"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("order", orderSchema);
