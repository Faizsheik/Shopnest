import React, { useState, useEffect } from "react";
import {Link} from "react-router-dom"
import "./OrderHistory.css"; 

const OrderHistory = () => 
  {
    const [orders,setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(()=>{
        const fetchOrders = async () => 
        {
            try
            {
                const res = await fetch(
                    `${process.env.REACT_APP_API_URL}/getorderdetails`, {
                        method: "GET",
                        headers: 
                        {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    });

                  const data = await res.json();
                  if (res.ok) 
                  {
                        setOrders(data.orders || []);
                  } else 
                  {
                        console.error(data.message || "Failed to fetch the orders");
                        setError(data.message || "Could not retrieve your orders.");
                  }
                }
                catch(error)
                {
                    console.error("Orders fetch error:", error);
                    setError("Error connecting to server.");
                }
                finally 
              {
                setLoading(false);
             }
        }
        fetchOrders();
    },[]);


if (loading) return <div className="loading">Loading your orders...</div>;
if (error) return <div className="error-msg">Error: {error}</div>;
 
  return (
    <div className="order-history-container">
      <h1 className="page-title">Your Orders</h1>
      <div className="order-tabs">
        <span className="tab active">Orders</span>
        {/* <span className="tab">Buy Again</span>
        <span className="tab">Not Yet Dispatched</span>
        <span className="tab">Cancelled Orders</span> */}
      </div>

      <hr className="divider" />

      <div className="main-content-layout">
        <div className="orders-list">
          {orders.length === 0 ? (
            <p>You haven't placed any orders yet.</p>
          ) : (
            orders.map((order) => (
              <div key={order._id} className="order-card">
                
                {/* 1. Grey Header Card Row */}
                <div className="order-card-header">
                  <div className="header-left">
                    <div className="header-meta">
                      <span className="meta-label">ORDER PLACED</span>
                      <span className="meta-value">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="header-meta">
                      <span className="meta-label">TOTAL</span>
                      <span className="meta-value">₹{order.totalPrice}</span>
                    </div>
                    <div className="header-meta">
                      <span className="meta-label">DISPATCH TO</span>
                      <span className="meta-value text-blue">
                        {order.shippingInfo.city.substring(0, 15)}
                      </span>
                    </div>
                  </div>
                  <div className="header-right">
                    <span className="meta-label">ORDER # {order.paymentInfo?.id||order._id}</span>
                    <div className="header-links">
                      {/* <a href={`/order/${order._id}`} className="text-blue">View order details</a> */}
                    </div>
                  </div>
                </div>

                {/* 2. White Card Content Body */}
                <div className="order-card-body">
                  <div className="status-title" style={{textAlign:"-khtml-left"}}>
                    <h6 >Payment Status: {order.paymentInfo?.status}</h6>
                  </div>

                  <br/>
                  

                  {order.orderItems.map((item) => (
                    <div key={item._id} className="item-row text-left">
                      <img 
                        src={item.productId?.images?.[0]?.image}
                        alt={item.productId?.name} 
                        className="item-image" 
                        />
                      
                      <div className="item-details">
                        <a href={`/product/${item.productId?._id || item.productId}`} className="item-name text-blue">
                        {item.productId.name}
                        </a>
                        <p className="item-qty">Quantity: {item.quantity}</p>
                        <Link to={`/product/${item.productId?._id || item.productId}`}>
                            <button className="buy-again-btn">🛒 Buy it again</button>

                        </Link>
                      </div>
                      
                      {/* 3. Action Buttons Alignment */}
                      <div className="item-actions">
                        <Link to={`/productreview/${item.productId?._id || item.productId}`}>
                       <button className="action-btn yellow-btn">Write Product Review</button>
                       </Link> 
                      </div>
                    </div>
                  ))}
                  
                </div>

              </div>
            ))
          )}
        </div>


        {/* Right Side Sticky Panel: As seen in image_4cef7f.jpg */}
        <div className="right-sidebar">
          <div className="sidebar-card">
            <img src="thankyou.gif" className="sidebar-gif" alt="Thank you for your order"></img>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;