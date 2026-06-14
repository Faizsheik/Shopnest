import React from 'react';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AddCategory() {

    const [categories, setCategories] = useState([]);
    const [selectedcategory, setSelectedCategory] = useState("");
    const [subcategoryname, setSubCategoryName] = useState("");
    const [subcategoryimage, setSubCategoryImage] = useState("");
    const [subcategories, setSubCategories] = useState([]);
    const [selectedsubcategory, setSubSelectedCategory] = useState("");

    // Fetch parent categories cleanly
    const fetchCategories = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/getcategoryitems`);
            const data = await response.json();
            if (response.ok)
            {
                setCategories(data.categoryItems || []);
            } 
            else
            {
                // toast.error("Failed to fetch Categories");
                console.log("Failed to fetch categories",data.message);
            }
        } 
        catch (error) 
        {
            console.log("Error loading categories from server.",error);
            toast.error("Error loading categories from server.",error);
        }
    };


    // FIXED: Empty dependency array ensures this fires exactly once on initialization
    useEffect(() => {
        fetchCategories();
    }, []);

    // Fires whenever a parent category is selected or changed
   useEffect(() => {
    const fetchSubCategories = async () => 
    {
        try 
        {
            // Your API URL might look something like this:
            const res = await fetch(`${process.env.REACT_APP_API_URL}/subcategories?category=${selectedcategory}`);
            const data = await res.json();
            
        } 
        catch (error)
        {
            console.error("Error fetching subcategories:", error);
        }
    };

        // Only fetch if a category is actually selected
        if (selectedcategory) {
            fetchSubCategories();
        }
    
        setSubSelectedCategory(""); // Clear sub-selection when parent changes

    }, [selectedcategory]);



    // 1. Sub Category Name Validation: Allows single intermediate spaces, blocks numbers & symbols
    const handleSubCategoryNameChange = (e) => {
        const { value } = e.target;
        
        let cleanedValue = value.replace(/[^a-zA-Z\s]/g, ""); // Letters and spaces only
        
        if (cleanedValue.startsWith(" ")) {
            cleanedValue = cleanedValue.trimStart(); // Block leading spacebars
        }
        
        cleanedValue = cleanedValue.replace(/\s+/g, " "); // Flatten multiple spacing runs
        
        setSubCategoryName(cleanedValue);
    };

    // 2. Sub Category Image Validation: Disallows spacing anywhere in the string
    const handleSubCategoryImageChange = (e) => {
        const { value } = e.target;
        const noSpacesUrl = value.replace(/\s/g, ""); // Instantly clean out spaces
        setSubCategoryImage(noSpacesUrl);
    };

    // Sub Category Deletion Handler
    const deleteSubCategory = async () => {
        if (!selectedcategory) {
            toast.error("Please select a parent Category first!");
            return;
        }
        if (!selectedsubcategory) {
            toast.error("Please select a sub category to delete!");
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/deletesubcategory/${selectedsubcategory}`, {
                method: 'DELETE',
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (response.ok) {
                toast.success("Sub Category deleted successfully!");
                setSubSelectedCategory("");
                fetchSubCategories(); // Reload dropdown entries instantly
            } else {
                toast.error("Failed to delete Sub Category");
            }
        } catch (error) {
            toast.error("Error connecting to server!");
        }
    };

    // Creation Form Handler
    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (!selectedcategory) {
            toast.error("Please select a parent category before adding a sub category.");
            return;
        }

        const trimmedName = subcategoryname.trim();
        const trimmedImage = subcategoryimage.trim();

        if (trimmedName === "" || trimmedImage === "") {
            toast.error("Please enter the sub category name and image URL");
            return;
        }

        if (!trimmedImage.startsWith("http://") && !trimmedImage.startsWith("https://")) {
            toast.error("Please enter a valid image web URL starting with http:// or https://");
            return;
        }

        const newObj = {
            name: trimmedName,
            categoryId: selectedcategory,
            images: [{ image: trimmedImage }]
        };

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/addsubcategory/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(newObj)
            });

            if (response.ok) {
                toast.success("Sub Category added successfully!");
                setSubCategoryName("");
                setSubCategoryImage("");
                fetchSubCategories(); // Reload dropdown entries instantly
            } else {
                toast.error("Failed to add the Sub Category");
            }
        } catch (error) {
            toast.error("Error connecting to server!");
        }
    };

    return (
        <>
            <style>{`
                @keyframes newsFlash {
                  0%, 100% { color: #ff0000; text-shadow: 0 0 8px rgba(255, 0, 0, 0.6); }
                  50% { color: #0000ff; text-shadow: 0 0 8px rgba(0, 0, 128, 0.6); }
                }
            `}</style>
            
            <div className="text-center" style={{ marginTop: "40px", fontStyle: "italic", color: "red", fontWeight: "bold", animation: "newsFlash 0.8s infinite steps(1)" }}>
                <h4>Please select category and sub category if you need to delete the sub category !!!</h4>
            </div>   

            <div className="container d-flex justify-content-center align-items-center min-vh-100 py-5">
                <div className="card p-4 shadow-sm w-100" style={{ maxWidth: '650px' }}>
                    <h2 className="text-center mb-5">Add New Sub Category</h2>
                    
                    <form onSubmit={handleFormSubmit}> 
                        {/* Select Parent Category */}
                        <div className="row mb-3 align-items-center">
                            <label className="col-sm-4 col-form-label text-sm-end fw-bold">Category Name</label>
                            <div className="col-sm-8 d-flex flex-column align-items-start">
                                <select 
                                    className="form-select mb-2" 
                                    style={{ width: '100%', height: '38px' }}
                                    value={selectedcategory} 
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    required
                                >
                                    <option value="">-- Select a Category --</option>
                                    {categories.map((category) => (
                                        <option key={category._id} value={category._id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Sub Category Input */}
                        <div className="row mb-3 align-items-center">
                            <label className="col-sm-4 col-form-label text-sm-end fw-bold">Sub Category Name</label>
                            <div className="col-sm-8">
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="Enter Subcategory name" 
                                    value={subcategoryname} 
                                    onChange={handleSubCategoryNameChange} // Fixed validation trigger
                                    required 
                                />
                            </div>
                        </div>

                        {/* Image URL Input */}
                        <div className="row mb-4 align-items-center">
                            <label className="col-sm-4 col-form-label text-sm-end fw-bold">Image URL</label>
                            <div className="col-sm-8">
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="https://image-link.com" 
                                    value={subcategoryimage} 
                                    onChange={handleSubCategoryImageChange} // Fixed validation trigger
                                    required 
                                />
                            </div>
                        </div>

                        {/* Add Button */}
                        <div className="row mb-4">
                            <div className="col-sm-8 offset-sm-4">
                                <button type="submit" className="form-control fw-bold" style={{ backgroundColor: "#febd69" }}>
                                    Add Sub Category
                                </button>
                            </div>
                        </div>
                    </form>

                    <hr />
                    <br />

                    {/* Manage & Delete Section */}
                    <div>
                        <div className="row mb-3 align-items-center">
                            <label className="col-sm-4 col-form-label text-sm-end fw-bold">
                                Select Sub Category to delete
                            </label>
                            <div className="col-sm-8 d-flex flex-column align-items-start">
                                <select 
                                    className="form-select mb-2" 
                                    style={{ width: '100%', height: '38px' }}
                                    value={selectedsubcategory} // FIXED: Corrected value mapping from selectedcategory
                                    onChange={(e) => setSubSelectedCategory(e.target.value)}
                                >
                                    <option value="">-- Select a Sub Category --</option>
                                    {subcategories.map((subcategory) => (
                                        <option key={subcategory._id} value={subcategory._id}>
                                            {subcategory.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-sm-8 offset-sm-4">
                                {/* FIXED: Explicit type="button" limits form execution leaks */}
                                <button 
                                    type="button" 
                                    onClick={deleteSubCategory}
                                    className="form-control fw-bold" 
                                    style={{ backgroundColor: "#febd69" }}
                                >
                                    Delete Sub Category
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}