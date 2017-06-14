const Aigle = require('aigle');
const PoloniexClient = require('poloniex-api-node');
Aigle.promisifyAll(PoloniexClient);
const Exchange = require('./_exchange');

// Module: https://github.com/dutu/poloniex-api-node
// API:    https://poloniex.com/support/api/
class Poloniex extends Exchange {
    constructor({ key, secret }) {
        super({
            displayName: 'Poloniex',
            name:        'poloniex',
            type:        'exchange',
            api:         {
                private: new PoloniexClient(key, secret),
                public:  null
            }
        });
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
                balance:   'available'
            },
            orders: {
                id:          'orderNumber',
                side:        'type',
                type:        null,
                status:      null,
                ticker_pair: 'pair',
                created_at:  'date',
                amount:      'amount',
                price:       'rate'

            }
        };
    }

    // Private
    _getBalance()           {
        return this.api.private.returnCompleteBalancesAsync('all')
            .then(result => {
                return Object.keys(result).reduce((acc,k) => {
                    const b = result[k];
                    acc.push({
                        currency:  k,
                        balance:   String(parseFloat(b.available) + parseFloat(b.onOrders)),
                        available: b.available
                    })
                    return acc;
                }, [])
            })
    }

    _getOrders(opts) {
        return this.api.private.returnOpenOrdersAsync('all')
            .then(res => {
                const pairs = Object.keys(res);
                const orders = pairs.reduce((acc, p) => {
                    const pairOrders = res[p];
                    if (pairOrders.length === 0) { return acc; }
                    const newOrders = pairOrders.map(o => {
                        return Object.assign({ pair: p}, o);
                    }, []);
                    acc = acc.concat(newOrders);
                    return acc;
                }, [])
                return orders
            });
    }
}

module.exports = Poloniex;
