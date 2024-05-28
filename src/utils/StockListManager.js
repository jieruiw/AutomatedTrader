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

    async getStockPrice(ticker) {
        const newPrice = DataRetriever.getStockPrice(ticker);
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

export default instance;