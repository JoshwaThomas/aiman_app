const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const invoiceSchema = new mongoose.Schema(
    {
        i_Id: {
            type: Number,
            // required: false,
        },
        cus_Id: {
            type: Number,
            required: true,
        },
        com_name: {
            type: String,
        },
        email: {
            type: String,
        },
        mobile: {
            type: String,
        },
        city: {
            type: String,
        },
        rec_amt: {
            type: Number,
            // required: false,
        },
        bal: {
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
                price: { type: Number },
                // varient: { type: String },
                regdate: { type: Date },
                enddate: { type: Date },
                period: { type: String },
                remark: { type: String },
                reremark: { type: String }
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
        nextdue: {
            type: Date,
        },
        paytype: {
            type: String,
        },
        acc: {
            type: Number
        },
        remark: {
            type: String,
        },
        img: {
            type: String,
        },

    },
    { strict: false }
);

// module.exports = productSchema;
invoiceSchema.plugin(AutoIncrement, { inc_field: 'i_Id', start_seq: 10001 });
const Invoice = mongoose.model("Invoice", invoiceSchema);
module.exports = Invoice;
