const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const enquirySchema = new mongoose.Schema({
    enq_id: {
        type: Number,
    },
    com_name: {
        type: String,
    },
    con_person: {
        type: String,
    },
    email: {
        type: String
    },
    mobile: {
        type: String
    },
    alter_mobile: {
        type: String
    },
    city: {
        type: String
    },
    date: {
        type: Date,
    },
    status: {
        type: Number,
        default: 0
    },
    remark: {
        type: String,
    },
    product: [
        {
            productId: { type: String },
            type: { type: String },
        }
    ],
    service: [
        {
            productId: { type: String },
            type: { type: String },
        }
    ],
}
, { strict: false }
); 
//Apply the auto increment because using application No.
enquirySchema.plugin(AutoIncrement, { inc_field: 'enq_id' });

const Enquiry = mongoose.model('Enquiry', enquirySchema);
module.exports = Enquiry;
