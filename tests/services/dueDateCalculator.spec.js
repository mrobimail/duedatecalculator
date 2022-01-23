const expect  = require('chai').expect;
const { calculateDueDate, isWeekend } = require('../../src/services/dueDateCalculator.js');

describe('Due Date Calculator', () => {
    describe('validateInputData', () => {
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

    describe('isWeekend', () => {
        it('should return true when day is Sunday', () => {
            expect(isWeekend('2022-01-16T09:00:00.000Z')).to.be.a('boolean').and.equal(true);
        });

        it('should return false when day is Monday', () => {
            expect(isWeekend('2022-01-17T09:00:00.000Z')).to.be.a('boolean').and.equal(false);
        });

        it('should return false when day is Tuesday', () => {
            expect(isWeekend('2022-01-18T09:00:00.000Z')).to.be.a('boolean').and.equal(false);
        });

        it('should return false when day is Wednesday', () => {
            expect(isWeekend('2022-01-19T09:00:00.000Z')).to.be.a('boolean').and.equal(false);
        });

        it('should return false when day is Thursday', () => {
            expect(isWeekend('2022-01-20T09:00:00.000Z')).to.be.a('boolean').and.equal(false);
        });

        it('should return false when day is Friday', () => {
            expect(isWeekend('2022-01-21T09:00:00.000Z')).to.be.a('boolean').and.equal(false);
        });

        it('should return true when day is Saturday', () => {
            expect(isWeekend('2022-01-22T09:00:00.000Z')).to.be.a('boolean').and.equal(true);
        });
    });

    describe('calculateDueDate', () => {
        it('check result when submitDate from 9AM and turnaroundTime 1', () => {
            expect(calculateDueDate('2022-01-21T09:00:00.000Z', 1)).to.equal('2022-01-21T10:00:00.000Z');
        });

        it('check result when submitDate from 9AM and turnaroundTime 8', () => {
            expect(calculateDueDate('2022-01-21T09:00:00.000Z', 8)).to.equal('2022-01-21T17:00:00.000Z');
        });

        it('check result when submitDate from 9AM and turnaroundTime 8.1', () => {
            expect(calculateDueDate('2022-01-21T09:00:00.000Z', 8.1)).to.equal('2022-01-24T09:06:00.000Z');
        });

        it('check result when submitDate from 2PM and turnaroundTime 1', () => {
            expect(calculateDueDate('2022-01-21T14:00:00.000Z', 1)).to.equal('2022-01-21T15:00:00.000Z');
        });

        it('check result when submitDate from 2PM and turnaroundTime 3', () => {
            expect(calculateDueDate('2022-01-21T14:00:00.000Z', 3)).to.equal('2022-01-21T17:00:00.000Z');
        });

        it('check result when submitDate from 2PM and turnaroundTime 8', () => {
            expect(calculateDueDate('2022-01-21T14:00:00.000Z', 8)).to.equal('2022-01-24T14:00:00.000Z');
        });

        it('check result when submitDate from 2PM and turnaroundTime 16', () => {
            expect(calculateDueDate('2022-01-21T14:00:00.000Z', 16)).to.equal('2022-01-25T14:00:00.000Z');
        });

        it('check result when submitDate from 2PM and turnaroundTime 40', () => {
            expect(calculateDueDate('2022-01-21T14:00:00.000Z', 40)).to.equal('2022-01-28T14:00:00.000Z');
        });

        it('check result when submitDate from 2PM and turnaroundTime 44', () => {
            expect(calculateDueDate('2022-01-21T14:00:00.000Z', 44)).to.equal('2022-01-31T10:00:00.000Z');
        });
    });
});