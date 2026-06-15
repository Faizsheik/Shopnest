
const express = require('express');
const app = express();
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const connectDatbase = require('./config/connectDatabase')
dotenv.config({path:path.join(__dirname,'config','config.env')})
const products = require('./routes/product');
const orders = require('./routes/order');
const users = require('./routes/user')
const addproduct = require('./routes/product')
const cart = require('./routes/cart')
const category = require('./routes/category')
const payment = require('./routes/payment')
const review = require('./routes/review')
connectDatbase();

// middleware
app.use(express.json({limit:'50mb'}))
// app.use(cors()); 
//For Deployment
app.use(cors({
    origin: [
      "http://localhost:3000",
      "https://shopnest-tau.vercel.app"
    ],
    credentials: true
}))

// Add a root route handler
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: "ShopNest Backend API is running smoothly!"
    });
});

// set response header
app.use('/api/v1/',products);
app.use('/api/v1/',orders);
app.use('/api/v1/',addproduct);
app.use('/api/v1/',users);
app.use('/api/v1/',cart);
app.use('/api/v1/',category);
app.use('/api/v1/',payment)
app.use('/api/v1/',review);

//app.use('/api/v1/',login);
app.listen(process.env.PORT,()=>{
    console.log(`server listening to port ${process.env.PORT} in  ${process.env.NODE_ENV}`)
})

