import test from 'ava'
const exchangeMarshal = require('../utils').getExchangeMarshal();

test('should get balance from kraken', async t => {
    const kraken = exchangeMarshal.getExchange('kraken');
    const x = await kraken.getBalance();
    const aBalance = x[Object.keys(x)[0]];

    t.truthy(aBalance, 'should have found a balance');

    const balanceKeys = Object.keys(aBalance);
    t.deepEqual(balanceKeys, ['id', 'ticker', 'available', 'balance', 'tickerCommon', '_originalBalance'], 'should have all common balance keys');
});
