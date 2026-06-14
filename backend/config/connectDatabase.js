const mongoose = require('mongoose');

const connectDatbase = () => {

 mongoose.connect(process.env.DB_URL).then((con)=>{
    console.log('Mongo DB connected to the host'+con.connection.host);
 })
};
module.exports = connectDatbase;  //names export 