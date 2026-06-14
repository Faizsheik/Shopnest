import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function OrderSummary({ cartItems }) {

  const navigate = useNavigate();
  const[loading,setLoading]=useState(false);

    const shippingInfo = JSON.parse(
      localStorage.getItem("shippingInfo")
    );

  const subtotal = cartItems.reduce((acc,item)=>acc+item.quantity * item.price,0);
  const shippingCharge = subtotal > 500 ? 0: 50;
  let tax = Math.round(subtotal*0.18);
  const totalPrice = Number((subtotal+shippingCharge+tax).toFixed(2));

  async function proceedToPayment()
  {
    setLoading(true);
     try
     {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/order`,
        {
          method:"POST",
          headers: {
            "Content-Type":"application/json",
             Authorization: `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify({
          shippingInfo,
          orderItems: cartItems,
          itemsPrice: subtotal,
          taxPrice: tax,
          shippingPrice: shippingCharge,
          totalPrice
        })
        }
      );
      const data = await res.json();
    

      //Without throw new Error(data.message), if your backend encountered a bug and sent a 500 failure message, 
      // your frontend would ignore the failure, try to read missing checkout data, and attempt to navigate the 
      // user to the /payment page anyway, causing the frontend UI to break or freeze.
      //pass keys over to React Router state of your payment page
      if (res.ok) 
      {
        navigate("/payment", {
          state: {
            razorpayOrderId: data.razorpayOrderId,
            amount: data.amount,
            dbOrderId: data.dbOrderId
          }
        });
      } 
      else 
      {
        console.error(data.message || "Failed to process checkout order initialization");
      }


     }
     catch(error)
     {
        console.error("Error connecting to server:", error);
     }
     finally{
      setLoading(false);
     }

  }
  
  return (
    <div className="container d-flex justify-content-center align-items-left min-vh-100 py-5">
      <div
        className="card p-4 shadow-sm w-100"
        style={{
          maxWidth: "700px",
          borderRadius: "12px",
          background: "#ffffff",
          border: "1px solid #e6e6e6",
          boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
        }}
      >

        <h2 className="text-center mb-4">Order Summary</h2>
        <hr/>

        <div style={{ textAlign: "left" }}>
            <h5 className="mb-3" style={{textAlign:"center"}}>Shipping Info</h5>
            <p><b>Name:</b> {shippingInfo.fullName}</p>
            <p><b>Phone:</b> {shippingInfo.phoneNo}</p>
            <p>
            <b>Address:</b> {shippingInfo.address}, {shippingInfo.city},{" "}
            {shippingInfo.state}, {shippingInfo.country} -{" "}
            {shippingInfo.postalCode}
            </p>
        </div>

        <hr />

        <h5 className="mb-3">Cart Items</h5>

        {cartItems.map((item) => (
          <div
                    key={item.productId._id}
                    className="d-flex justify-content-between mb-3">
                    <div style={{ textAlign: "left" }}>
                        <p className="mb-0">{item.productId.name}</p>
                       <small style={{ display: "block" }}>
                            {item.quantity} x ₹{item.price}
                        </small>
                    </div>

                    <div>
                    ₹{item.quantity * item.price}
                    </div>
          </div>
        ))}

        <hr />

        <div className="d-flex justify-content-between">
          <span>Subtotal:</span>
          <span>₹{subtotal}</span>
        </div>

        <div className="d-flex justify-content-between">
          <span>Shipping:</span>
          <span>₹{shippingCharge}</span>
        </div>

        <div className="d-flex justify-content-between">
          <span>Tax:</span>
          <span>₹{tax}</span>
        </div>

        <hr />

        <div className="d-flex justify-content-between fw-bold fs-5">
          <span>Total:</span>
          <span>₹{totalPrice}</span>
        </div>

        <button
          onClick={proceedToPayment}
          className="form-control mt-4"
          style={{ backgroundColor: "#febd69" }}
        >
          {loading ? "Processing..." : "Proceed to Payment"}
        </button>
      </div>
    </div>
  );
}