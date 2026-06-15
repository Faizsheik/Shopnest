import React from 'react';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AddCategory() {
    const [categoryname, setCategoryName] = useState("");
    const [categoryimage, setCategoryImage] = useState("");
    const [categories, setCategories] = useState([]);
    const [selectedcategory, setSelectedCategory] = useState("");

    // ..Helper function to fetch categories cleanly
    const fetchCategories = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/getcategoryitems`);
            if (response.ok) {
                const data = await response.json();
                setCategories(data.categoryItems || []);
            } else {
                toast.error("Failed to fetch the Categories");
            }
        } catch (error) {
            toast.error("Error loading categories from server.");
        }
    };

    // FIXED: Dependency array changed to [] to prevent infinite re-render loops
    useEffect(() => {
        fetchCategories();
    }, []);

    const handleCategoryNameChange = (e) => {
        const { value } = e.target;
        
        // 1. Allow only letters and spaces (removes numbers, symbols, etc.)
        let cleanedValue = value.replace(/[^a-zA-Z\s]/g, "");
        
        // 2. Prevent starting the input with a space
        if (cleanedValue.startsWith(" ")) {
            cleanedValue = cleanedValue.trimStart();
        }
        
        // 3. Prevent typing consecutive multiple spaces (e.g., "Fashion  Items" becomes "Fashion Items")
        cleanedValue = cleanedValue.replace(/\s+/g, " ");
        
        setCategoryName(cleanedValue);
    };

    const handleCategoryImageChange = (e) => {
    const { value } = e.target;
    
    // 1. If the user presses space first (or anywhere), remove all spaces instantly.
    // This turns " " directly into "" so the starting empty space is completely blocked.
    const noSpacesUrl = value.replace(/\s/g, "");
    
    setCategoryImage(noSpacesUrl);
};

    // Handler to delete an existing category
    const deleteCategory = async () => {
        if (!selectedcategory) {
            toast.error("Please select a category to delete!");
            return;
        }
        
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/deletecategory/${selectedcategory}`, {
                method: 'DELETE',
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (response.ok) {
                toast.success("Category deleted successfully!");
                setSelectedCategory("");
                fetchCategories(); // Refresh dropdown list instantly after deleting
            } else {
                toast.error("Failed to delete Category");
            }
        } catch (error) {
            toast.error("Error connecting to server!");
        }
    };

    // Handler to create a category
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        
        const trimmedName = categoryname.trim();
        const trimmedImage = categoryimage.trim();

        // Required Check
        if (trimmedName === "" || trimmedImage === "") {
            toast.error("Please enter the category name and image URL");
            return;
        }

        // Final Submission Regex Validation Check
        const alphaRegex = /^[a-zA-Z]+$/;
        if (!alphaRegex.test(trimmedName)) {
            toast.error("Category name must contain letters only with no spaces, numbers, or symbols");
            return;
        }

        const newObj = {
            name: trimmedName, // Send cleansed trimmed value
            images: [
                {
                    image: trimmedImage
                }
            ]
        };

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/addcategory/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(newObj)
            });

            if (response.ok) {
                toast.success("Category added successfully!");
                setCategoryName("");
                setCategoryImage("");
                fetchCategories(); // Refresh dropdown list instantly after adding
            } else {
                toast.error("Failed to add the Category");
            }
        } catch (error) {
            toast.error("Error connecting to server!");
        }
    };

    return (
        <>
            <div className="container d-flex justify-content-center align-items-center min-vh-100 py-5">
                <div className="card p-4 shadow-sm w-100" style={{ maxWidth: '650px' }}>
                    <h2 className="text-center mb-5">Add New Category</h2>
                    
                    <form onSubmit={handleFormSubmit}>
                        <div className="row mb-3 align-items-center">
                            <label className="col-sm-4 col-form-label text-sm-end fw-bold customLabel">Category Name</label>
                            <div className="col-sm-8">
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="Enter Category name (Letters only, no spaces)" 
                                    required
                                    value={categoryname} 
                                    onChange={handleCategoryNameChange} // Fixed validation trigger
                                />
                            </div>
                        </div>

                        <div className="row mb-4 align-items-center">
                            <label className="col-sm-4 col-form-label text-sm-end fw-bold customLabel">Image URL</label>
                            <div className="col-sm-8">
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="https://image-link.com" 
                                    required
                                    value={categoryimage} 
                                    onChange={handleCategoryImageChange} 
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-sm-8 offset-sm-4">
                                <button type="submit" className="form-control" style={{ backgroundColor: "#febd69" }}>
                                    Add Category
                                </button>
                            </div>
                        </div>
                    </form>

                    <br />
                    <hr />
                    <br />

                    {/* Separate Delete Section */}
                    <div>
                        <div className="row mb-3 align-items-center">
                            <label className="col-sm-4 col-form-label text-sm-end fw-bold customLabel">
                                Manage Categories
                            </label>
                            <div className="col-sm-8 d-flex flex-column align-items-start">
                                <select 
                                    className="form-select mb-2" 
                                    style={{ width: '100%', height: '38px' }}
                                    value={selectedcategory} 
                                    onChange={(e) => setSelectedCategory(e.target.value)}
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

                        <div className="row">
                            <div className="col-sm-8 offset-sm-4">
                                {/* FIXED: Changed type to "button" to separate it completely from form submissions */}
                                <button 
                                    type="button" 
                                    onClick={deleteCategory}
                                    className="form-control" 
                                    style={{ backgroundColor: "#febd69" }}
                                >
                                    Delete Category
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}