'use strict';
const Promise = require('aigle');
const Decimal = require('decimal.js');
const axios   = require('axios');
const converter = module.exports = {};

const BASE_URL = 'https://www.cryptonator.com';
const client = axios.create({ baseUrl: BASE_URL });

converter.convert = function ({ sourceCurrency, sourceAmount, targetCurrency }) {
    const url = `https://www.cryptonator.com/api/ticker/${sourceCurrency}-${targetCurrency}`;

    return client.get(url)
        .then(result => {
            if (result.data.success) {
                const price = new Decimal(result.data.ticker.price);
                const amount = new Decimal(sourceAmount);
                const targetAmount = price.times(amount).toString();

                return {
                    sourceCurrency, sourceAmount, targetCurrency, targetAmount
                };
            }

            return { sourceCurrency, sourceAmount, targetCurrency, targetAmount: 'not_found' };
        });
};

