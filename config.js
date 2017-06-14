/* eslint-disable no-process-env */
'use strict';
require('dotenv').config();
const config = module.exports = {};

config.accounts = {
    coinbase: {
        apiCredentials: {
            key:    process.env.COINBASE_KEY,
            secret: process.env.COINBASE_SECRET
        }
    },
    gdax: {
        apiCredentials: {
            key:        process.env.GDAX_KEY,
            secret:     process.env.GDAX_SECRET,
            passphrase: process.env.GDAX_PASSPHRASE
        }
    },
    kraken: {
        apiCredentials: {
            key:    process.env.KRAKEN_KEY,
            secret: process.env.KRAKEN_SECRET
        }
    },
    poloniex: {
        apiCredentials: {
            key:    process.env.POLONIEX_KEY,
            secret: process.env.POLONIEX_SECRET
        }
    },
    bittrex: {
        apiCredentials: {
            key:    process.env.BITTREX_KEY,
            secret: process.env.BITTREX_SECRET
        }
    }
};
