import fs from 'fs';
import fetch from 'node-fetch';

//

import API from './constants/api.js';
import { OPERATION_TYPES, USER_TYPES, FUNCTIONS } from './constants/types.js';

import {
  getCashInCommissionFee,
  getCashOutNaturalCommissionFee,
  getCashOutJuridicalCommissionFee,
  roundValue,
} from './utils/utils.js';

const getApiData = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
    return null;
  }
};

const calculateCommissionFees = async (data) => {
  const functions = new Set();

  data.forEach((item) => {
    if (item.type === OPERATION_TYPES.CASH_IN) {
      functions.add(FUNCTIONS.GET_API_CASH_IN_DATA);
    } else if (item.type === OPERATION_TYPES.CASH_OUT) {
      if (item.user_type === USER_TYPES.NATURAL) {
        functions.add(FUNCTIONS.GET_API_CASH_OUT_NATURAL_DATA);
      } else if (item.user_type === USER_TYPES.JURIDICAL) {
        functions.add(FUNCTIONS.GET_API_CASH_OUT_JURIDICAL_DATA);
      }
    }
  });

  let apiCashInData = {};
  let apiCashOutNaturalData = {};
  let apiCashOutJuridicalData = {};

  if (functions.has(FUNCTIONS.GET_API_CASH_IN_DATA)) {
    apiCashInData = await getApiData(API.CASH_IN_URL);
  }

  if (functions.has(FUNCTIONS.GET_API_CASH_OUT_NATURAL_DATA)) {
    apiCashOutNaturalData = await getApiData(API.CASH_OUT_NATURAL_URL);
  }

  if (functions.has(FUNCTIONS.GET_API_CASH_OUT_JURIDICAL_DATA)) {
    apiCashOutJuridicalData = await getApiData(API.CASH_OUT_JURIDICAL_URL);
  }

  data.forEach((item, index, array) => {
    if (item.type === OPERATION_TYPES.CASH_IN) {
      const result = getCashInCommissionFee(
        apiCashInData,
        item.operation.amount,
      );

      console.log(roundValue(result));
    } else if (item.type === OPERATION_TYPES.CASH_OUT) {
      if (item.user_type === USER_TYPES.NATURAL) {
        const result = getCashOutNaturalCommissionFee(
          apiCashOutNaturalData,
          item,
          index,
          array,
        );

        console.log(roundValue(result));
      } else if (item.user_type === USER_TYPES.JURIDICAL) {
        const result = getCashOutJuridicalCommissionFee(
          apiCashOutJuridicalData,
          item.operation.amount,
        );

        console.log(roundValue(result));
      }
    }
  });
};

fs.readFile('./input.json', 'utf8', (err, jsonData) => {
  if (err) {
    console.error(err);
    return;
  }

  const data = JSON.parse(jsonData);

  calculateCommissionFees(data);
});
