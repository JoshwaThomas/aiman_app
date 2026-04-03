const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const productSchema = new mongoose.Schema(
  {
    productId: {
      type: Number,
      // required: false,
    },
    categoryId: {
      type: Number,
      required: false,
    },
    category: {
      type: String,
      // required: false,
    },
    type: {
      type: String,
      required: false,
    },
    price: {
      type: Number,
      required: false,
    },
  });

// module.exports = productSchema;
productSchema.plugin(AutoIncrement, { inc_field: 'productId' });
const Product = mongoose.model("Product", productSchema);
module.exports = Product;
