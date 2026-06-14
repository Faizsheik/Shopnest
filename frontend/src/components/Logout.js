import React, { useState, useEffect } from "react";

export default function Navbar({ setCartItems }) {
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    // Sync token state with localStorage on mount
    setToken(localStorage.getItem("token"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setCartItems([]); 
    setToken(null);   // update state so Logout disappears immediately
    window.location.href = "/login";
  };

  return (
    <>
      {token ? (
        <button onClick={handleLogout} className="btn btn-danger">
          Logout
        </button>
      ) : null}
    </>
  );
}
