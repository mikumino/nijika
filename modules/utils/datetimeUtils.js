// Util file with datetime-related functions

// Given minutes, return a string with the hours and minutes
exports.toHoursMins = (duration) => {
    let hours = Math.floor(duration / 60);
    let mins = duration % 60;
    return { hours, mins };
}

// Given hours and minutes, return in format "X hours and Y minutes"
exports.toHoursMinsFullString = (hours, mins) => {
    let hoursMinsString = "";
    if (hours == 0) {
        hoursMinsString = `${mins} minutes`;
    }
    else if (hours == 1) {
        hoursMinsString = `${hours} hour and ${mins} minutes`;
    }
    else {
        hoursMinsString = `${hours} hours and ${mins} minutes`;
    }
    return hoursMinsString;
}