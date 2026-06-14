import React from 'react'
import { Fragment , useState, useEffect} from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
export default function ViewProducts()
{
    const [products, setProducts] =  useState([]);
   const [searchParams]=useSearchParams()
      useEffect(()=>{
                 console.log(`url is ${process.env.REACT_APP_API_URL}`)
                 fetch(`${process.env.REACT_APP_API_URL}/products?${searchParams}`)
                .then(res => res.json())
                .then(res => setProducts(res.products))   
                .catch(err => console.log("Fetch error:", err))
            },[searchParams])
            const outOfStockProducts = products.filter(product => product.stock === "0");
    return <Fragment>
            <h1 id="products_heading">Out of Stock Products
            </h1>

                  <section id="products" className="container mt-5">
                             <div className="row">
                               {outOfStockProducts.map(product => <ProductCard key={product._id} product={product} />)}
                             </div>
                    </section>
        </Fragment>

}