import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; 
export default function Shipping() {
  const navigate = useNavigate();

  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    phoneNo: "",
    address: "",
    city: "",
    postalCode: "",
    state: "",
    country: "India"
  });

  function onChange(e) {
    const { name, value } = e.target;

    if (name === "phoneNo") {
      const numericValue = value.replace(/\D/g, ""); // Remove non-numeric characters
      if (numericValue.length > 10) return; // Prevent typing past 10 digits
      setShippingInfo({ ...shippingInfo, [name]: numericValue });
      return;
    }

    // 2. Dynamic Postal Code Input Validation (Enforces numbers only and max 6 digits for India)
    if (name === "postalCode") {
      const numericValue = value.replace(/\D/g, ""); 
      if (numericValue.length > 6) return; // Stop at 6 digits
      setShippingInfo({ ...shippingInfo, [name]: numericValue });
      return;
    }


    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value
    });
  }

  function submitHandler(e) {
    e.preventDefault();

    


    //validation
    // 1. Validate Full Name (Should not just be spaces or numbers)
    const nameRegex = /^[a-zA-Z\s]{3,40}$/;
    if (!nameRegex.test(shippingInfo.fullName.trim())) {
      toast.error("Please enter a valid full name (letters only, min 3 characters).");
      return;
    }

    // 2. Validate Phone Number Length
    if (shippingInfo.phoneNo.length !== 10) {
      toast.error("Phone number must be exactly 10 digits.");
      return;
    }

    // 3. Indian Phone Format Check (Must start with 6, 7, 8, or 9)
    if (!/^[6-9]\d{9}$/.test(shippingInfo.phoneNo)) {
      toast.error("Please enter a valid Indian phone number starting with 6-9.");
      return;
    }

    // 4. Validate Address (Min length check)
    if (shippingInfo.address.trim().length < 10) {
      toast.error("Please enter a more detailed address (min 10 characters).");
      return;
    }

    // 5. Validate Postal Code (Must be exactly 6 digits for India PIN code)
    if (shippingInfo.postalCode.length !== 6) {
      toast.error("Postal code (PIN code) must be exactly 6 digits.");
      return;
    }

    // 6. Validate City and State (Should not contain numeric values)
    const alphaRegex = /^[a-zA-Z\s]+$/;
    if (!alphaRegex.test(shippingInfo.city.trim())) {
      toast.error("City name should contain letters only.");
      return;
    }
    if (!alphaRegex.test(shippingInfo.state.trim())) {
      toast.error("State name should contain letters only.");
      return;
    }

    localStorage.setItem(
      "shippingInfo",
      JSON.stringify(shippingInfo)
    );

    navigate("/ordersummary");
   //navigate("/payment");
  }

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100 py-5">
      <div
        className="card p-4 shadow-sm w-100"
        style={{
          maxWidth: "650px",
          borderRadius: "12px",
          background: "#ffffff",
          border: "1px solid #e6e6e6",
          boxShadow: "0 6px 16px rgba(0,0,0,0.08)"
        }}
      >
        <h2 className="text-center mb-5">Shipping Details</h2>

        <form onSubmit={submitHandler}>
          <div className="row mb-3 align-items-center">
            <label className="col-sm-4 col-form-label text-sm-end fw-bold" style={{textAlign:"left"}}>
              Full Name:
            </label>
            <div className="col-sm-8">
              <input
                type="text"
                className="form-control"
                name="fullName"
                value={shippingInfo.fullName}
                onChange={onChange}
                placeholder="Enter full name"
                required
              />
            </div>
          </div>

          <div className="row mb-3 align-items-center">
            <label className="col-sm-4 col-form-label text-sm-end fw-bold" style={{textAlign:"left"}}>
              Phone Number:
            </label>
            <div className="col-sm-8">
              <input
                type="tel"
                className="form-control"
                name="phoneNo"
                maxLength={10}
                value={shippingInfo.phoneNo}
                onChange={onChange}
                placeholder="Enter phone number"
                required
              />
            </div>
          </div>

          <div className="row mb-3 align-items-center">
            <label className="col-sm-4 col-form-label text-sm-end fw-bold" style={{textAlign:"left"}}>
              Address:
            </label>
            <div className="col-sm-8">
              <textarea
                className="form-control"
                name="address"
                value={shippingInfo.address}
                onChange={onChange}
                placeholder="Enter address"
                rows="3"
                required
              />
            </div>
          </div>

          <div className="row mb-3 align-items-center">
            <label className="col-sm-4 col-form-label text-sm-end fw-bold" style={{textAlign:"left"}}>
              City:
            </label>
            <div className="col-sm-8">
              <input
                type="text"
                className="form-control"
                name="city"
                value={shippingInfo.city}
                onChange={onChange}
                placeholder="Enter city"
                required
              />
            </div>
          </div>

          <div className="row mb-3 align-items-center">
            <label className="col-sm-4 col-form-label text-sm-end fw-bold" style={{textAlign:"left"}}>
              Postal Code:
            </label>
            <div className="col-sm-8">
              <input
                type="text"
                className="form-control"
                name="postalCode"
                value={shippingInfo.postalCode}
                onChange={onChange}
                placeholder="Enter postal code"
                required
              />
            </div>
          </div>

          <div className="row mb-3 align-items-center">
            <label className="col-sm-4 col-form-label text-sm-end fw-bold" style={{textAlign:"left"}}>
              State:
            </label>
            <div className="col-sm-8">
              <input
                type="text"
                className="form-control"
                name="state"
                value={shippingInfo.state}
                onChange={onChange}
                placeholder="Enter state"
                required
              />
            </div>
          </div>

          <div className="row mb-4 align-items-center">
            <label className="col-sm-4 col-form-label text-sm-end fw-bold" style={{textAlign:"left"}}>
              Country:
            </label>
            <div className="col-sm-8">
              <input
                type="text"
                className="form-control"
                name="country"
                value={shippingInfo.country}
                onChange={onChange}
                required
              />
            </div>
          </div>

          <div className="row">
            <div className="col-sm-8 offset-sm-4">
              <button
                type="submit"
                className="form-control"
                style={{ backgroundColor: "#febd69" }}
              >
                Continue
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}