const exMarshal = {}

exMarshal.exchanges = {
    bittrex:  require('./exchanges/bittrex'),
    coinbase: require('./exchanges/coinbase'),
    gdax:     require('./exchanges/gdax'),
    kraken:   require('./exchanges/kraken'),
    poloniex: require('./exchanges/poloniex')
};

// Returns all exchange settings if no exchangeName is passed in
exMarshal.getExchangeSettings = (exchangeName) => {
    const e =  exMarshal.getExchange(exchangeName);
    return (e) ? e.settings : null;
};

// TODO: This would be a public api method for exchanges, not implemented yet
exMarshal.getAssets = (exchangeName) => {
    const e =  exMarshal.getExchange(exchangeName);
    return e.getAssets();
};


exMarshal.getExchangeWithCreds = function(exchangeName, creds) {
    return new exMarshal.exchanges[exchangeName](creds);
}


class ExchangeMarshal {
    constructor(config) {
        this.config = config;
        this.exchanges = {};
        // Instantiate all the exchanges based on credentials
        Object.entries(this.config.accounts).forEach(([exchangeName, val]) => {
            this.exchanges[exchangeName] = exMarshal.getExchangeWithCreds(exchangeName, val.apiCredentials);
        });
    }
    getExchange(exchangeName) {
        return this.exchanges[exchangeName]
    }
    getAllBalances(opts) {
        const results = Object.entries(this.exchanges).map(([k,v]) => {
            return v.getBalance()
                .then(b => {
                    return { [k]: b };
                })
                .catch(err => err.message || 'not implemented')
        });

        return Promise.all(results)
            .then(allB => {
                return allB.reduce((acc, b) => {
                    const exchange = Object.keys(b)[0];
                    const balance = b[exchange];
                    acc[exchange] = balance;
                    return acc;
                }, {})
            });
    }
    getBalance(exchangeName, opts = {}) {
        return this.getExchange(exchangeName).getBalance(opts)
    }

    getOrders(exchangeName, opts = {}) {
        return this.getExchange(exchangeName).getOrders(opts)
    }

    getOrderHistory(exchangeName, opts = {}) {
        return this.getExchange(exchangeName).getOrderHistory(opts)
    }
}

module.exports = ExchangeMarshal;
