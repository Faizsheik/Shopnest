
import React,{useState,useEffect} from "react";
import {toast} from "react-toastify";
import {useParams,Link} from "react-router-dom";

export default function ProductReview()
{
    const {id} = useParams();
    const token = localStorage.getItem('token');

    //review form stated
    const [rating,setRating] = useState(0);
    const[product,setProduct] = useState([]);
    const [hoverRating, setHoverRating] = useState(0);
    const [description, setDescription] = useState('');
    const [title, setTitle] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);


    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/product/${id}`)
            .then(res => res.json())
            .then(res => {
                setProduct(res);
                
            })
            .catch(err => {
                console.error("Fetch error for products:", err);
                
            });
    }, [id]);    

    const starTooltips = {
        1: 'Poor',
        2: 'Fair',
        3: 'Average',
        4: 'Very Good',
        5: 'Excellent'
    }

    //helper function
    const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
            resolve(fileReader.result); // This is the base64 string
        };
        fileReader.onerror = (error) => {
            reject(error);
        };
    });
};


    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if(rating == 0)
        {
            toast.error("please provide a star rating first");
            return;
        }

        try
        {
            let base64Image = null;
        
                // If an image is selected, convert it to a Base64 string first
                if (selectedImage) {
                    base64Image = await convertToBase64(selectedImage);
                }
            const reviewData={
                productId: id,
                rating: Number(rating),
                description: description,
                title: title,
                image: base64Image
            } 


            const res = await fetch(`${process.env.REACT_APP_API_URL}/createproductreview/${id}`,{
                method: 'POST',
                 headers: {
                'Content-Type': 'application/json',     // Tell the backend JSON data is coming
                'Authorization': `Bearer ${token}`      // Include your auth token
            },
            body: JSON.stringify(reviewData)
            })
            const data =  await res.json();
            if (res.ok) 
            {
            toast.success("Thank you!!  Review submitted successfully!");
            setRating(0);
            setDescription('');
            setTitle('');
            setSelectedImage(null);
            } 
            else 
            {
                console.error(data.message || "Failed to submit the review");
                toast.error("Failed to submit review");
            }

            }
        catch(error)
        {
                console.error(error.message || "Error occured due to server error");
                toast.error("An error occurred. Please try again.");

        }
    }


    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light px-3">
        <div className="review-card border rounded bg-white shadow-sm  w-50 mt-4">

            {product && product.product ? (
                <div className="d-flex align-items-center p-3 mb-4 border rounded bg-white shadow-sm">
                    <div style={{ width: '90px', height: '90px', overflow:"hidden"}} className="d-flex align-items-center justify-content-center border rounded mr-3">
                        <img 
                            src={product.product.images?.[0]?.image} 
                            alt={product.product.name || "Product"} 
                            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                        />
                    </div>
                    <div>
                        <h4 className="h5 mb-1 font-weight-normal text-dark">
                            {product.product.name}
                        </h4>
                    </div>
                </div>
            ) : (
                <div className="p-3 mb-4 text-muted text-center">Loading product details...</div>
            )}


            {/* --- Rate This Product (Stars) Section --- */}
            <div className="p-4 border-bottom">
                <h5 className="mb-3 text-secondary font-weight-normal" style={{ fontSize: '22px', color: '#212121' }}>Rate this product</h5>
                <div className="d-inline-block position-relative">
                    <div className="d-flex" style={{ gap: '12px' }}>
                        {[1, 2, 3, 4, 5].map((starValue) => (
                            <div 
                                key={starValue} 
                                className="position-relative"
                                onMouseEnter={() => setHoverRating(starValue)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setRating(starValue)}
                                style={{ cursor: 'pointer' }}
                            >
                                <span 
                                    className="display-4" 
                                    style={{ 
                                        color: starValue <= (hoverRating || rating) ? '#FFD700' : '#E0E0E0',
                                        fontSize: '32px',
                                        transition: 'color 0.1s ease'
                                    }}
                                >
                                    &#9733;
                                </span>
                                
                                {/* Custom Tooltip Dropdown matching 'Very Good' popup style */}
                                {hoverRating === starValue && (
                                    <div className="bg-dark text-white text-nowrap rounded px-3 py-1 position-absolute font-weight-bold" 
                                         style={{ bottom: '135%', left: '50%', transform: 'translateX(-50%)', fontSize: '12px', zIndex: 10 }}>
                                        {starTooltips[starValue]}
                                        <div className="position-absolute" 
                                             style={{ top: '100%', left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: '6px solid #212121' }}></div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- Review Text Fields Section --- */}
            <div className="p-4">
                <h5 className="mb-3 text-secondary font-weight-normal" style={{ fontSize: '22px', color: '#212121' }}>Review this product</h5>
                <form onSubmit={handleReviewSubmit}>
                    
                    {/* Description Textarea Field */}
                    <div className="border rounded p-3 mb-0" style={{ borderBottom: 'none', borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}>
                        <label htmlFor="review-desc" className="small d-block font-weight-bold mb-1" style={{ color: '#f44336', fontSize: '13px' }}>Description</label>
                        <textarea 
                            id="review-desc" 
                            className="form-control border-0 p-0 shadow-none" 
                            placeholder="Description..." 
                            rows="5" 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            style={{ resize: 'none', fontSize: '15px', color: '#212121' }}
                            required
                        ></textarea>
                    </div>

                    <br/>

                    {/* Title Input Field */}
                    <div className="border rounded p-3 mb-4" style={{ borderTop: '1px solid #eeeeee', borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
                        <label htmlFor="review-title" className="small d-block font-weight-bold mb-1" style={{ color: '#2196f3', fontSize: '13px' }}>Title (optional)</label>
                        <input 
                            type="text" 
                            id="review-title" 
                            className="form-control border-0 p-0 shadow-none bg-transparent" 
                            placeholder="Review title..." 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            style={{ fontSize: '15px', color: '#212121' }}
                        />
                    </div>

                    {/* Gray Square Camera Upload Area */}
                    <div className="d-flex align-items-center">
                        <label className="d-flex flex-column align-items-center justify-content-center border rounded position-relative m-0" 
                               style={{ width: '80px', height: '80px', backgroundColor: '#eeeeee', cursor: 'pointer' }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#757575" strokeWidth="2" className="mb-1">
                                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                                <circle cx="12" cy="13" r="4"></circle>
                            </svg>
                            <span className="position-absolute font-weight-bold" style={{ fontSize: '12px', top: '42px', left: '32px', color: '#757575', backgroundColor: '#eeeeee', padding: '0 2px' }}>+</span>
                            <input 
                                type="file" 
                                className="d-none" 
                                accept="image/*" 
                                onChange={(e) => setSelectedImage(e.target.files[0])} 
                            />
                        </label>
                        
                        {/* Selected File Badge */}
                        {selectedImage && (
                            <div className="ml-3 text-muted small border p-2 rounded bg-light d-flex align-items-center">
                                <span className="text-truncate mr-2" style={{ maxWidth: '150px' }}>{selectedImage.name}</span>
                                <button type="button" className="close text-danger" onClick={() => setSelectedImage(null)} aria-label="Remove file">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button type="submit" className="btn btn-warning font-weight-bold text-dark mt-4 px-4 shadow-sm" style={{ minWidth: '160px' }}>
                        Submit Review
                    </button>
                </form>
            </div>
        </div>
    </div>

    );


          

}