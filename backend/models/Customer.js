const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const customerSchema = new mongoose.Schema(
  {
    cus_id: {
      type: String,
    },
    image: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: false,
    },
    cus_person: {
      type: String,
      // required: true,
    },
    com_name: {
      type: String,
      // required: true,
    },
    date: {
      type: Date,
      // required: true,
    },
    email: {
      type: String,
      // required: true,
      unique: true,
      lowercase: true,
    },
    mobile: {
      type: Number,
    },
  },);

  
  customerSchema.plugin(AutoIncrement, { inc_field: 'cus_Id' });
const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;
