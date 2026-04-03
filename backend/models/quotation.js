const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const quotationSchema = new mongoose.Schema(
    {
        q_Id: {
            type: Number,
            // required: false,
        },
        cus_Id: {
            type: Number,
            required: true,
        },
        cus_name: {
            type: String,
        },
        email: {
            type: String,
        },
        mobile: {
            type: Number
        },
        city: {
            type: String
        },
        rec_amt: {
            type: Number,
            // required: false,
        },
        bal_amt: {
            type: Number,
            required: false,
        },
        mop: {
            type: String,
            required: false,
        },
        product: [
            {
                categoryId: { type: String },
                type: { type: String },
                quantity: { type: String },
                price: {type: Number},
                remark: {type: String},
                // varient: { type: String },
            }
        ],
        netAmount: {
            type: Number,
            // required: false,
        },
        tax: {
            type: Number,
            required: false,
        },
        discount: {
            type: Number,
            required: false,
        },
        totalPrice: {
            type: Number,
            required: false,
        },
        date: {
            type: Date,
            // required: false,
        },

    },
    { strict: false }
);

// module.exports = productSchema;
quotationSchema.plugin(AutoIncrement, { inc_field: 'q_Id', start_seq: 10003 });
const Quotation = mongoose.model("Quotation", quotationSchema);
module.exports = Quotation;
