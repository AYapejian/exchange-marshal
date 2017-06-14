const Promise = require('aigle');
const Decimal = require('decimal.js');

const _int = {
    accounts: {
        bittrex:  require('./accounts/bittrex'),
        gdax:     require('./accounts/gdax'),
        coinbase: require('./accounts/coinbase'),
        poloniex: require('./accounts/poloniex'),
        kraken:   require('./accounts/kraken'),
        init:     (accountConfigs) => {
            return Object.entries(accountConfigs)
                .reduce((configuredAccounts, [acctName, acctConfig]) => {
                    configuredAccounts.push(new _int.accounts[acctName](acctConfig.api));
                    return configuredAccounts;
                }, []);
        }
    }
};

// { accounts: { coinbase: { api: { key: '123', secret: '456' }}}}
class Portfolio {
    constructor(config) {
        this.accounts = _int.accounts.init(config.accounts);
        this.opts = {
            nativeCurrency: 'USD'
        };
    }

    getAccount(accountName) {
        const account = this.accounts.filter(a => (a.name === accountName));
        if (!account) { throw new Error(`No account configured with name: ${accountName}`); }
        return account;
    }

    getAccountBalanceAll() {
        return Promise.resolve(this.accounts)
            .map(async account => {
                const balance = await Promise.props({
                    name:    account.name,
                    balance: account.getBalance()
                });

                const conversions = await Promise.props({
                    BTC:                        account.convertBalanceToCurrency(balance.balance, 'BTC'),
                    [this.opts.nativeCurrency]: account.convertBalanceToCurrency(balance.balance, this.opts.nativeCurrency)
                });

                const btcTotal = Object.entries(conversions.BTC).reduce((t, [k,v]) => {
                    return t.add(Decimal(v.amount));
                }, Decimal(0));

                const nativeTotal = Object.entries(conversions[this.opts.nativeCurrency]).reduce((t, [k,v]) => {
                    return t.add(Decimal(v.amount));
                }, Decimal(0));

                conversions.BTC.total = btcTotal.toString();
                conversions[this.opts.nativeCurrency].total = nativeTotal.toString();

                balance.conversions = conversions;
                return balance;
            });
    }

    getAccountBalance(accountName) {
        return this.getAccount(accountName).getBalance();
    }
}

module.exports = Portfolio;
