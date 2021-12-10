function clearifyDate(date) {

    //TODO: implementare un controllo regex 
    let data = {
        year: '',
        month: '',
        day: '',
        time: {
            hour: '',
            minute: '',
            seconds: '',
        }
    }

    data.year = date.slice(0,4)
    data.month = date.slice(5,7)
    data.day = date.slice(8,10)

    const start = date.indexOf('T') +1 
    data.time.hour = date.slice(start, start + 2) 
    data.time.minute = date.slice(start + 3, start + 5)
    data.time.seconds = date.slice(start + 6, start + 8)

    return data
}