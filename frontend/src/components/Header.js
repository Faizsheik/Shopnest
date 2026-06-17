import Search from "./Search"
import { Link, useNavigate } from 'react-router-dom'

export default function Header({ cartItems, setCartItems, token, setToken, username, setUserName, role, setRole }) {
  const navigate = useNavigate();
  
  // -- Log out functionality --
  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    localStorage.removeItem("cartItems");

    setCartItems([]);
    setToken(null);
    setUserName(null);
    setRole(null);
    navigate("/login");
  }

  const isLoggedIn = !!token;

  return (
    <nav className="navbar navbar-expand-lg row bg-dark py-3 align-items-center">
      <div className="col-12 col-md-3 d-flex align-items-center">
        <div className="navbar-brand">
          <Link to="/">
            <img width="70px" src="../images/logo_main.png" alt="logo" />
          </Link>
        </div>
      </div>

      <div className="col-12 col-md-4 mt-2 mt-md-0">
        <Search />
      </div>

      {/* Changed col-md-4 to col-md-5 to give it more horizontal breathing room, removed flex-wrap */}
      <div className="col-12 col-md-5 mt-3 mt-md-0 d-flex justify-content-between align-items-center">
        {/* 1. User Greeting / Sign In */}
        <div className="mx-1 text-nowrap">
          {isLoggedIn && username ? (
            <span className="text-white">
              Hello, <strong>{username}</strong>
            </span>
          ) : (
            <Link to="/login" className="text-white text-decoration-none">
              Hello, Sign in!
            </Link>
          )}
        </div>

        {/* categories */}
        <div className="mx-1 text-nowrap">
          <Link to="/viewcategory" className="text-white text-decoration-none">
            Category
          </Link>
        </div>

        {/* 2. Admin Dashboard Link */}
        {isLoggedIn && role === 'admin' && (
          <div className="mx-1 text-nowrap">
            <Link to="/admin" className="text-white text-decoration-none">
              Dashboard
            </Link>
          </div>
        )}

        {/* 3. Products Link */}
        <div className="mx-1 text-nowrap">
          <Link to="/" className="text-white text-decoration-none">
            products
          </Link>
        </div>

        {/* 3. Orders Link */}
        <div className="mx-1 text-nowrap">
          {isLoggedIn ? (
            <Link to="/orderhistory" className="text-white text-decoration-none">
              Orders
            </Link>
          ) : (
            <Link to="/login" className="text-white text-decoration-none">
              Orders
            </Link>
          )}
        </div>

        {/* 4. Cart Link */}
        <div className="mx-1 text-nowrap">
          {!isLoggedIn ? (
            <Link to="/login" className="text-white text-decoration-none">
              <span id="cart">Cart</span>
              <span className="ml-1 badge badge-pill badge-light text-dark" id="cart_count">0</span>
          </Link>
          ) : (
            <Link to="/cart" className="text-white text-decoration-none">
            <span id="cart">Cart</span>
            <span className="ml-1 badge badge-pill badge-warning text-dark" id="cart_count">
              {/* Safely counts array items without risking a JSON parsing exception */}
              {Array.isArray(cartItems) ? cartItems.length : 0}
            </span>
          </Link>
          )}
        </div>

        {/* 5. Logout Option */}
        {isLoggedIn && (
          <div className="mx-1 text-nowrap">
            <span
              onClick={handleLogout}
              className="text-danger text-decoration-none"
              style={{ cursor: 'pointer', fontWeight: '500' }}
            >
              Logout
            </span>
          </div>
        )}
      </div>
    </nav>
  );
}