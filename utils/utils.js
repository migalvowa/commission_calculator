import { getWeek, getYear } from 'date-fns';

/**
 * Getting cash in commission fee
 * @param {object} apiData - api cash in data
 * @param {number} operationAmount - operation amount
 * @returns {number} returns cash in commission fee
 * @example
 * getCashInCommissionFee(apiData, operationAmount)
 */

export const getCashInCommissionFee = (apiData, operationAmount) => {
  const { percents, max } = apiData;

  const result = (operationAmount * percents) / 100;

  if (result > max.amount) {
    return max.amount;
  }

  return result;
};

/**
 * Getting cash out natural commission fee
 * @param {object} apiData - api cash out natural data
 * @param {object} operationItem - operation item
 * @param {number} operationIndex - operation index
 * @param {array} operationsList - operations list
 * @returns {number} returns cash out natural commission fee
 * @example
 * getCashOutNaturalCommissionFee(apiData, operationItem, operationIndex, operationsList)
 */

export const getCashOutNaturalCommissionFee = (
  apiData,
  operationItem,
  operationIndex,
  operationsList,
) => {
  const { percents, week_limit: weekLimit } = apiData;
  const {
    date,
    user_id: userId,
    user_type: userType,
    type,
    operation,
  } = operationItem;

  const filteredOperationsList = operationsList
    .slice(0, operationIndex + 1)
    .filter(
      (item) => item.user_id === userId
        && item.type === type
        && item.user_type === userType,
    );

  let result = 0;

  const getCommissionFee = () => {
    if (operation.amount <= weekLimit.amount) {
      return result;
    }

    result = ((operation.amount - weekLimit.amount) * percents) / 100;

    return result;
  };

  if (filteredOperationsList.length > 1) {
    const previousOperationDate = filteredOperationsList[filteredOperationsList.length - 2].date;

    const weekCurrentOperationNumber = getWeek(new Date(date), {
      weekStartsOn: 1,
    });
    const weekPreviousOperationNumber = getWeek(
      new Date(previousOperationDate),
      {
        weekStartsOn: 1,
      },
    );

    const yearCurrentOperationNumber = getYear(new Date(date));
    const yearPreviousOperationNumber = getYear(
      new Date(previousOperationDate),
    );

    if (
      yearCurrentOperationNumber === yearPreviousOperationNumber
      && weekCurrentOperationNumber === weekPreviousOperationNumber
    ) {
      result = (operation.amount * percents) / 100;

      return result;
    }

    result = getCommissionFee();

    return result;
  }

  result = getCommissionFee();

  return result;
};

/**
 * Getting cash out juridical commission fee
 * @param {object} apiData - api cash out juridical data
 * @param {number} operationAmount - operation amount
 * @returns {number} returns cash out juridical commission fee
 * @example
 * getCashOutJuridicalCommissionFee(apiData, operationAmount)
 */

export const getCashOutJuridicalCommissionFee = (apiData, operationAmount) => {
  const { percents, min } = apiData;

  const result = (operationAmount * percents) / 100;

  if (result < min.amount) {
    return min.amount;
  }

  return result;
};

/**
 * Rounding a number up to the nearest hundredths
 * @param {number} value - number
 * @returns {string} returns the rounded value as a string
 * @example
 * roundValue(value)
 */

export const roundValue = (value) => {
  if (typeof value !== 'number') {
    throw new Error(
      'Error! The type of the transmitted data does not match the required one',
    );
  }

  return (Math.ceil(value * 100) / 100).toFixed(2);
};
