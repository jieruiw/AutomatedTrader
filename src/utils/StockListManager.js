const DataRetriever = require('./DataRetriever');
class StockListManager {
    constructor() {
        if (!StockListManager.instance) {
            this.stocks = [];
            StockListManager.instance = this;
        }

        return StockListManager.instance;
    }

    addStock(stock) {
        this.stocks.push(stock);
    }

    removeStock(stock) {
        this.stocks = this.stocks.filter(s => s !== stock);
    }

    getStocks() {
        return this.stocks;
    }

    updateStockPrice() {
        //TODO
    }

    getStockPrice(ticker) {
        const newPrice = DataRetriever.getStockPrice(ticker);
        this.updateStockPrice(newPrice);
        return newPrice;
    }
}

const instance = new StockListManager();
Object.freeze(instance);

export default instance;