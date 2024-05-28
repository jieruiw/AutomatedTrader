const DataRetriever = require('./DataRetriever');
const Stock = require("../models/Stock");
class StockListManager {
    constructor() {
        if (!StockListManager.instance) {
            this.stocks = [];
            StockListManager.instance = this;
        }

        return StockListManager.instance;
    }

    async addStock(ticker) {
        const price = await DataRetriever.getStockPrice(ticker);
        const stock = new Stock(ticker, price);
        this.stocks.push(stock);
        console.log('stock ' + stock.getTicker() + ' added');
    }

    removeStock(stock) {
        this.stocks = this.stocks.filter(s => s !== stock);
    }

    getStocks() {
        return this.stocks;
    }

    async getStockPrice(ticker) {
        const newPrice = await DataRetriever.getStockPrice(ticker);
        const stock = this.stocks.find(s => s.getTicker() === ticker);
        if (stock) {
            stock.setPrice(newPrice);
            return newPrice;
        } else {
            throw new Error(`Stock with ticker ${ticker} not found`);
        }
    }
}

const instance = new StockListManager();
Object.freeze(instance);

module.exports = instance;