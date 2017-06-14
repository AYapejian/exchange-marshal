/* eslint-disable no-console */
const normalizer = require('../utils/normalizer');

class Exchange {
    constructor({ displayName, name, type, api }) {
        this.displayName = displayName;
        this.name        = name;
        this.type        = type;
        this.api         = api;
    }
    replyObject () { return { timestamp: new Date().toISOString(), data: [], error: null } }

    async getData(subMethod, subMethodOptions) {
        const apiData = this.replyObject();
        try {
            let data = await subMethod.call(this, subMethodOptions)
            apiData.data = data;
        } catch (e) {
            apiData.error = normalizer.normalizeError(e, this.normalizeMap.error);
        }
        return apiData;
    }

    // Public API Calls
    _getTicker() { return { type: 'warning', message: `${this.displayName}: _getTicker() not implemented` }; }

    // TODO: Change the getData method above to handle all requests and return the transformed
    // data in a wrapper object along with timestamp and any errors translated as well
    async getTicker(pair) {
        let apiData = await this.getData(this._getTicker, pair);
        if (apiData.type === 'warning') { return apiData; }
        if (!apiData) { return null; }
        apiData.data = normalizer.normalizeSingleObject(apiData.data, this.normalizeMap.ticker);
        return apiData
    }

    // Private API Calls
    _getBalance()           { return { type: 'warning', message: `${this.displayName}: _getBalance() not implemented` };           }
    _getOrders()            { return { type: 'warning', message: `${this.displayName}: _getOrders() not implemented` };            }
    _getOrderHistory()      { return { type: 'warning', message: `${this.displayName}: _getOrderHistory() not implemented` };      }
    _getWithdrawalHistory() { return { type: 'warning', message: `${this.displayName}: _getWithdrawalHistory() not implemented` }; }
    _getDepositHistory()    { return { type: 'warning', message: `${this.displayName}: _getDepositHistory() not implemented` };    }

    async getBalance() {
        let apiData = await this._getBalance();
        if (apiData.type === 'warning') { return apiData; }
        const normalizedData = normalizer.normalizeBalance(apiData, this.normalizeMap.balance);
        return normalizedData;
    }
    async getOrders() {
        let apiData = await this._getOrders();
        if (apiData.type === 'warning') { return apiData; }
        const normalizedData = normalizer.normalizeCommon(apiData, this.normalizeMap.orders);
        return normalizedData;
    }
    async getOrderHistory() {
        let apiData = await this._getOrderHistory();
        if (apiData.type === 'warning') { return apiData; }
        const normalizedData = normalizer.normalizeCommon(apiData, this.normalizeMap.orderHistory);
        return normalizedData;
    }
    async getWithdrawalHistory() {
        let apiData = await this._getWithdrawalHistory();
        if (apiData.type === 'warning') { return apiData; }
        const normalizedData = normalizer.normalizeCommon(apiData, this.normalizeMap.withdrawalHistory);
        return normalizedData;
    }
    async getDepositHistory() {
        let apiData = await this._getDepositHistory();
        if (apiData.type === 'warning') { return apiData; }
        const normalizedData =  normalizer.normalizeCommon(apiData, this.normalizeMap.depositHistory);
        return normalizedData;
    }

}

module.exports = Exchange;
