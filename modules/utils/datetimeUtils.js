// Util file with datetime-related functions

// Given minutes, return a string with the hours and minutes
exports.toHoursMins = (duration) => {
    let hours = Math.floor(duration / 60);
    let mins = duration % 60;
    return { hours, mins };
}

// Given hours and minutes, return in format "X hours and Y minutes"
exports.toHoursMinsFullString = (duration) => {
    let { hours, mins } = this.toHoursMins(duration);
    if (hours == 0) {
        return `${mins} minutes`;
    }
    else if (hours == 1) {
        return `${hours} hour and ${mins} minutes`;
    }
    else {
        return `${hours} hours and ${mins} minutes`;
    }
}

// Given hours and minutes, return in format "Xh Ym"
exports.toHoursMinsShortString = (duration) => {
    let { hours, mins } = this.toHoursMins(duration);
    return `${hours}h ${mins}m`;
}