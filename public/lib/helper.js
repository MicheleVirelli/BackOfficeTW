function dayDifference(date1, date2){
    return Math.round((date2-date1)/(1000*60*60*24));
}

function isWeekend(date){
    let day = date.getDay();
    return day === 6 || day === 0;
}

module.exports = {dayDifference, isWeekend}