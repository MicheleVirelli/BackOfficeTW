const mongoose = require('mongoose');
const Rental = require('../models/rental');


const conditionLevel = {
    perfect: "perfect",
    minorflaw: "minor flaw",
    majorflaw: "major flaw",
    broken: "broken",
}

const unitSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    condition: {
        type: String,
        enum: [conditionLevel.perfect, conditionLevel.minorflaw, conditionLevel.majorflaw, conditionLevel.broken],
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Product",
    },
    rentals: {
        type: [mongoose.Schema.Types.ObjectId],
        required: true,
        ref: "Rental",
    },
})

unitSchema.virtual("available").get(function () {
    const dateNow = new Date().now();
    let rentalInPeriod = Rental.find({unit: this._id})
        .filter(x => {
            return (x.startdate <= dateNow && x.enddate >= dateNow)
        })

    return rentalInPeriod.length == 0;
});

unitSchema.methods.availableFromTo = async function (from, to) {
    let rentalInPeriod = Rental.find({unit: this._id})
        .filter(x => {
            return (x.startdate <= from && x.enddate >= from)
                || (x.startdate <= to && x.enddate >= to) 
                || (x.startdate >= frofrom && x.enddate <= to)
        })

    return rentalInPeriod.length == 0;
}

module.exports.model = mongoose.model('Unit', unitSchema);
module.exports.schema = unitSchema;
module.exports.conditionLevel = conditionLevel;
