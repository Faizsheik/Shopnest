
import React,{useState} from 'react';
import {Link} from 'react-router-dom'
import {toast} from 'react-toastify';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useNavigate } from "react-router-dom";


export default function Login({setToken,setUserName,setRole})
{

    const[usermobile,setUserMobile] = useState("");
    const[useremail,setUserEmail] = useState("");
    const[password,setPassword] = useState("");
    const [contactType, setContactType] = useState('email');

    const navigate = useNavigate();

     // error states
     const [passerror,setPasswordError] = useState("");
     const[emailerror,setEmailError] = useState("");

    //Validation

    //Validation - Email
    const validateEmail = (e) =>
    {
        let confirmemail = e.target.value.replace(/\s/g, "");
        if (/^\d/.test(confirmemail)) {
        // If it starts with a number, remove that first character
        confirmemail = confirmemail.substring(1);
    }
        setUserEmail(confirmemail);

    }

     // password validation
    const validatePassword = (e) =>
    {
      let confirmpass = e.target.value.replace(/\s/g, "");
      if (/^\d/.test(confirmpass)) 
        {
            // If it starts with a number, remove that first character
            confirmpass = confirmpass.substring(1);    
        }
      setPassword(confirmpass);
    }

   //--- BLUR HANDLERS FOR FIELD VALIDATION ---

    const handleEmailBlur = () =>
    {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(useremail.length>0 && !regex.test(useremail))
        {
            setEmailError("Please enter valid Email address")
            
        }
        else if(useremail.length === 0)
        {
           setEmailError("Please enter your Email address")
           
        }
        else
        {
            setEmailError("");
        }

    }


    const handlePasswordBlur = (e)=>{

        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        const result =  regex.test(password);

        if(password.length > 0 && !result)
        {
            setPasswordError("Password should contain atleast 8 characters ,one upper case, lowerc case, one special character, one number")   
        }
        else if(password.length === 0)
        {
            setPasswordError("Please enter your password")
        }
        else
        {
            setPasswordError("");

        }
    }

    
     // --- SUBMIT HANDLER ---

     const handleFormSubmit = async (e) => {
            e.preventDefault();
            
            if(passerror || emailerror)
            {
                toast.error("Please check your credentails.Username or Password is incorrect");
                return;
            }

            if(!useremail || !password)
            {
                toast.error("Please fill in all required fields.");
                return;

            }


            const newUser = {
                password: password.trim(),
                identifier: contactType === "email" ? useremail.toLowerCase().trim() : usermobile
            };

            try 
            {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/loginuser`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newUser)
                });

                if (response.ok) 
                {
                    const data = await response.json();
                    toast.success(data.message || "Logged in successfully!");
                    
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('username', data.user.username); 
                    localStorage.setItem("role", data.user.role); 

                    setToken(data.token); 
                    setUserName(data.user.username);
                    setRole(data.user.role);
                    
                    navigate('/');
                    setUserEmail("");
                    setUserMobile("");
                    setPassword("");
                    return;
                }

                    const data = await response.json();

                    // -- User name is not found
                    // -- user password is not correct
                    if(response.status === 400)
                    {
                        toast.error(data.error || "Kindly check your credentials");
                        setUserEmail("");
                        setUserMobile("");
                        setPassword("");
                    }
                    // Catches unexpected runtime backend issues handled
                    else
                    {
                        toast.error(data.error || "Internal server error occurred");
                        setUserEmail("");
                        setUserMobile("");
                        setPassword("");
                    }
                    
                } 
                catch (error) 
                {
                    // This catches network errors OR the manually thrown errors above
                    toast.error("Login failed. Please try again later");
                    setUserEmail("");
                    setUserMobile("");
                    setPassword("");

                    
                }
    };


    return (
        <>
            <div className="container d-flex justify-content-center align-items-center min-vh-100 py-5">
            <div className="card p-4 shadow-sm w-100" 
            style={{
            maxWidth: '650px',
            borderRadius: '12px',
            background: '#ffffff',
            border: '1px solid #e6e6e6',
            boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
            }}>
            
            
                <h2 className="text-center mb-5">Login</h2>
                <form onSubmit={handleFormSubmit}> 


                    <div className="row mb-3 align-items-center">
                        <label className="col-sm-4 col-form-label text-sm-end fw-bold customLabel" >Login with:</label>
                          <div className="col-sm-8 d-flex flex-column align-items-start">

                                    <select className="form-select mb-2 w-auto" style={{width:"20px"}}
                                        onChange={(e) => setContactType(e.target.value)}>
                                        <option value="email">Email Address</option>
                                        {/* <option value="phone">Mobile Number</option> */}
                                    </select>
                                    
                                    <div className="w-100 mt-2"> 
                                        {contactType === 'email' ? (
                                        <>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                placeholder="Enter email address" 
                                                value={useremail} 
                                                maxLength={30}
                                                onChange={validateEmail}
                                                onBlur={handleEmailBlur} 
                                                
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
                     

                    <div className="row mb-3 align-items-center">
                        <label className="col-sm-4 col-form-label text-sm-end fw-bold customLabel">Password:</label>
                        <div className="col-sm-8">
                            <input type="password" className="form-control" rows="3" placeholder="Enter your password"
                             value={password} 
                             onChange={validatePassword}
                             onBlur={handlePasswordBlur}
                             min={8}
                              />
                            {passerror && <small className="text-danger">{passerror}</small>}

                        </div>
                    </div>


                    <div className="row">
                        <div className="col-sm-8 offset-sm-4">
                        <button type="submit" className="form-control" style={{backgroundColor:"#febd69"}}>
                                Login
                            </button>  
                        </div>
                    </div>

                    <br/>

                    <div className="row ">
                        <div className="col-sm-8 offset-sm-4">
                          <p>New user ?  <span><Link to="/register">Create account</Link></span></p>
                        </div>
                       
                    </div>


                </form>
            </div>
        </div>


        </>
    )
}


