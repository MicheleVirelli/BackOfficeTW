const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Customer",
    },
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Employee"
    },
    basePrice: {
        type: Number,
        required: true
    },
    modifier: {
        type: mongoose.Schema.Types.Mixed, 
        required: true
    },
    finalPrice: {
        type: Number,
        required: true,
    },
    startRent: {
        type: Date,
        required: true
    },
    endRent: {
        type: Date,
        required: true
    },
    unit: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Unit",
    }
})

module.exports.model = mongoose.model('Bill', billSchema);
module.exports.schema = billSchema;