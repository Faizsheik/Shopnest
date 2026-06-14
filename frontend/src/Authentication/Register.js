import React,{ useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useNavigate } from "react-router-dom";

export default function Register() {

    const [usermobile, setUserMobile] = useState("");
    const [useremail, setUserEmail] = useState("");
    const [username, setUserName] = useState("");
    const [contactType, setContactType] = useState('email'); 
    const [password, setPassword] = useState("");
    const [confirmpassword, setConfirmPassword] = useState("");

    const navigate = useNavigate();

    // Error messages states
    const [passerror, setPasswordError] = useState("");
    const [confirmpasserror, setConfirmPasswordError] = useState("");
    const [emailerror, setEmailError] = useState("");
    const [usernameerror, setUsernameError] = useState("");

    // --- REAL TIME INPUT HANDLERS (BLOCKS SPACES INSTANTLY) ---

    const validateEmail = (e) => {
        let confirmemail = e.target.value.replace(/\s/g, ""); 
        if (/^\d/.test(confirmemail)) {
        // If it starts with a number, remove that first character
        confirmemail = confirmemail.substring(1);
    }
        setUserEmail(confirmemail);
    };

    const handleUsernameChange = (e) => {
        let confirmusername = e.target.value.replace(/\s/g, ""); 
        if (/^\d/.test(confirmusername)) {
        // If it starts with a number, remove that first character
        confirmusername = confirmusername.substring(1);
    }
    setUserName(confirmusername);
};

    const validatePassword = (e) => {
        let password = e.target.value.replace(/\s/g, ""); // Strip spaces instantly
        if (/^\d/.test(password)) 
        {
            // If it starts with a number, remove that first character
            password = password.substring(1);    
        }
    setPassword(password);
};

    const validateConfirmPassword = (e) => {
        const confirmpassword = e.target.value.replace(/\s/g, "");
        setConfirmPassword(confirmpassword);
    };


    //--- BLUR HANDLERS FOR FIELD VALIDATION ---

    const handleEmailBlur = () => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (useremail.length > 0 && !regex.test(useremail)) {
            setEmailError("Please enter valid Email address");
        } else if (useremail.length === 0) {
            setEmailError("Please enter your Email address");
        } else {
            setEmailError("");
        }
    };

    const handlePasswordBlur = () => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        const result = regex.test(password);

        if (password.length > 0 && !result) {
            setPasswordError("Password should contain atleast 8 character , one uppercase, lowercase, one special character, and one number");
        } else {
            setPasswordError("");
        }
    };

    const handleConfirmPasswordBlur = () => {
        if (confirmpassword.length > 0 && confirmpassword !== password) {
            setConfirmPasswordError("Passwords do not match");
        } else {
            setConfirmPasswordError("");
        }
    };

    const handleUsernameBlur = () => {
        const regex = /^[a-zA-Z][a-zA-Z0-9_-]{2,19}$/;
        if (username.length === 0) {
            setUsernameError("User name cannot be empty");
        } else if (username.length > 0 && !regex.test(username)) {
            setUsernameError("User name is not valid");
        } else {
            setUsernameError("");
        }
    };

    // --- SUBMIT HANDLER ---

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        // 1. Final sanity checks before API call
        if (passerror || confirmpasserror || usernameerror || emailerror) {
            toast.error("Please resolve all input error warnings first.");
            return;
        }

        if (!username || !password || (contactType === 'email' && !useremail)) {
            toast.error("Please fill in all required fields.");
            return;
        }

        const newUser = {
            username: username.trim(),
            password: password.trim(),
            ...(contactType === "email"
                ? { email: useremail.toLowerCase().trim() }
                : { mobile: usermobile })
        };

        try {
            // 2. Fire the network request and await the raw response
            const response = await fetch(`${process.env.REACT_APP_API_URL}/adduser`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser)
            });

            // 3. Handle a completely successful registration (Status 200-299)
            if (response.ok) {
                toast.success("Registered successfully!");
                navigate('/login');
                setUserEmail("");
                setUserMobile("");
                setUserName("");
                setPassword("");
                setConfirmPassword("");
                return;
            }

            // 4. If the server returned an error code, parse the error payload details
            const data = await response.json();

            console.log(data);

            if (response.status === 409) {
                // Shows the custom backend conflict string if it exists, or falls back to your message
                toast.error(data.error || "User already exists");
                setUserEmail("");
                setUserMobile("");
                setUserName("");
                setPassword("");
                setConfirmPassword("");
            } else {
                // Catches other explicit errors from the backend (e.g., 400 Bad Request or 500 Internal Error)
                toast.error(data.error || "Registration failed. Please check your credentials or try again later.");
            }

        } catch (error) {
            // 5. Catches total network dropouts (e.g., your local backend server is turned off/dead)
            toast.error("Error connecting to server.");
        }
    };


    return (
        <>
            <div className="container d-flex justify-content-center align-items-center min-vh-100 py-5">
                <div className="card p-4 shadow-sm w-100" style={{ maxWidth: '650px', borderRadius: '12px', background: '#ffffff', border: '1px solid #e6e6e6', boxShadow: '0 6px 16px rgba(0,0,0,0.08)' }}>
                    <h2 className="text-center mb-5">Register</h2>
                    <form onSubmit={handleFormSubmit}> 

                        {/* Contact Selector Fields */}
                        <div className="row mb-3">
                            <label className="col-sm-4 col-form-label text-sm-end fw-bold">Register with:</label>
                            <div className="col-sm-8 d-flex flex-column align-items-start">
                                <select className="form-select mb-2 w-auto" onChange={(e) => setContactType(e.target.value)}>
                                    <option value="email">Email Address</option>
                                </select>
                                
                                <div className="w-100 mt-2"> 
                                    {contactType === 'email' ? (
                                        <>
                                            <input 
                                                type="email" 
                                                className="form-control" 
                                                placeholder="Enter email address" 
                                                value={useremail} 
                                                maxLength={30}
                                                onChange={validateEmail}
                                                onBlur={handleEmailBlur} 
                                                required
                                            />
                                            {emailerror && <small className="text-danger">{emailerror}</small>}
                                        </>
                                    ) : (
                                        <PhoneInput 
                                            country={'in'} 
                                            value={usermobile} 
                                            onChange={(phone) => setUserMobile(phone)} 
                                            inputClass="form-control" 
                                            placeholder="Enter mobile number" 
                                            maxLength={15}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Username Input */}
                        <div className="row mb-3 align-items-center">
                            <label className="col-sm-4 col-form-label text-sm-end fw-bold">Username:</label>
                            <div className="col-sm-8">
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="Enter Username" 
                                    value={username}
                                    onChange={handleUsernameChange} // Connected handler
                                    onBlur={handleUsernameBlur} 
                                    required 
                                />
                                {usernameerror && <small className="text-danger">{usernameerror}</small>}
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="row mb-3 align-items-center">
                            <label className="col-sm-4 col-form-label text-sm-end fw-bold">Password:</label>
                            <div className="col-sm-8">
                                <input 
                                    type="password" 
                                    className="form-control" 
                                    placeholder="Enter your password"
                                    value={password} 
                                    onChange={validatePassword}
                                    onBlur={handlePasswordBlur}
                                    min={8}
                                    required
                                />
                                {passerror && <small className="text-danger">{passerror}</small>}
                            </div>
                        </div>

                        {/* Confirm Password Input */}
                        <div className="row mb-3 align-items-center">
                            <label className="col-sm-4 col-form-label text-sm-end fw-bold">Confirm password:</label>
                            <div className="col-sm-8">
                                <input 
                                    type="password" 
                                    className="form-control" 
                                    placeholder="Confirm password" 
                                    value={confirmpassword} 
                                    onChange={validateConfirmPassword}
                                    onBlur={handleConfirmPasswordBlur}
                                    required
                                />
                                {confirmpasserror && <small className="text-danger">{confirmpasserror}</small>}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="row">
                            <div className="col-sm-8 offset-sm-4">
                                <button type="submit" className="form-control fw-bold" style={{ backgroundColor: "#febd69" }}>
                                    Register
                                </button>   
                            </div>
                        </div>
                        <br/>

                        <div className="row">
                            <div className="col-sm-8 offset-sm-4">
                                <p>Already have an account? <span><Link to="/login">Sign in</Link></span></p>
                            </div>
                        </div>

                    </form>
                </div>
            </div>
        </>
    
        )
        };