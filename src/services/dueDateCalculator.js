function calculateDueDate(submitDate, turnaroundTime) {
    validateInputData(submitDate, turnaroundTime);
    
    const firstDayEnd = new Date(submitDate).setHours(17);
    const submitDateTimestamp = Math.floor(new Date(submitDate) / 1000);
    const firstDayEndTimestamp = Math.floor(firstDayEnd / 1000);
    const firstDayRemainder = firstDayEndTimestamp - submitDateTimestamp;
    const turnaroundTimeInSeconds = turnaroundTime * 60 * 60;

    let resultSeconds;
    if (turnaroundTimeInSeconds <= firstDayRemainder) {
        resultSeconds = submitDateTimestamp + turnaroundTimeInSeconds;
    } else {
        resultSeconds = getResultSecondsIfMoreDay(submitDate, turnaroundTime);
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

function getResultSecondsIfMoreDay(submitDate, turnaroundTime) {
    // TO DO: Add first day
    let resultSeconds = Math.floor(new Date(submitDate) / 1000);
    let day = new Date(submitDate);
    for (let i = turnaroundTime; i > 0; i -= 8) {
        day.setDate(day.getDate() + 1);
        if (isWeekend(day)) {
            resultSeconds += 24 * 60 * 60;
            i += 8;
        } else if (i >= 8) {
            resultSeconds += 24 * 60 * 60;
        } else {
            resultSeconds += (9 * 60 * 60) + (i * 60 * 60);
        }
    }

    return resultSeconds;
}

function isWeekend(date) {
    const dayNumber = new Date(date).getDay();
    return dayNumber === 0 || dayNumber === 6;
}

module.exports = calculateDueDate;