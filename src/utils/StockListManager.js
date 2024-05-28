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
}

const instance = new StockListManager();
Object.freeze(instance);

export default instance;