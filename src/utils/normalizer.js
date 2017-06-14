const transform = require('js-object-transform');
const normalizer = module.exports = {};

normalizer.normalizeBalance = function normalizeBalance(apiBalance, normalizeMap) {
    const returnBalance = Object.keys(apiBalance)
        .reduce((reduceReturnBalance, key) => {
            const transformedBalance = transform(apiBalance[key], normalizeMap);

            // Filter out 0 balance that some exchanges send
            if (parseFloat(transformedBalance.balance) <= 0) { return reduceReturnBalance; }

            transformedBalance.tickerCommon = normalizer.getCommonTicker(transformedBalance.ticker);
            transformedBalance._originalBalance = apiBalance[key];

            reduceReturnBalance[transformedBalance.tickerCommon] = transformedBalance;
            return reduceReturnBalance;
        }, {});

        return returnBalance;
};

normalizer.normalizeSingleObject = function normalizeTicker (apiData, normalizeMap) {
    return transform(apiData, normalizeMap);
};

normalizer.normalizeError = (err, normalizeMap) => transform(err, normalizeMap)

normalizer.objectValsToString = (obj) => Object.entries(obj)
    .reduce(function(redObj, [key, value]) {
        value = (value) ? value.toString() : '';
        redObj[key] = value;
        return redObj;
    }, {});

normalizer.normalizeCommon = function normalizeCommon(apiData, normalizeMap) {
    const returnData = apiData.reduce((reducedData, reducedItem) => {
            let transformedItem = transform(reducedItem, normalizeMap);
            transformedItem = normalizer.objectValsToString(transformedItem);
            reducedData.push(transformedItem);
            return reducedData;
        }, []);

        return returnData;
};

normalizer.getCommonTicker = function(exchangeTicker) {
    switch (exchangeTicker) {
    case 'ZUSD':
        return 'USD';
    case 'USDT':
        return 'USD';
    case 'XETH':
        return 'ETH';
    case 'XXBT':
        return 'BTC';
    case 'XETC':
        return 'ETC';
    default:
        return exchangeTicker;
    }
};
