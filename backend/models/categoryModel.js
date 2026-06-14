const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
     name: String,
     images : [
        {
            image: String
        }
    ],
  }
);

module.exports = mongoose.model("category", categorySchema);
