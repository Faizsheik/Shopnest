import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();

  const { razorpayOrderId, amount, dbOrderId } = location.state || {};

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const payNowHandler = async () => {
    const isScriptLoaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
    if (!isScriptLoaded) return alert("Razorpay SDK failed to load.");

    const options = {
      key: "rzp_test_Sx5k4kZlbdg530", // Injected your key from your dashboard view
      amount: amount,
      currency: "INR",
      name: "Shopnest",
      description: "Order Payment",
      order_id: razorpayOrderId,
      handler: async function (response) {
        try {
          const verifyData = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            dbOrderId: dbOrderId
          };

          const res = await fetch(`${process.env.REACT_APP_API_URL}/payment/verify`, {
            method: "POST",
            headers: {
            
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(verifyData)
          });



          const data = await res.json();  
          console.log("payyyyment",data);

          if (data.success) 
          {
              navigate("/success", { state: { dbOrderId: dbOrderId } });
          } 
          else
          {
            alert(data.message || "Payment verification failed!");
            //1. Razorpay Signature Mismatch (Most Common)
            //2. Orderid is missing in the database
            //3. The User is Logged Out / Session Expired
          }
        } 
        catch (err)
         {
          alert("Payment verification connection failed!");
        }
      },
      prefill: {
        name: "Customer Name",
        email: "customer@example.com"
      },
      theme: { color: "#febd69" }
    };

    // Kept inside the payNowHandler function block safely now!
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  }; // <-- Closes payNowHandler cleanly

  return (
    <div className="container text-center py-5" style={{ background: "#29456f", color: "#fff", minHeight: "100vh" }}>
      <h2>Complete Your Payment</h2>
      {amount && <p>Amount: ₹{amount / 100}</p>}
      <button className="btn" style={{ backgroundColor: "#febd69", fontWeight: "bold" }} onClick={payNowHandler}>
        Pay Securely
      </button>
    </div>
  );
}