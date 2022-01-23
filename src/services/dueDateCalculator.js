const config = require('../config.json');

function calculateDueDate(submitDate, turnaroundTime) {
    validateInputData(submitDate, turnaroundTime);
    
    const firstDayWorkingHoursEnd = new Date(submitDate).setHours(config.workingHours.to, 0, 0);
    const firstDayWorkingHoursEndTimestamp = Math.floor(firstDayWorkingHoursEnd / 1000);

    const firstDayEnd = new Date(submitDate).setHours(24, 0, 0);
    const firstDayEndTimestamp = Math.floor(firstDayEnd / 1000);

    const submitDateTimestamp = Math.floor(new Date(submitDate) / 1000);
    const firstDayRemainder = firstDayWorkingHoursEndTimestamp - submitDateTimestamp + 3600;
    const turnaroundTimeInSeconds = turnaroundTime * 60 * 60;

    const resultSecondsInFirstDay = firstDayEndTimestamp - submitDateTimestamp;
    const turnaroundTimeAfterFirstDay = turnaroundTime - (firstDayRemainder / 60 / 60);

    let resultSeconds;
    if (turnaroundTimeInSeconds <= firstDayRemainder) {
        resultSeconds = submitDateTimestamp + turnaroundTimeInSeconds;
    } else {
        resultSeconds = resultSecondsInFirstDay;
        resultSeconds += getResultSecondsIfMoreDay(submitDate, turnaroundTimeAfterFirstDay);
    }

    const resultDate = new Date(resultSeconds * 1000).toISOString();
    return resultDate;
}

function validateInputData(submitDate, turnaroundTime) {
    if (typeof submitDate === 'undefined' || typeof turnaroundTime === 'undefined') {
        throw new Error('empty input');
    }

    if (!isIsoDate(submitDate)) {
        throw new Error('bad input type: submitDate');
    }

    if (typeof turnaroundTime !== 'number') {
        throw new Error('bad input type: turnaroundTime');
    }

    if (turnaroundTime <= 0) {
        throw new Error('bad input value: turnaroundTime');
    }

    if (isWeekend(submitDate)) {
        throw new Error('bad input value: submitDate day');
    }

    const submitDateHour = new Date(submitDate).getHours();
    if (submitDateHour < 9 || submitDateHour >= 17) {
        throw new Error('bad input value: submitDate hour');
    }
}

function isIsoDate(str) {
    let returnVal = false;
    let date = new Date(str);
    if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(str)) {
        returnVal = false;
    } else if (isNaN(date)) {
        returnVal = false;
    } else {
        returnVal = date.toISOString() === str;
    }
    return returnVal;
}

function getResultSecondsIfMoreDay(submitDate, turnaroundTimeAfterFirstDay) {
    let resultSeconds = Math.floor(new Date(submitDate) / 1000);
    let workingHours = config.workingHours.to - config.workingHours.from;
    let oneDayInSeconds = 24 * 60 * 60;
    let day = new Date(submitDate);

    for (let i = turnaroundTimeAfterFirstDay; i > 0; i -= workingHours) {
        day.setDate(day.getDate() + 1);
        if (isWeekend(day)) {
            resultSeconds += oneDayInSeconds;
            i += workingHours;
        } else if (i >= workingHours) {
            resultSeconds += oneDayInSeconds;
        } else {
            resultSeconds += (config.workingHours.from * 60 * 60) + (i * 60 * 60) + 3600;
        }
    }

    return resultSeconds;
}

function isWeekend(date) {
    const dayNumber = new Date(date).getDay();
    return dayNumber === 0 || dayNumber === 6;
}

module.exports = {
    calculateDueDate,
    isWeekend
};