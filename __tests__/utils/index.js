const ExchangeMarshal = require('../../src/exchange-marshal');
const utils = module.exports = {};
utils.config = require('../../config');

let exMarshal = null;
utils.getExchangeMarshal = function() {
    if (exMarshal) { return exMarshal; }
    exMarshal = new ExchangeMarshal({ accounts: utils.config.accounts });
    return exMarshal;
}
