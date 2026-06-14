import {Link} from 'react-router-dom';
import React, { Fragment , useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function ViewSubCategory({category})
{
    const [subcategories,setSubCategories] = useState([]);
    const {categoryId} = useParams();
        
        useEffect(()=>{
             if (!categoryId) 
            {
                        return;
            }
                const fetchSubCategories = async () => {
                    try{
                        const response = await fetch(`${process.env.REACT_APP_API_URL}/getsubcategoryitems/${categoryId}`);
                        const data = await response.json();
                        if(response.ok)
                        {
                            
                            setSubCategories(data.subCategoryItems);
                            
                        }
                        else if (response.status === 404) 
                        {
                            setSubCategories([]);
                            //toast.error(data.message || "No subcategories found", { toastId: "no-subcategories" });
                        } 
                        else {
                            setSubCategories([]); // if error code with 500 found show that error
                            console.log(data.message || "Error fetching subcategories");
                        }
        
                    }
                    catch(error)
                    {
                        toast.error("Error loading categories from server.Please try later"); // if any network dropouts
                        console.error("Fetch error:", error); // for developer
        
                    }
                }
                fetchSubCategories();
        
        
            },[categoryId])
        

    

    return (
        <div className="container my-5">
            {subcategories.length > 0 ? (
                // --- CASE 1: Subcategories Exist ---
                <Fragment>
                    <h1 id="products_heading">Sub Categories</h1>
                    <div className="row">
                        {subcategories.map((sub) => (
                            <div key={sub._id} className="col-sm-12 col-md-6 col-lg-3 my-3">
                                <Link 
                                    to={`/?category=${categoryId}&subCategory=${sub._id}`}
                                    className="text-decoration-none text-dark"
                                >
                                    <div className="card p-3 rounded h-100 style-on-hover">
                                        {/* Subcategory Image */}
                                        <img
                                            className="card-img-top mx-auto"
                                            src={sub.images && sub.images[0] ? sub.images[0].image : 'https://via.placeholder.com/150'}
                                            alt={sub.name}
                                            style={{ objectFit: 'contain', height: '150px' }}
                                        />
                                        {/* Subcategory Details */}
                                        <div className="card-body d-flex flex-column justify-content-end">
                                            <h5 className="card-title text-center mb-0">
                                                <p className="fw-bold mb-0">{sub.name}</p>
                                            </h5>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </Fragment>
            ) : (
                // --- CASE 2: No Subcategories Found ---
                <h2 id="products_heading" className="text-center mt-5 text-muted">
                    No subcategories found for this category
                </h2>
            )}
        </div>
    );
}