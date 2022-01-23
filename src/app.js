const calculateDueDate = require('./services/dueDateCalculator.js');

const input = {
    submitDate: '2022-01-21T14:00:00.000Z',
    turnaroundTime: 10,
}

// console.log('# Input: ', input.submitDate, input.turnaroundTime);
// console.log('# Result: ', calculateDueDate(input.submitDate, input.turnaroundTime));