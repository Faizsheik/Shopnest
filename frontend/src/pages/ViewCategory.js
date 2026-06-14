import {Link} from 'react-router-dom';
import {useState,useEffect} from 'react';
import {toast} from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function ViewCategory()
{
    const [categories,setCategories] = useState([]);
        
        useEffect(()=>
        { 
            const fetchCategories = async () => 
            {
                try
                {
                
                    const response = await fetch(`${process.env.REACT_APP_API_URL}/getcategoryitems`);
                    const data = await response.json();
                    if(response.ok)
                    {
                            setCategories(data.categoryItems);
                    }
                    else if(response.status === 404)
                    {
                            setCategories([]);
                            toast.error(data.message || "No Catgories found")
                    }
                    else
                    {
                            setCategories([]);
                            console.log(data.message || "Error fetching catgeories"); //no categories found

                    }
            
                }
                catch(error)
                {
                    console.error("Error loading categories from server, please try later" || error); 
            
                }
            }
        fetchCategories();
        },[categories])

    

    return (
        <div className="container my-5">

            <h1 id="products_heading">Categories</h1>

            <div className="row">

                {/* Display all categories */}
                {categories.map((cat) => (
                    <div key={cat._id} className="col-sm-12 col-md-6 col-lg-3 my-3">

                        <Link to={`/viewsubcategory/${cat._id}`} className="text-decoration-none text-dark">

                            <div className="card p-3 rounded h-100 style-on-hover">
                                {/* category image */}
                                <img
                                    className="card-img-top mx-auto"
                                    src={cat.images && cat.images[0] ? cat.images[0].image : 'https://via.placeholder.com/150'}
                                    alt={cat.name}
                                    style={{ objectFit: 'contain', height: '150px' }}
                                />
                                {/* category details */}
                                <div className="card-body d-flex flex-column justify-content-end">
                                    <h5 className="card-title text-center mb-0">
                                        <p className="fw-bold mb-0">{cat.name}</p>
                                    </h5>
                                </div>
                            </div>

                        </Link>
                    </div>
                ))}


            </div>


        </div>
    );
}