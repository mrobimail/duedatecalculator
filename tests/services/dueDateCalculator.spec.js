const assert = require('assert');
const expect  = require('chai').expect;
const calculateDueDate = require('../../src/services/dueDateCalculator.js');

describe('Due Date Calculator', () => {
    it('should return error when input is empty: submitDate, turnaroundTime', () => {
        expect(calculateDueDate).to.throw('empty input');
    });

    it('should return error when input is empty: turnaroundTime', () => {
        expect(() => calculateDueDate('52011-10-05T14:48:00.000Z')).to.throw('empty input');
    });

    it('should return error when bad submitDate type', () => {
        expect(() => calculateDueDate('52011-10-05T14:48:00.000Z', '8h')).to.throw('bad input type: submitDate');
    });

    it('should return error when bad turnaroundTime type', () => {
        expect(() => calculateDueDate('2022-01-05T14:48:00.000Z', '8h')).to.throw('bad input type: turnaroundTime');
    });

    it('should return error when bad turnaroundTime value: 0', () => {
        expect(() => calculateDueDate('2022-01-05T14:48:00.000Z', 0)).to.throw('bad input value: turnaroundTime');
    });

    it('should return error when bad turnaroundTime value: -1', () => {
        expect(() => calculateDueDate('2022-01-05T14:48:00.000Z', -1)).to.throw('bad input value: turnaroundTime');
    });

    it('should return error when bad submitDate value: 0 = Sunday', () => {
        expect(() => calculateDueDate('2022-01-23T12:00:00.000Z', 1)).to.throw('bad input value: submitDate day');
    });

    it('should return error when bad submitDate value: 6 = Saturday', () => {
        expect(() => calculateDueDate('2022-01-22T12:00:00.000Z', 1)).to.throw('bad input value: submitDate day');
    });

    it('should return error when bad submitDate time value: 7', () => {
        expect(() => calculateDueDate('2022-01-21T07:00:00.000Z', 1)).to.throw('bad input value: submitDate hour');
    });

    it('should return error when bad submitDate time value: 18', () => {
        expect(() => calculateDueDate('2022-01-21T18:00:00.000Z', 1)).to.throw('bad input value: submitDate hour');
    });
});