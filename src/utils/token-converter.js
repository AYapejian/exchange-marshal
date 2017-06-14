const tokenConverter = module.exports = {};

tokenConverter.convertBalanceToCurrency = async function (normalizedBalance, targetCurrency) {
        const convertedBalance = Object.keys(normalizedBalance)
            .map(async key => {
                const b = normalizedBalance[key];

                const convertResult = await this.convertCurrency({
                    sourceCurrency: b.tickerCommon,
                    sourceAmount:   b.balance,
                    targetCurrency: targetCurrency
                });

                return {
                    sourceCurrency: b.ticker,
                    targetCurrency: convertResult.targetCurrency,
                    targetAmount:   convertResult.targetAmount
                };
            });

        return Promise.all(convertedBalance)
            .then(convertResult => {
                const returnConversions = convertResult.reduce((obj, item) => {
                    obj[item.sourceCurrency] = {
                        amount: item.targetAmount
                    };
                    return obj;
                }, {});
                return returnConversions;
            });
};

tokenConverter.convertBalanceToCurrency = function convertCurrency({ sourceCurrency, sourceAmount, targetCurrency }) {
        return converter.convert({ sourceCurrency, sourceAmount, targetCurrency });
};
