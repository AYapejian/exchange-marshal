const Aigle = require('aigle');
const CoinbaseClient = require('coinbase');
Aigle.promisifyAll(CoinbaseClient);
const Exchange = require('./_exchange');


// Module: https://github.com/coinbase/coinbase-node
// API:    https://developers.coinbase.com/api/v2
class Coinbase extends Exchange {
    constructor({ key, secret }) {
        super({
            displayName: 'Coinbase',
            name:        'coinbase',
            type:        'wallet',
            api:         {
                private: new CoinbaseClient.Client({ apiKey: key, apiSecret: secret }),
                public:  null
            }
        });
    }

    get normalizeMap() {
        return {
            error: {
                name:    'name',
                message: 'message',
                type:    'error_type',
                code:    'error_code'
            },
            balance: {
                id:        'id',
                ticker:    'balance.currency',
                available: 'balance.amount',
                balance:   'balance.amount'
            }
        };
    }
    // Private
    _getBalance()           { return this.api.private.getAccountsAsync({}) }
}

module.exports = Coinbase;
