const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const paymentSchema = new mongoose.Schema({
    pay_Id: {
        type: Number,
    },
    com_name: {
        type: String,
    },
    i_Id: {
        type: Number,
    },
    cus_Id: {
        type: Number,
        required: true,
    },
    mobile: {
        type: Number,
    },
    rec_amt: {
        type: Number
    },
    bal: {
        type: Number
    },
    dop: {
        type: Date
    },
    nextdue: {
        type: Date
    },
    mop: {
        type: String
    },
    totalPrice: {
        type: Number,
    },
});
//Apply the auto increment because using application No.
paymentSchema.plugin(AutoIncrement, { inc_field: 'pay_id', start_seq: 1001 });

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
