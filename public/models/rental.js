const mongoose = require('mongoose');
//const {billmodel, priceEstimationSchema, billSchema} = require("bill");

const rentalSchema = new mongoose.Schema({
    customer:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Customer",
    },
    employee: {
        //The employee is null until state is pending
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Employee",
    },
    prenotationDate:{
        type: Date,
        required: true
    },
    state: {
        type: String,
        enum: ['pending','open','close'],
        required: true, 
        default: 'pending'
    },
    //Until the state is open, bill is null
    bill: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bill",
    },
    startDate: {
        type: Date,
        required: true
    },
    expectedEndDate: {
        type: Date,
        required: true
    },
    //The actual end of the rent is null until state is open
    actualEndDate: {
        type: Date
    },
    unit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Unit",
        required: true
    },
    priceEstimation: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    }
})

module.exports = mongoose.model('Rental', rentalSchema);