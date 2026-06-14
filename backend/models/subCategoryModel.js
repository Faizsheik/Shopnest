const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema(
  {
    name: String,
    categoryId:{
                     type: mongoose.Schema.Types.ObjectId,
                     ref:'category',
                     required:true
     
                 },
     images : [
        {
            image: String
        }
    ],
  }
);

module.exports = mongoose.model("subcategory", subCategorySchema);
