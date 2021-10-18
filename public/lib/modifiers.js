const conditionLevel = require("../models/unit").conditionLevel;
const helper = require("./helper");

const discoutBasedOnCondition = {
    condition: ({unit, from, to, ...others}) => {
        switch(unit.condition) {
            case conditionLevel.perfect:
                return false; //Nel caso in cui sia perfect non va aggiunto un modifier
            case conditionLevel.minorflow:
                this.value = 0.8;
                break;
            case conditionLevel.majorflaw:
                this.value = 0.5;
                break;
            case conditionLevel.broken:
                throw new Error("Tried to calculate the price of a broken unit"); //Nel caso sia broken non dovrebbe proprio essere chiamato questo
        }
        return true
    },
    value: 1,
    shortExplanation: () => {
        return "";
    },
    longExplanation: () => {
        return "A discout of " + this.value * 100 + "% is applied because the unit has some " + unit.condition;
    }
};

const premiumBasedOnWeekendDays = {
    //This modifier modify the price based on how much day are on the weekend
    condition: ({unit, from, to, ...others}) => {
        const numberOfDays = helper.calculateDays(from, to);
        

        //Contare il numero di giorni fra from e to
        //Contare il numero di giorni fra from e to che sono weekend
        //Fare il rapporto fra i due e moltiplicare per una variabile in base a ciò
    },
    value: 1,
    explanation: function(){
        return "A discout of " + this.value * 100 + "% is applied because the unit has some " + unit.condition;
    }
};

const modifiersList = [
    discoutBasedOnCondition,
    premiumBasedOnWeekendDays
]

module.exports.modifiersList = modifiersList;