import React, { Fragment , useState, useEffect} from 'react';
import ProductCard from '../components/ProductCard';
import { useSearchParams } from 'react-router-dom';
import {toast} from 'react-toastify';
import { ToastContainer } from 'react-toastify';

export default function Home({cartItems})
{
    const [products, setProducts] =  useState([]);
    const [searchParams,setSearchParams]=useSearchParams();

    const categoryFilter = searchParams.get('category');
    const subCategoryFilter = searchParams.get('subCategory');

    
    // useEffect(()=>{
    //     // console.log(`url is ${process.env.REACT_APP_API_URL}`)
    //      fetch(`${process.env.REACT_APP_API_URL}/products?${searchParams}`)
    //     .then(res => res.json())
    //     .then(res => setProducts(res.products))   
    //     .catch(err => console.log("Fetch error:", err))
    // },[searchParams])

    useEffect(() => 
    {
        const fetchFilteredProducts = async () => {
        try {
                // Build your base products endpoint URL string
                let url = `${process.env.REACT_APP_API_URL}/products`;
                // Append search query parameter parameters if they exist
                if (categoryFilter && subCategoryFilter) {
                    url += `?category=${categoryFilter}&subCategory=${subCategoryFilter}`;
                }

                const response = await fetch(url);
                const data = await response.json();
                
                if (response.ok) 
                {
                    setProducts(data.products);
                }
                else if(response.status === 404)
                {
                  setProducts([]);
                  //toast.error(data.message || "No products found", { toastId: "no-products" });
                  
                  
                }
                else
                { 
                    setProducts([]);
                    console.log(data.message || "Error fetching products"); //no prodcuts found
                    
                    

                }

            } 
            catch (error) 
            {
                console.error("Error fetching filtered products from server:", error);
            }
        };

        fetchFilteredProducts();
    }, [categoryFilter, subCategoryFilter]);



    //state value is async console.log after setProducts will provide old state.
    // so we can print console after res.json()

    return <Fragment>
      {products.length > 0 ? (

        <Fragment>
          <h1 id="products_heading">Latest Products</h1>
          <section id="products" className="container mt-5">
            <div className="row">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </section>
        </Fragment>


      ) 
      : 
      (
        <h2 id="products_heading" className="text-center mt-5 text-muted">
          No products found matching your criteria
        </h2>
      )}
    </Fragment>
}   



