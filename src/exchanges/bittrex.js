'use strict';
const bittrex  = require('@you21979/bittrex.com');
const Exchange = require('./_exchange');

// Module: https://github.com/you21979/node-bittrex
// API:    https://bittrex.com/Home/Api
class Bittrex extends Exchange {
    constructor({ key, secret }) {
        super({
            displayName: 'Bittrex',
            name:        'bittrex',
            type:        'exchange',
            api:         {
                private: bittrex.createPrivateApi(key, secret, 'node-exchange-marshal'),
                public:  bittrex.PublicApi
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
            ticker: {
                bid:  'Bid',
                ask:  'Ask',
                last: 'Last'
            },
            balance: {
                id:        'id',
                ticker:    'Currency',
                available: 'Available',
                balance:   'Balance'
            },
            orders: {
                id:          'id',
                side:        'side',
                type:        'type',
                status:      'status',
                ticker_pair: 'Exchange',
                created_at:  'Opened',
                amount:      'Quantity',
                price:       'Limit'
            },
            orderHistory: {
                order_id:       'OrderUuid',
                order_type:     'OrderType',
                ticker_pair:    'Exchange',
                created_at:     'TimeStamp',
                closed_at:      'Closed',
                amount:         'Quantity',
                amount_remains: 'QuantityRemaining',
                price_total:    'Price',
                price_per:      'PricePerUnit',
                fee:            'Commission'
            },
            withdrawalHistory: {
                payment_id:     'PaymentUuid',
                transaction_id: 'TxId',
                ticker:         'Currency',
                amount:         'Amount',
                address:        'Address',
                created_at:     'Opened',
                pending:        'PendingPayment',
                fee:            'TxCost'
            },
            depositHistory: {
                payment_id:     'PaymentUuid',
                transaction_id: 'TxId',
                ticker:         'Currency',
                amount:         'Amount',
                address:        'Address',
                created_at:     'Opened',
                pending:        'PendingPayment',
                fee:            'TxCost'
            }
        };
    }
    // Public
    _getTicker(pair) { return this.api.public.getTicker(pair); }

    // Private
    _getBalance()           { return this.api.private.getBalances();          }
    _getOrders()            { return this.api.private.getOpenOrders();        }
    _getOrderHistory()      { return this.api.private.getOrderHistory();      }
    _getWithdrawalHistory() { return this.api.private.getWithdrawalHistory(); }
    _getDepositHistory()    { return this.api.private.getWithdrawalHistory(); }
}

module.exports = Bittrex;
