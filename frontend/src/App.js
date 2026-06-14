import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import './App.css';
import {toast,ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useState,useEffect} from 'react'

//--- Components & Layout ---
import Header from './components/Header'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute';


//public pages
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetails';
import ViewCategory from './pages/ViewCategory';
import ViewSubCategory from './pages/ViewSubCategory'
import Cart from './pages/Cart';


//admin
import AdminDashboard from './admin/AdminDashboard'
import AddProduct from './admin/AddProduct'
import DeleteProduct from './admin/DeleteProducts';
import AddCategory from './admin/AddCategory';
import AddSubCategory from './admin/AddSubCategory';
import ViewProducts from './admin/ViewProducts';
import OutOfStockProducts from './admin/OutOfStockProducts'
import ViewOrders from './admin/ViewOrders'


// --- Authentication Pages ---
import Register from './Authentication/Register'
import Login from './Authentication/Login'

// -- user pages --- 
import ShippingDetails from './pages/ShippingDetails'
import OrderSummary from './pages/OrderSummary'
import OrderSuccess from './pages/OrderSuccess';
import Payment from './pages/Payment';
import OrderHistory from './pages/OrderHistory';
import ProductReview from './pages/ProductReview';

function App() {

  // --- global states ---  
  const [cartItems, setCartItems] = useState(() => {
  const savedCart = localStorage.getItem("cartItems");
  return savedCart ? JSON.parse(savedCart) : [];
  });


  // --- auth states ---
  const[token,setToken]=useState(localStorage.getItem("token"));
  const[username,setUserName]=useState(localStorage.getItem("username"));
  const [role, setRole] = useState(localStorage.getItem("role"));

  // --- if the user is not logged in, clear the cart items --- 
  useEffect(() => {

    async function fetchUserCart() {
      if (!token) {
        setCartItems([]);
        return;
      }
      
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/getCartDetails`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();

        if (res.ok && data.items) {
          localStorage.setItem("cartItems", JSON.stringify(data.items));
          setCartItems(data.items); // Sync globally across Header and Cart pages
        }
      } catch (error) {
        console.error("Failed sync error: ", error.message);
      }
    }

    fetchUserCart();
  }, [token]);


  return (
    <div className="App">
    <ToastContainer position="top-right" autoClose={3000} theme="colored" />

    
      <Router>
         <div>

          {/* Navigation Bar */}
          <Header cartItems={cartItems}
           setCartItems={setCartItems}
           token={token} setToken={setToken}
           username={username}
           setUserName={setUserName}
           role={role}
           setRole={setRole}/>

          <Routes>
              
              {/* Public Routes */}
              <Route path="/viewcategory" element={<ViewCategory/>}/>
              <Route path="/subcategory" element={<ViewSubCategory/>}/>
              <Route path="/" element={<Home cartItems={cartItems}  />}/>
              <Route path="/search" element={<Home/>}/>
              <Route path="/product/:id" element={<ProductDetail  cartItems={cartItems}  setCartItems={setCartItems} token={token} setToken={setToken}/>}/> 
              <Route path="/cart" element={<Cart cartItems={cartItems}  setCartItems={setCartItems}/>}/>
              <Route  path="/viewcategory" element={<ViewCategory/>}></Route>
              <Route path="/viewsubcategory/:categoryId" element={<ViewSubCategory />} />

              {/* Authentication Routes */}
              <Route path="/register" element={<Register/>}/>
              <Route path="/login" element={<Login  setToken={setToken}  setUserName={setUserName} setRole={setRole}/>}/>

              {/* Authentication User Routes */}
              <Route path="/shippingdetails" element={<ShippingDetails/>}/>
              <Route path="/ordersummary" element={<OrderSummary cartItems={cartItems}/>}></Route>
              <Route path="/success" element={<OrderSuccess setCartItems={setCartItems}/>}></Route>
              <Route path="/payment" element={<Payment />} />
              <Route path="/orderhistory" element={<OrderHistory />} />
              <Route path="/productreview/:id"element={<ProductReview/>}/>


              {/* Protected Admin Routes */}
              <Route path="/admin/*" element={
                    <ProtectedRoute role={role} isAdminRequired={true}>
                      <Routes>
                        <Route path="" element={<AdminDashboard/>}/>
                        <Route path="addproduct" element={<AddProduct/>}/>
                        <Route path="deleteproduct" element={<DeleteProduct/>}/>
                        <Route path="addcategory" element={<AddCategory/>}/>
                        <Route path="addsubcategory" element={<AddSubCategory/>}/>
                        <Route path="outofstockproducts" element={<OutOfStockProducts/>}/>
                        <Route path="vieworders" element={<ViewOrders/>}/>
                        <Route path="viewproducts" element={<ViewProducts/>}/>
                      </Routes>
                    </ProtectedRoute>
              } />
          </Routes>

          </div>
      </Router>


      {/* Footer */}
      <Footer/>
    </div>
  );
}

export default App;
