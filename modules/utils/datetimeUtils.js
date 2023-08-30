// Util file with datetime-related functions

// Given minutes, return an object with the hours and minutes
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

// Date ranges (start, ends) for daily, weekly, monthly
exports.dateRanges = {
    daily: () => {
        let startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
        let endDate = new Date();
        endDate.setHours(23, 59, 59, 999);
        return { startDate, endDate };
    },
    weekly: () => {
        let startDate = new Date();
        startDate.setDate(startDate.getDate() - startDate.getDay());
        startDate.setHours(0, 0, 0, 0);
        let endDate = new Date();
        endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
        endDate.setHours(23, 59, 59, 999);
        return { startDate, endDate };
    },
    monthly: () => {
        let startDate = new Date();
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);
        let endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1);
        endDate.setDate(0);
        endDate.setHours(23, 59, 59, 999);
        return { startDate, endDate };
    }
}