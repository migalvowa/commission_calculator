import {
  getCashInCommissionFee,
  getCashOutNaturalCommissionFee,
  getCashOutJuridicalCommissionFee,
  roundValue,
} from './utils.js';

/**
 * Test case for #getCashInCommissionFee function
 */

describe('#getCashInCommissionFee', () => {
  it('when as a result we get 5 or less than 5 euros', () => {
    const apiData = { percents: 0.03, max: { amount: 5, currency: 'EUR' } };
    const operationAmount = 300;
    const output = 0.09;

    expect(getCashInCommissionFee(apiData, operationAmount)).toEqual(output);
  });

  it('when as a result we get more than 5 euros', () => {
    const apiData = { percents: 0.03, max: { amount: 5, currency: 'EUR' } };
    const operationAmount = 100000;
    const output = 5;

    expect(getCashInCommissionFee(apiData, operationAmount)).toEqual(output);
  });
});

/**
 * Test case for #getCashOutNaturalCommissionFee function
 */

describe('#getCashOutNaturalCommissionFee', () => {
  it('if this is the first cash out natural operation this week and the withdrawal amount is 1000 or less than 1000 euros', () => {
    const apiData = {
      percents: 0.3,
      week_limit: { amount: 1000, currency: 'EUR' },
    };

    const operationItem = {
      date: '2016-02-15',
      user_id: 1,
      user_type: 'natural',
      type: 'cash_out',
      operation: { amount: 300, currency: 'EUR' },
    };

    const operationIndex = 8;

    const operationsList = [
      {
        date: '2016-01-05',
        user_id: 1,
        user_type: 'natural',
        type: 'cash_in',
        operation: { amount: 200, currency: 'EUR' },
      },
      {
        date: '2016-01-10',
        user_id: 3,
        user_type: 'natural',
        type: 'cash_out',
        operation: { amount: 1000, currency: 'EUR' },
      },
      {
        date: '2016-02-15',
        user_id: 1,
        user_type: 'natural',
        type: 'cash_out',
        operation: { amount: 300, currency: 'EUR' },
      },
    ];

    const output = 0;

    expect(
      getCashOutNaturalCommissionFee(
        apiData,
        operationItem,
        operationIndex,
        operationsList,
      ),
    ).toEqual(output);
  });

  it('if this is the first cash out natural operation this week and the withdrawal amount is more than 1000 euros', () => {
    const apiData = {
      percents: 0.3,
      week_limit: { amount: 1000, currency: 'EUR' },
    };

    const operationItem = {
      date: '2016-02-15',
      user_id: 1,
      user_type: 'natural',
      type: 'cash_out',
      operation: { amount: 1300, currency: 'EUR' },
    };

    const operationIndex = 8;

    const operationsList = [
      {
        date: '2016-01-05',
        user_id: 1,
        user_type: 'natural',
        type: 'cash_in',
        operation: { amount: 200, currency: 'EUR' },
      },
      {
        date: '2016-01-10',
        user_id: 3,
        user_type: 'natural',
        type: 'cash_out',
        operation: { amount: 1000, currency: 'EUR' },
      },
      {
        date: '2016-02-15',
        user_id: 1,
        user_type: 'natural',
        type: 'cash_out',
        operation: { amount: 1300, currency: 'EUR' },
      },
    ];

    const output = 0.9;

    expect(
      getCashOutNaturalCommissionFee(
        apiData,
        operationItem,
        operationIndex,
        operationsList,
      ),
    ).toEqual(output);
  });

  it('if this is not the first cash out natural operation this week', () => {
    const apiData = {
      percents: 0.3,
      week_limit: { amount: 1000, currency: 'EUR' },
    };

    const operationItem = {
      date: '2016-01-07',
      user_id: 1,
      user_type: 'natural',
      type: 'cash_out',
      operation: { amount: 1000, currency: 'EUR' },
    };

    const operationIndex = 8;

    const operationsList = [
      {
        date: '2016-01-06',
        user_id: 2,
        user_type: 'juridical',
        type: 'cash_out',
        operation: { amount: 300, currency: 'EUR' },
      },
      {
        date: '2016-01-07',
        user_id: 1,
        user_type: 'natural',
        type: 'cash_out',
        operation: { amount: 1000, currency: 'EUR' },
      },
      {
        date: '2016-01-07',
        user_id: 1,
        user_type: 'natural',
        type: 'cash_out',
        operation: { amount: 1000, currency: 'EUR' },
      },
    ];

    const output = 3;

    expect(
      getCashOutNaturalCommissionFee(
        apiData,
        operationItem,
        operationIndex,
        operationsList,
      ),
    ).toEqual(output);
  });
});

/**
 * Test case for #getCashOutJuridicalCommissionFee function
 */

describe('#getCashOutJuridicalCommissionFee', () => {
  it('when as a result we get 0.5 or more than 0.5 euros', () => {
    const apiData = { percents: 0.3, min: { amount: 0.5, currency: 'EUR' } };
    const operationAmount = 400;
    const output = 1.2;

    expect(getCashOutJuridicalCommissionFee(apiData, operationAmount)).toEqual(
      output,
    );
  });

  it('when as a result we get less than 0.5 euros', () => {
    const apiData = { percents: 0.3, min: { amount: 0.5, currency: 'EUR' } };
    const operationAmount = 100;
    const output = 0.5;

    expect(getCashOutJuridicalCommissionFee(apiData, operationAmount)).toEqual(
      output,
    );
  });
});

/**
 * Test case for #roundValue function
 */

describe('#roundValue', () => {
  it('when passing an integer', () => {
    const value = 1;
    const output = '1.00';

    expect(roundValue(value)).toEqual(output);
  });

  it('when passing a float', () => {
    const value = 1.023;
    const output = '1.03';

    expect(roundValue(value)).toEqual(output);
  });

  it('when passing a wrong type of data', () => {
    const value = '5';

    expect(() => roundValue(value)).toThrow();
  });
});
