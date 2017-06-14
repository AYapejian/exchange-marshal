const Aigle = require('aigle');
const KrakenClient = require('kraken-api');
const Exchange = require('./_exchange');

// Module: https://github.com/5an1ty/kraken-api
// API:    https://www.kraken.com/help/api
class Kraken extends Exchange {
    constructor({ key, secret }) {
        super({
            displayName: 'Kraken',
            name:        'kraken',
            type:        'exchange',
            api:         {
                private: new KrakenClient(key, secret),
                public:  null
            }
        });
        Aigle.promisifyAll(this.api.private);
    }
    get normalizeMap() {
        return {
            // error: {
            //     name:    'name',
            //     message: 'message',
            //     type:    'error_type',
            //     code:    'error_code'
            // },
            balance: {
                id:        (src) => null,
                ticker:    'currency',
                available: 'balance',
                balance:   'balance'
            },
            orders: {
                id:          'refid',
                side:        'descr.type',
                type:        'type',
                status:      'status',
                ticker_pair: 'descr.pair',
                created_at:  'opentm',
                amount:      'vol',
                price:       'price'

            }
        };
    }

    // Private
    _getBalance()           {
        return this.api.private.apiAsync('Balance', null)
            .then(balance => {
                balance = balance.result;

                return Object.keys(balance).reduce((acc,k) => {
                    acc.push({
                        currency: k,
                        balance:  balance[k]
                    })
                    return acc;
                }, []);
            })
    }
    _getOrders(opts)        {
        return this.api.private.apiAsync('OpenOrders', opts).then(res => {
            const orders = res.result.open;
            const ret = Object.keys(orders).reduce((acc,k) => {
                acc.push(orders[k])
                return acc;
            }, []);
            return ret;
        });
    }
}

module.exports = Kraken;
