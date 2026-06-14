import {Link} from 'react-router-dom';
import {useState,useEffect} from 'react';

export default function ProductCard({product})
{
  const [numOfOrder,setNumOfOrder] = useState(0);

    
 useEffect(() => {
    const fetchOrders = async () => 
    {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/getProductSalesCount/${product._id}`, 
          { method: "GET" }
        );

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch the sales count");
        }
        setNumOfOrder(data.count);
      } catch (error) {
        console.error("Error fetching sales count:", error.message); 
      }
    };

    fetchOrders();
  }, [product._id]);


    return <div className="col-sm-12 col-md-6 col-lg-3 my-3">
          <div className="card p-3 rounded">

           
            <img
            className="card-img-top mx-auto"
            src={product.images[0].image}
            alt={product.name} 
          />

            <div className="card-body d-flex flex-column">

                <h5 className="card-title">
                <Link to={"/product/"+product._id}>{product.name}</Link>
                </h5>

                {/* Ratings */}
                <div className="ratings mt-auto">
                  <div className="rating-outer">
                    <div className="rating-inner" style={{width: `${product.ratings/5 * 100}%`}}></div> 
                  </div>  <span></span>
                  <span className="ml-2" style={{ color: numOfOrder > 0 ? '#2ec4b6' : 'inherit', fontWeight: '500' }}>
                    ({numOfOrder})
                  </span>
                </div>


              {/* how rating works behind CSS -------
              .rating-outer {
                  width: 100px;
                  height: 20px;
                  background: url('/images/star-empty.png') repeat-x;
                }

                .rating-inner {
                  height: 20px;
                  background: url('/images/star-filled.png') repeat-x;
                } */}

              <p className="card-text">{product.price}</p>
              <Link to={"/product/"+product._id} id="view_btn" className="btn btn-block">View Link</Link>

            </div>
          </div>
        </div>
}