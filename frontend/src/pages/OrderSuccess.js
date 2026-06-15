import React ,{useEffect} from "react";
import { useLocation,Link } from "react-router-dom";

export default function OrderSuccess({setCartItems}) 
{
  const location = useLocation();
  const orderId = location.state?.dbOrderId || "";
  const shortOrderId = orderId ? "ORD-" + orderId.slice(-6).toUpperCase() : "N/A";  

  useEffect(() => 
  {
    setCartItems([]);   
    localStorage.removeItem("cartItems"); 
  }, [setCartItems]);

  return (
    <div className="container text-center mt-5">
      <div
        className="card p-5 shadow-sm mx-auto"
        style={{
          maxWidth: "500px",
          borderRadius: "12px"
        }}
      >
        <h2 className="text-success mb-3">
          Order Placed Successfully!
        </h2>
        <p>Your order has been placed successfully.</p>
        <p>Your Order Id:{shortOrderId}</p>

        <Link to="/" className="btn btn-warning mt-3">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}