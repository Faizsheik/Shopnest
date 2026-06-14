import React, { useState, useEffect, Fragment } from "react";
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Cart({ cartItems, setCartItems }) {
    const token = localStorage.getItem('token');
    const [complete] = useState(false);

    // Helper to extract authorization
    const getAuthHeaders = () => {
        const currentToken = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentToken}`
        };
    };

    // --- Fetch Cart Data ---
    useEffect(() => {
        async function fetchCart() {
            if (!token) return;
            
            try {
                const res = await fetch(`${process.env.REACT_APP_API_URL}/getCartDetails`, {
                    method: 'GET',
                    headers: getAuthHeaders()
                });
                const data = await res.json();
                console.log("cart items", data);

                if (res.ok) 
                {
                    const items = data.cart && data.cart.items ? data.cart.items : [];
                    localStorage.setItem("cartItems", JSON.stringify(items));
                    setCartItems(items);
                } else if (res.status === 404) 
                {
                    localStorage.setItem("cartItems", JSON.stringify([])); 
                    setCartItems([]);
                } else {
                    console.error(data.message || "Failed to load cart");
                }


            } 
            catch (error) {
                console.error("Cart fetch error:", error);
                toast.error("Error connecting to server.");
            }
        }

        fetchCart();
    }, [cartItems]); 

    // --- Increase Quantity ---
    function increaseQty(item) 
    {
        if (!item.productId || item.productId.stock <= item.quantity) {
            toast.info("No more stock available for this item.");
            return;
        }

        const updatedItems = cartItems.map((i) => {
            if (i.productId?._id === item.productId?._id) {
                return { ...i, quantity: i.quantity + 1 }; 
            }
            return i;
        });

        setCartItems(updatedItems);
        localStorage.setItem("cartItems", JSON.stringify(updatedItems));
    }

    // --- Decrease Quantity ---
    function decreaseQty(item) {
        if (item.quantity > 1) {
            const updatedItems = cartItems.map((i) => {
                if (i.productId?._id === item.productId?._id) {
                    return { ...i, quantity: i.quantity - 1 }; 
                }
                return i;
            });

            setCartItems(updatedItems);
            localStorage.setItem("cartItems", JSON.stringify(updatedItems));
        }
    }

    // --- Remove Item completely from Database & Local State ---
    async function removeItem(item) 
    {
        try 
        {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/deleteCartItem`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    productId: item.productId?._id
                })
            });

            const data = await res.json();
            if (res.ok) 
            {
                setCartItems(data.items || []);
                localStorage.setItem("cartItems", JSON.stringify(data.items || []));
                toast.success("Item removed from cart");
             } 
            else {
                console.error(data.message || "Failed to delete item");
            }
        } 
        catch (error) 
        {
            console.error("Cart item deletion error:", error);
            toast.error("Error connecting to server.");
        }
    }

    return cartItems && cartItems.length > 0 ? (
        <Fragment>
            <div className="container container-fluid">
                <h2 className="mt-5">Your Cart: <b>{cartItems.length}</b></h2>
                
                <div className="row d-flex justify-content-between">
                    <div className="col-12 col-lg-8">
                        {cartItems.map((item) => (
                            <Fragment key={item.productId?._id || item._id}>
                                <div className="cart-item">
                                    <div className="row">
                                        {/* Image wrapper */}
                                        <div className="col-4 col-lg-3">
                                            <img 
                                                src={item.productId?.images?.[0]?.image || "/default-image.png"} 
                                                alt={item.productId?.name || "Product"} 
                                                height="90" 
                                                width="115"
                                                style={{ objectFit: 'contain' }}
                                            />
                                        </div>

                                        {/* Link & Title */}
                                        <div className="col-5 col-lg-3">
                                            <Link to={`/product/${item.productId?._id}`}>
                                                {item.productId?.name || "Unknown Product"}
                                            </Link>
                                        </div>

                                        {/* Unit Price */}
                                        <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                                            <p id="card_item_price">{item.price}</p>
                                        </div>

                                        {/* Quantity Modifiers */}
                                        <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                                            <div className="stockCounter d-inline">
                                                <span className="btn btn-danger minus" onClick={() => decreaseQty(item)}>-</span>
                                                <input type="number" className="form-control count d-inline" value={item.quantity} readOnly />
                                                <span className="btn btn-primary plus" onClick={() => increaseQty(item)}>+</span>
                                            </div>
                                        </div>

                                        {/* Trash Removal Action */}
                                        <div className="col-4 col-lg-1 mt-4 mt-lg-0">
                                            <i id="delete_cart_item" className="fa fa-trash btn btn-danger" onClick={() => removeItem(item)}></i>
                                        </div>
                                    </div>
                                </div>
                                <hr />
                            </Fragment>
                        ))}
                    </div>

                    {/* Order Summary Calculations */}
                    <div className="col-12 col-lg-3 my-4">
                        <div id="order_summary">
                            <h4>Order Summary</h4>
                            <hr />
                            <p>Subtotal: <span className="order-summary-values">
                                {cartItems.reduce((accu, item) => accu + item.quantity, 0)} Units
                            </span></p>
                            
                            <p>Est. total: <span className="order-summary-values">
                                {cartItems.reduce((accu, item) => accu + (Number(item.productId?.price || item.price || 0) * item.quantity), 0)}
                            </span></p>
                            <hr />
                            
                            <Link to="/shippingdetails">
                                <button id="checkout_btn" className="btn btn-primary btn-block">
                                    Proceed to buy
                                </button>
                            </Link>  
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    ) : (!complete ? (
        <h2 className="mt-5 text-center text-muted">Your cart is empty!</h2>
    ) : (
        <Fragment>
            <h2 className="mt-5 text-center text-success">Thank you for your order!</h2>
            <Link to="/" className="text-center d-block mt-3">
                <h2>Start shopping again</h2>
            </Link>
        </Fragment>
    ));
}