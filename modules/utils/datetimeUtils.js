// Util file with datetime-related functions

// Given minutes, return a string with the hours and minutes
exports.toHoursMins = (duration) => {
    let hours = Math.floor(duration / 60);
    let mins = duration % 60;
    return { hours, mins };
}