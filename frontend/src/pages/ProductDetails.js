import {useState,useEffect} from 'react'
import { useParams } from 'react-router-dom';
import {toast} from 'react-toastify';
import { useNavigate } from "react-router-dom";


export default function ProductDetail({cartItems,setCartItems})    //get as array of objects
{
    const [product,setProduct] = useState(null);
    const {id} = useParams();
    const [qty,setQty] = useState(1);
    const token = localStorage.getItem('token');

    const navigate=useNavigate();

    useEffect(() => {
        const fetchProduct = async () => 
        {
            try 
            {
                const res = await fetch(`${process.env.REACT_APP_API_URL}/product/${id}`);
                const data = await res.json();
                
                if(res.ok)
                {
                    setProduct(data.product);
                }
                else if(res.status === 404)
                {
                   setProduct(null);
                    toast.error(data.message|| "product is not found");
                }
                else
                {
                    console.log(data.message||"Error fetching product details");
                    
                }
     
            } 
            catch (error) 
            {
                console.error("Fetch error:", error);
                toast.error("Failed to load product details.please try later");
            }
        };

        fetchProduct();
    }, [id]); 


        //helper function
        const getAuthHeaders = () =>
        {
            const token =localStorage.getItem('token');

            return{
                'Content-Type':'application/json',
                'Authorization':`Bearer ${token}`  
            };
        };


        // -- Add to cart functionality
        const addToCart  = async () =>
        {
            if(!token)
            {
                navigate('/login');
                return;
            }

            try
            {
                const obj = {
                    productId: product._id,
                    quantity: qty,
                    price:product.price

                }

                const res = await fetch(`${process.env.REACT_APP_API_URL}/addToCart`,{
                    method: 'POST',
                    headers: getAuthHeaders(),
                    body: JSON.stringify(obj)
                });

                const data = await res.json();

                console.log(data);
                if (res.ok) 
                {
                    const newItem = {
                    productId: product._id,        // use product._id directly
                    quantity: qty,
                    price: product.price,
                    // Optional: if you want product details for display
                    productId_name: product.name,
                    productId_images: product.images
                };
                
                    //const updatedItems = data.cart && data.cart.items ? data.cart.items : [];
                    const updatedItems = [...cartItems, newItem];
                    setCartItems(updatedItems);
                    localStorage.setItem("cartItems", JSON.stringify(updatedItems));
                    toast.success("Added to cart successfully");
                }

                else if (!res.ok) 
                {
                    toast.error(data.message || "Failed to add item to cart");
                    return;
              }

                
            }
            catch(error)
            {
                console.error("Add to cart error:", error);
                toast.error("Unable to add the item to cart. Try again.");
            }

        }


        function increaseQty()
        {
            if(product.stock === qty)
            {
                return;
            }
            setQty((state)=>state+1);
        }

        function decreaseQty()
        {
            if(qty>1){
                setQty((state)=>state-1)

            }
        }


        /*
        Initial load:
        ↓
        Render (product = empty)
        ↓
        DOM updated
        ↓
        useEffect runs → fetch data
        ↓
        setProduct()
        ↓
        Re-render (product = actual data)
        ↓
        UI updates*/

    return product && <div className="container container-fluid">
        <div className="row f-flex justify-content-around">
            <div className="col-12 col-lg-5 img-fluid" id="product_image">
                <img src={product.images[0].image} alt="sdf" height="500" width="500"/>
            </div>

            <div className="col-12 col-lg-5 mt-5">
                <h3>{product.name}</h3>
                <p id="product_id">{product._id}</p>

                <hr/>

                <div className="rating-outer">
                    <div className="rating-inner" style={{width: `${product.ratings/5 * 100}%`}}>

                    </div>
                </div>
           

                <hr/>

                <p id="product_price">{product.price}</p>
                <div className="stockCounter d-inline">
                    <span className="btn btn-danger minus" onClick={decreaseQty}>-</span>

                    <input type="number" className="form-control count d-inline" value={qty} readOnly />

                    <span className="btn btn-primary plus" onClick={increaseQty}>+</span>
                </div>
                 <button type="button" id="cart_btn" className="btn btn-primary d-inline ml-4"  disabled={product.stock === 0 || token === ""} onClick={addToCart}>Add to Cart</button>

                <hr/>

                <p>Status: <span id="stock_status" className={product.stock > 0 ? 'text-success' : 'text-danger'}>{product.stock > 0 ? `In Stock (${product.stock})` :  `Out of Stock `}</span></p>

                <hr/>

                <h4 className="mt-2">Description:</h4>
                <p>{product.description}</p>
                <hr/>
                <p id="product_seller mb-3">Sold by: <strong>{product.seller}</strong></p>
				
                <div className="rating w-50"></div>
						
            </div>

        </div>

    </div>
}