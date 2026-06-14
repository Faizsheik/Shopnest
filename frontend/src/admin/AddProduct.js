import React from 'react';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AddProduct() {
    const [productname, setProductName] = useState("");
    const [productdes, setProductDes] = useState("");
    const [productseller, setProductSeller] = useState("");
    const [productprice, setProductPrice] = useState(0);
    const [productstock, setProductStock] = useState(0);
    const [productimage, setProductImage] = useState("");
    const [productdate, setProductDate] = useState("");

    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [selectedcategory, setSelectedCategory] = useState("");
    const [selectedSubCategory, setSelectedSubCategory] = useState("");

    useEffect(() => {
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
        fetchCategories();
    }, []);

    useEffect(() => {
        if (!selectedcategory) {
            setSubCategories([]);
            return;
        }
        const fetchSubCategories = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/getsubcategoryitems/${selectedcategory}`);
                if (response.ok) {
                    const data = await response.json();
                    setSubCategories(data.subCategoryItems || []);
                } else {
                    toast.error("Failed to fetch Sub Categories");
                }
            } catch (error) {
                toast.error("Error loading subcategories from server.");
            }
        };
        fetchSubCategories();
        setSelectedSubCategory(""); // Clear sub-category selection when parent changes
    }, [selectedcategory]);

    // --- REAL TIME INPUT HANDLERS ---

    const handleProductNameChange = (e) => {
        let val = e.target.value.replace(/[^a-zA-Z0-9\s]/g, ""); // Letters, numbers, spaces only
        if (val.startsWith(" ")) val = val.trimStart();         // Block leading space
        val = val.replace(/\s+/g, " ");                         // Flatten duplicate spacing
        setProductName(val);
    };

    const handleSellerChange = (e) => {
        let val = e.target.value.replace(/[^a-zA-Z0-9\s]/g, ""); 
        if (val.startsWith(" ")) val = val.trimStart();
        val = val.replace(/\s+/g, " ");
        setProductSeller(val);
    };

    const handlePriceChange = (e) => {
        const val = parseFloat(e.target.value);
        if (val < 0) return; // Block negative numbers
        setProductPrice(e.target.value);
    };

    const handleStockChange = (e) => {
        const val = parseInt(e.target.value, 10);
        if (val < 0) return; // Block negative numbers
        setProductStock(e.target.value);
    };

    const handleImageUrlChange = (e) => {
        const val = e.target.value.replace(/\s/g, ""); // Strip any spacing anywhere
        setProductImage(val);
    };

    // --- FORM SUBMISSION HANDLER ---

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        const trimmedName = productname.trim();
        const trimmedDes = productdes.trim();
        const trimmedSeller = productseller.trim();
        const trimmedImage = productimage.trim();

        // 1. Structural Empty Checks
        if (!trimmedName || !trimmedDes || !trimmedSeller || !trimmedImage || !productdate) {
            toast.error("Please fill in all required text fields.");
            return;
        }

        if (parseFloat(productprice) <= 0) {
            toast.error("Product price must be greater than 0.");
            return;
        }

        if (parseInt(productstock, 10) < 0) {
            toast.error("Stock level cannot be less than 0.");
            return;
        }

        // 2. Dropdown Validation Checks
        if (!selectedcategory) {
            toast.error("Please select a parent category.");
            return;
        }

        if (!selectedSubCategory) {
            toast.error("Please select a sub-category.");
            return;
        }

        // 3. Length Requirements
        if (trimmedDes.length < 15) {
            toast.error("Please provide a more descriptive summary (minimum 15 characters).");
            return;
        }

        // 4. URL Integrity Check
        if (!trimmedImage.startsWith("http://") && !trimmedImage.startsWith("https://")) {
            toast.error("Image link must be a valid URL starting with http:// or https://");
            return;
        }

        const newObj = {
            name: trimmedName,
            price: parseFloat(productprice),
            description: trimmedDes,
            ratings: 0,
            images: [{ image: trimmedImage }],
            categoryId: selectedcategory,
            subCategoryId: selectedSubCategory,
            seller: trimmedSeller,
            stock: parseInt(productstock, 10),
            numOfReviews: 0,
            createdAt: productdate
        };

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/addProduct`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(newObj)
            });

            if (response.ok) {
                toast.success("Product added successfully!");
                setProductName("");
                setProductDes("");
                setProductSeller("");
                setProductPrice(0);
                setProductStock(0);
                setProductImage("");
                setProductDate("");
                setSelectedCategory("");
                setSelectedSubCategory("");
            } else {
                toast.error("Failed to add the product");
            }
        } catch (error) {
            toast.error("Error connecting to server!");
        }
    };

    return (
        <>
            <div className="container d-flex justify-content-center align-items-center min-vh-100 py-5">
                <div className="card p-4 shadow-sm w-100" style={{ maxWidth: '650px' }}>
                    <h2 className="text-center mb-5">Add New Product</h2>
                    <form onSubmit={handleFormSubmit}> 
                        
                        {/* Product Name */}
                        <div className="row mb-3 align-items-center">
                            <label className="col-sm-4 col-form-label text-sm-end fw-bold">Product Name</label>
                            <div className="col-sm-8">
                                <input type="text" className="form-control" placeholder="Enter product name" required value={productname} onChange={handleProductNameChange} />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="row mb-3 align-items-center">
                            <label className="col-sm-4 col-form-label text-sm-end fw-bold">Description</label>
                            <div className="col-sm-8">
                                <textarea className="form-control" rows="3" placeholder="Enter description (min 15 characters)" required value={productdes} onChange={(e) => setProductDes(e.target.value)}></textarea>
                            </div>
                        </div>

                        {/* Seller */}
                        <div className="row mb-3 align-items-center">
                            <label className="col-sm-4 col-form-label text-sm-end fw-bold">Seller</label>
                            <div className="col-sm-8">
                                <input type="text" className="form-control" placeholder="Seller name" required value={productseller} onChange={handleSellerChange} />
                            </div>
                        </div>

                        {/* Price */}
                        <div className="row mb-3 align-items-center">
                            <label className="col-sm-4 col-form-label text-sm-end fw-bold">Price ($)</label>
                            <div className="col-sm-8">
                                <input type="number" step="0.01" className="form-control" placeholder="0.00" required value={productprice} onChange={handlePriceChange} />
                            </div>
                        </div>

                        {/* Stock */}
                        <div className="row mb-3 align-items-center">
                            <label className="col-sm-4 col-form-label text-sm-end fw-bold">Stock</label>
                            <div className="col-sm-8">
                                <input type="number" className="form-control" placeholder="Quantity" required value={productstock} onChange={handleStockChange} />
                            </div>
                        </div>

                        {/* Image URL */}
                        <div className="row mb-4 align-items-center">
                            <label className="col-sm-4 col-form-label text-sm-end fw-bold">Image URL</label>
                            <div className="col-sm-8">
                                <input type="text" className="form-control" placeholder="https://image-link.com" required value={productimage} onChange={handleImageUrlChange} />
                            </div>
                        </div>

                        {/* Category Dropdown */}
                        <div className="row mb-3 align-items-center">
                            <label className="col-sm-4 col-form-label text-sm-end fw-bold">Category Name</label>
                            <div className="col-sm-8 d-flex flex-column align-items-start">
                                <select className="form-select mb-2" style={{ width: '100%', height: '38px' }} required value={selectedcategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                                    <option value="">-- Select a Category --</option>
                                    {categories.map((category) => (
                                        <option key={category._id} value={category._id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Sub Category Dropdown - Label Fixed */}
                        <div className="row mb-3 align-items-center">
                            <label className="col-sm-4 col-form-label text-sm-end fw-bold">Sub Category Name</label>
                            <div className="col-sm-8 d-flex flex-column align-items-start">
                                <select className="form-select mb-2" style={{ width: '100%', height: '38px' }} required value={selectedSubCategory} onChange={(e) => setSelectedSubCategory(e.target.value)}>
                                    <option value="">-- Select a Sub Category --</option>
                                    {subCategories.map((subcategory) => (
                                        <option key={subcategory._id} value={subcategory._id}>
                                            {subcategory.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Ratings (Read-only setup) */}
                        <div className="row mb-4 align-items-center">
                            <label className="col-sm-4 col-form-label text-sm-end fw-bold">Ratings</label>
                            <div className="col-sm-8">
                                <input type="number" className="form-control" value={0} disabled placeholder="Ratings" />
                            </div>
                        </div>

                        {/* Reviews Count (Read-only setup) */}
                        <div className="row mb-4 align-items-center">
                            <label className="col-sm-4 col-form-label text-sm-end fw-bold">Number of reviews</label>
                            <div className="col-sm-8">
                                <input type="number" className="form-control" placeholder="reviews" value={0} disabled />
                            </div>
                        </div>

                        {/* Created At Timestamp */}
                        <div className="row mb-4 align-items-center">
                            <label className="col-sm-4 col-form-label text-sm-end fw-bold">Created At</label>
                            <div className="col-sm-8">
                                <input type="datetime-local" className="form-control" required value={productdate} onChange={(e) => setProductDate(e.target.value)} />
                            </div>
                        </div>

                        {/* Submit Action */}
                        <div className="row">
                            <div className="col-sm-8 offset-sm-4">
                                <button type="submit" className="form-control fw-bold" style={{ backgroundColor: "#febd69" }}>
                                    Add product
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}