const modifiersList = require("./modifiers").modifiersList;


class Modifiers {
    constructor(value, shortExplanation, longExplanation) {
        this.value = value;
        this.shortExplanation = shortExplanation;
        this.longExplanation = longExplanation;
    }
}

class PriceEstimation{
    constructor(basePrice, modifiersList, finalPrice){
        this.basePrice = basePrice;
        this.modifiersList = modifiersList;
        this.finalPrice = finalPrice;
    }
}

function computePriceEstimation(units, info) {
    //let priceToEstimate = {};
    let estimations = [];

    for (unit of units) {
        estimations.push(unitPriceEstimation(unit, info));

        /* TODO nel caso in cui si vogliono raggrupare unità per stesso prezzo aggiungerlo, però si perdono informazioni sulla causa del prezzo
        let estimation = unitPriceEstimation(unit, info);
        if(priceToEstimate[estimation.finalPrice])
            priceToEstimate[estimation.finalPrice].units.push(unit._id);
        else
            priceToEstimate[estimation.finalPrice] = estimation;
            estimations.push(estimation);
            */
    }
    return estimations.sort( (a, b) => parseFloat(a.finalPrice) - parseFloat(b.finalPrice) );
}

function unitPriceEstimation(unit, info) {

    let computedModifiers = computeModifiers({ unit, ...info });
    let finalPrice = unit.price;

    for (modifier of computedModifiers)
        finalPrice = finalPrice * modifier.value;

    return new PriceEstimation(unit.price, computedModifiers, finalPrice);
}

function computeModifiers(info) {
    let modifiers = [];
    for (modifier in modifiersList) {
        if (modifier.condition(info)) 
            modifiers.push(new Modifiers(modifier.value, modifier.shortExplanation(info), modifier.longExplanation(info)));
    }

    return modifiers;
}

module.exports.computePriceEstimation = computePriceEstimation;