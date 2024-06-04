import DataRetriever from './DataRetriever.js';
import Stock from '../models/Stock.js';
class StockListManager {
    constructor() {
        this.stocks = [];
    }
    async addStock(ticker) {
        const price = await DataRetriever.getStockPrice(ticker);
        const stock = new Stock(ticker, price);
        this.stocks.push(stock);
        console.log('stock ' + stock.getTicker() + ' added');
    }
    static getInstance() {
        if (!StockListManager.instance) {
            StockListManager.instance = new StockListManager();
        }
        return StockListManager.instance;
    }
    removeStock(ticker) {
        let stock = this.stocks.find(s => s.getTicker() === ticker);
        if (stock instanceof Stock) {
            this.stocks = this.stocks.filter(s => s !== stock);
        }
        else {
            throw new Error(ticker + " not found in list of all stocks!");
        }
    }
    getStocks() {
        return this.stocks;
    }
    getStock(ticker) {
        let stock = this.stocks.find(s => s.getTicker() === ticker);
        if (stock instanceof Stock) {
            return stock;
        }
        else {
            throw new Error(ticker + " not found in list of all stocks!");
        }
    }
    async getStockPrice(ticker) {
        const newPrice = await DataRetriever.getStockPrice(ticker);
        const stock = this.stocks.find(s => s.getTicker() === ticker);
        if (stock) {
            stock.setPrice(newPrice);
            return newPrice;
        }
        else {
            throw new Error(`Stock with ticker ${ticker} not found`);
        }
    }
    async updateStockPrices() {
        for (const stock of this.stocks) {
            const price = await DataRetriever.getStockPrice(stock.getTicker());
            stock.setPrice(price);
        }
    }
    toJSON() {
        return {
            stocks: this.stocks.map(stock => ({
                ticker: stock.getTicker(),
                price: stock.getPrice(),
                signal: stock.getSignal()
            }))
        };
    }
    fromJSON(json) {
        const instance = StockListManager.getInstance();
        instance.stocks = json.stocks.map((stockData) => new Stock(stockData.ticker, stockData.price, stockData.signal));
        return instance;
    }
}
const instance = StockListManager.getInstance();
export default instance;
