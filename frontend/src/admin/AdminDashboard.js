import React from 'react'
import {Link} from 'react-router-dom'
import AddProduct from './AddProduct'
import AddCategory from './AddCategory'
import AddSubCategory from './AddSubCategory'

export default function ProductDetail() 
{
    

  return (  <>
    <div className="container-fluid" style={{marginTop:"40px"}}>
      <div className="row" style={{minHeight:"300px"}}>

        <div className="col-md-3 mb-4">
          <div className="card h-100 d-flex align-items-center justify-content-center text-center" style={{backgroundColor:"brown"}}>
            <div className="card-body d-flex align-items-center">
             <Link to={"/admin/addcategory"}><button style={{minHeight:"50px",borderRadius:"5px"}}> Add category </button></Link> 
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-4">
          <div className="card h-100 d-flex align-items-center justify-content-center text-center" style={{backgroundColor:"violet"}}>
            <div className="card-body d-flex align-items-center">
             <Link to={"/admin/addsubcategory"}><button style={{minHeight:"50px",borderRadius:"5px"}}> Add Subcategory </button></Link> 
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-4">
          <div className="card h-100 d-flex align-items-center justify-content-center text-center" style={{backgroundColor:"red"}}>
            <div className="card-body d-flex align-items-center">
             <Link to={"/admin/addproduct"}><button style={{minHeight:"50px",borderRadius:"5px"}}> Add Product </button></Link> 
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-4">
          <div className="card h-100 d-flex align-items-center justify-content-center text-center" style={{backgroundColor:"orange"}}>
            <div className="card-body d-flex align-items-center">
             <Link to={"/admin/deleteproduct"}><button style={{minHeight:"50px",borderRadius:"5px"}}> Delete Product </button></Link> 
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-4">
          <div className="card h-100 d-flex align-items-center justify-content-center text-center" style={{backgroundColor:"yellow"}}>
            <div className="card-body d-flex align-items-center">
           <Link to="/admin/viewproducts"><button style={{minHeight:"50px",borderRadius:"5px"}}> View Products</button> </Link> 
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-4">
          <div className="card h-100 d-flex align-items-center justify-content-center text-center" style={{backgroundColor:"green"}}>
            <div className="card-body d-flex align-items-center">
             <Link to="/admin/vieworders"><button style={{minHeight:"50px",borderRadius:"5px"}}>View Orders</button></Link> 
            </div>u
          </div>
        </div>

        <div className="col-md-3 mb-4">
          <div className="card h-100 d-flex align-items-center justify-content-center text-center" style={{backgroundColor:"blue"}}>
            <div className="card-body d-flex align-items-center">
           <Link to="/admin/outofstockproducts"> <button style={{minHeight:"50px",borderRadius:"5px"}}>Out of Stock</button></Link>  
            </div>
          </div>
        </div>

      </div>
    </div>
    </>
  )
}
