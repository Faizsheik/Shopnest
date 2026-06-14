
import React from 'react';
import {useState,useEffect} from 'react';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function DeleteProduct()
{
  const [products, setProducts] =  useState([]);
  const[selectedproduct,setSelectedProduct] =useState("")
      useEffect(()=>{
                // console.log(`url is ${process.env.REACT_APP_API_URL}`)
                 fetch(`${process.env.REACT_APP_API_URL}/products`)
                .then(res => res.json())
                .then(res => setProducts(res.products))   
                .catch(err => console.log("Fetch error:", err))
            },[])


             const handleFormSubmit = async (e) =>
                {
                     e.preventDefault();
                     if(!selectedproduct)
                     {
                        toast.error("Please select the product");
                        return;
                     }

                     try
                    {
                                        
                                          const response = await fetch(`${process.env.REACT_APP_API_URL}/deleteProduct/${selectedproduct}`,{
                                          method:'DELETE',
                                          headers: {
                                            'Content-Type': 'application/json',
                                            Authorization: `Bearer ${localStorage.getItem("token")}` 
                                        }  
                                      })
                                      if(response.ok)
                                      {
                                        toast.success("product deleted successfully!");

                                        //setProducts("");

                                      }
                                      else
                                      {
                                        toast.error("Failed to delete the product");
                    
                                      }
                                      
                    }
                           catch(error)
                           {
                                toast.error("Error connecting to server!");
                    
                           }
                     
                   
                   
                }

    
    return (
        <>
               <div className="container d-flex justify-content-center align-items-center min-vh-100 py-5">
            <div className="card p-4 shadow-sm w-100" style={{ maxWidth: '650px' }}>
                <form onSubmit={handleFormSubmit}> 


                    <div className="row mb-3 align-items-center">
                        <label className="col-sm-4 col-form-label text-sm-end fw-bold customLabel">
                            product Name
                        </label>
                        <div className="col-sm-8 d-flex flex-column align-items-start">
                            <select 
                                className="form-select mb-2" 
                                style={{ width: '100%', height: '38px' }}
                                value={selectedproduct} 
                                onChange={(e) => setSelectedProduct(e.target.value)}
                            >
                                <option value="">-- Select a product --</option>
                                {products.map((p) => (
                                    <option key={p._id} value={p._id}>
                                        {p.name}
                                    </option>
                                ))}
                                
                            </select>
                        </div>
                    </div>

                
                    <div className="row">
                        <div className="col-sm-8 offset-sm-4">
                            <button type="submit" className="form-control" style={{backgroundColor:"#febd69"}}>
                                Delete product
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>


        </>
    )
}


