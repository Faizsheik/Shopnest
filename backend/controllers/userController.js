require('dotenv').config();
const userModel = require('../models/userModel') 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


// --- Registration --- 

exports.createUserDetails = async (req, res) => {
    try {
      const { username, password, email, mobile } = req.body;
      const cleanUsername = username.trim();
      const cleanPassword = password.trim();
      const cleanEmail = email ? email.toLowerCase().trim() : undefined;

      // --- hashing password ---
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(cleanPassword, salt);

      // --- check if the user already exists ---
      const existingEmail = await userModel.findOne({ email: email });
      if (existingEmail) 
      {
        return res.status(409).json({ 
          error: "An account with this email address already exists." 
        });
      }

       // --- new user registration ---
      const newUser = await userModel.create({
          username: cleanUsername,
          password: hashedPassword,
          email: cleanEmail,
          mobile: mobile
      });

      res.status(201).json({ message: "User registered successfully", user: newUser });} 
      catch (error) 
      {
        res.status(400).json({ error: error.message });
        //mongodb error, 
        //database serevr goes offline
        //network drops 
      }
};



// -- Login --

exports.loginUserDetails = async (req, res) => {
    try 
    {
          const{identifier,password} = req.body;
          const identifierClean = identifier;
          const cleanPassword = password.trim();

  
          const user = await userModel.findOne({
            $or: [
              { email: identifierClean },
              { mobile: identifierClean }
            ]
          });

          // --User is not registered --
          if(!user) {
            return res.status(400).json({message:"User is not registered!"});
          }

          //compare password
          const isMatch = await bcrypt.compare(cleanPassword, user.password);
          if(!isMatch)
          {
            return res.status(400).json({message:"Incorrect password"});
          }


          //if user is found and password is matched with DB,
          const token = jwt.sign({
            id:user._id,email:user.email},
            process.env.JWT_SECRET,
            {expiresIn: "1h"}
          );

          res.json(
            {
              message: "Login successfully",token,
              user: {
                username: user.username,
                role:user.role
              }
                
            }
          );
        
    } 
    catch (error) 
    {
          res.status(500).json({ error: error.message });
    }
};