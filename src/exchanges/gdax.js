const Aigle = require('aigle');
const GdaxClient = require('gdax');
Aigle.promisifyAll(GdaxClient);
const Exchange = require('./_exchange');

const API_URI = 'https://api.gdax.com';
// const sandboxURI = 'https://api-public.sandbox.gdax.com';

// Module: https://github.com/coinbase/gdax-node
// API:    https://docs.gdax.com
class Gdax extends Exchange {
    constructor({ key, secret, passphrase }) {
        super({
            displayName: 'Gdax',
            name:        'gdax',
            type:        'exchange',
            api:         {
                private: new GdaxClient.AuthenticatedClient(key, secret, passphrase, API_URI),
                public:  null // Gdax.PublicClient('BTC-USD', API_URI)
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
                id:        'id',
                ticker:    'currency',
                available: 'available',
                balance:   'balance'
            },
            orders: {
                id:          'id',
                side:        'side',
                type:        'type',
                status:      'status',
                ticker_pair: 'product_id',
                created_at:  'created_at',
                amount:      'size',
                price:       'price'

            }
        };
    }

    // Private
    _getBalance()           { return this.api.private.getAccountsAsync().then(res => JSON.parse(res.body));     }
    _getOrders(opts)        { return this.api.private.getOrdersAsync(opts).then(res => JSON.parse(res.body));   }
}

module.exports = Gdax;
