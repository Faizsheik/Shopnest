import React, { useState, useEffect } from "react";
import "./OrderHistory.css"; 

const ViewOrder = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingId, setUpdatingId] = useState(null);

    // 1. Fetch Admin Orders from Backend on Component Mount
    useEffect(() => {
        const fetchAdminOrders = async () => {
            try {
                const res = await fetch(
                    `${process.env.REACT_APP_API_URL}/getallorders`, { 
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.message || "Failed to fetch the orders");
                }
                setOrders(data.orders);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchAdminOrders();
    }, []);

    // 2. Inline Handler to change Fulfillment Status dynamically
    const handleStatusUpdate = async (orderId, newStatus) => {
        setUpdatingId(orderId);
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/admin/order/${orderId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ status: newStatus })
            });
            const data = await res.json();
            
            if (res.ok) {
                // Instantly update UI state map without breaking component focus
                setOrders(orders.map(order => 
                    order._id === orderId ? { ...order, orderStatus: newStatus } : order
                ));
            } else {
                alert(data.message || "Failed to update status");
            }
        } catch (err) {
            console.error("Fulfillment adjustment failure:", err);
            alert("Network connection error while modifying order pipeline.");
        } finally {
            setUpdatingId(null);
        }
    };

    if (loading) return <div className="loading" style={{ padding: "40px", textStyle: "center" }}>Loading customer order registry...</div>;
    if (error) return <div className="error-msg" style={{ color: "red", padding: "40px" }}>Error: {error}</div>;
 
    return (
        <div className="order-history-container admin-version">
            <h1 className="page-title">Admin Command: Manage Orders</h1>
            
            <div className="order-tabs">
                <span className="tab active">All Customer Orders ({orders.length})</span>
            </div>

            <hr className="divider" />

            <div className="main-content-layout">
                {/* Orders Cards List */}
                <div className="orders-list" style={{ width: "100%" }}>
                    {orders.length === 0 ? (
                        <p>No customer orders have been placed yet.</p>
                    ) : (
                        orders.map((order) => {
                            // Helper clean tracking hash extraction
                            const shortId = `ORD-${order._id.toString().slice(-6).toUpperCase()}`;

                            return (
                                <div key={order._id} className="order-card admin-border" style={{ border: "1px solid #ddd", borderRadius: "6px", marginBottom: "25px", overflow: "hidden" }}>
                                    
                                    {/* 1. Gray Header Card Row */}
                                    <div className="order-card-header" style={{ backgroundColor: "#f6f6f6", padding: "12px 20px", display: "flex", justify: "space-between", flexWrap: "wrap", gap: "15px" }}>
                                        <div className="header-left" style={{ display: "flex", gap: "25px" }}>
                                            
                                            {/* CUSTOMER PROFILE CAPTURE */}
                                            <div className="header-meta">
                                                <span className="meta-label" style={{ display: "block", fontSize: "11px", color: "#666" }}>CUSTOMER</span>
                                                <span className="meta-value" style={{ fontWeight: "bold", color: "#111" }}>
                                                    {order.shippingInfo?.fullName || order.user?.username || "Guest Shopper"}
                                                </span>
                                                {order.user?.email && (
                                                    <span style={{ fontSize: "11px", color: "#777", display: "block" }}>{order.user.email}</span>
                                                )}
                                            </div>

                                            <div className="header-meta">
                                                <span className="meta-label" style={{ display: "block", fontSize: "11px", color: "#666" }}>ORDER PLACED</span>
                                                <span className="meta-value">
                                                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-US", {
                                                        day: "numeric", month: "long", year: "numeric",
                                                    }) : "N/A"}
                                                </span>
                                            </div>

                                            <div className="header-meta">
                                                <span className="meta-label" style={{ display: "block", fontSize: "11px", color: "#666" }}>TOTAL</span>
                                                <span className="meta-value" style={{ color: "#B12704", fontWeight: "bold" }}>
                                                    ₹{order.totalPrice || 0}
                                                </span>
                                            </div>

                                            <div className="header-meta">
                                                <span className="meta-label" style={{ display: "block", fontSize: "11px", color: "#666" }}>SHIP TO</span>
                                                <span className="meta-value text-blue">
                                                    {order.shippingInfo?.city || "N/A"}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="header-right" style={{ textAlign: "right" }}>
                                            <span className="meta-label" style={{ display: "block", fontSize: "11px", color: "#666" }}>GATEWAY TXN ID / ORDER ID</span>
                                            <span className="meta-value font-mono" style={{ fontSize: "12px", color: "#0066c0", fontWeight: "600" }}>
                                                {order.paymentInfo?.id || shortId}
                                            </span>
                                        </div>
                                    </div>

                                    {/* 2. Card Content Body */}
                                    <div className="order-card-body" style={{ padding: "20px" }}>
                                        <div className="admin-status-bar" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "10px", borderBottom: "1px solid #f3f3f3" }}>
                                            <div>
                                                <strong>Payment Status:</strong> 
                                                <span style={{ marginLeft: "5px", color: order.paymentInfo?.status === "Paid" ? "green" : "orange", fontWeight: "bold" }}>
                                                    {order.paymentInfo?.status || "Pending"}
                                                </span>
                                                <span style={{ fontSize: "12px", color: "#666", marginLeft: "10px" }}>
                                                    via {order.paymentMethod || "Razorpay"}
                                                </span>
                                            </div>
                                            
                                            {/* ADMINISTRATIVE FULFILLMENT STATUS CONTROL */}
                                            <div>
                                                <strong style={{ marginRight: "8px" }}>Fulfillment:</strong>
                                                <select
                                                    disabled={updatingId === order._id}
                                                    value={order.orderStatus || "processing..."}
                                                    onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                                    style={{ padding: "4px 8px", borderRadius: "4px", border: "1px solid #ccc", background: "#fff", fontSize: "13px", cursor: "pointer", fontWeight: "500" }}
                                                >
                                                    <option value="processing...">Processing</option>
                                                    <option value="shipped">Shipped</option>
                                                    <option value="delivered">Delivered</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Map through purchase item arrays */}
                                        {order.orderItems?.map((item) => (
                                            <div key={item._id} className="item-row text-left" style={{ display: "flex", gap: "15px", marginTop: "15px", alignItems: "center" }}>
                                                <img 
                                                    src={item.productId?.images?.[0]?.image || "https://placehold.co/60x60?text=Product"}
                                                    alt="" 
                                                    className="item-image" 
                                                    style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "4px" }}
                                                />
                                                
                                                <div className="item-details" style={{ flex: 1 }}>
                                                    <span className="item-name text-blue" style={{ fontWeight: "600", color: "#0066c0" }}>
                                                        {item.productId?.name || "Product Document Removed"}
                                                    </span>
                                                    <p className="item-qty" style={{ color: "#555", margin: "4px 0" }}>
                                                        Quantity Ordered: <strong>{item.quantity}</strong> × ₹{item.price || item.productId?.price || 0}
                                                    </p>
                                                    <p style={{ fontSize: "11px", color: "#888", fontFamily: "monospace" }}>
                                                        Product Reference ID: {item.productId?._id || item.productId}
                                                    </p>
                                                </div>
                                                
                                                <div className="item-actions">
                                                    <Link to={`/admin/product/edit/${item.productId?._id || item.productId}`}>
                                                        <button className="action-btn" style={{ background: "#e7e9ec", border: "1px solid #adb1b8", padding: "6px 12px", borderRadius: "3px", fontSize: "12px", cursor: "pointer" }}>
                                                            Edit Inventory Item
                                                        </button>
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                        
                                        {/* Logistics Shipping Snapshot and Audit Ledger */}
                                        <div className="admin-shipping-snapshot" style={{ background: "#f9f9f9", padding: "12px", borderRadius: "4px", marginTop: "15px", fontSize: "12px", color: "#444", border: "1px solid #eee" }}>
                                            <p style={{ margin: "0 0 6px 0" }}>
                                                <strong>Full Shipping Destination:</strong> {order.shippingInfo?.address}, {order.shippingInfo?.city}, {order.shippingInfo?.state || ""}, {order.shippingInfo?.postalCode || ""} - {order.shippingInfo?.country || ""}
                                            </p>
                                            <p style={{ margin: "0", color: "#666", borderTop: "1px dashed #ddd", paddingTop: "6px", display: "flex", gap: "15px" }}>
                                                <span><strong>Contact Phone:</strong> {order.shippingInfo?.phoneNo || "N/A"}</span>
                                                <span>|</span>
                                                <span><strong>Items Total:</strong> ₹{order.itemsPrice || 0}</span>
                                                <span>|</span>
                                                <span><strong>Tax:</strong> ₹{order.taxPrice || 0}</span>
                                                <span>|</span>
                                                <span><strong>Shipping Cost:</strong> ₹{order.shippingPrice || 0}</span>
                                            </p>
                                        </div>
                                    </div>

                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default ViewOrder;