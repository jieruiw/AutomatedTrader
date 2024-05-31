import DataRetriever from './DataRetriever.js';
import Stock from '../models/Stock.js';
class StockListManager {
    private static instance: StockListManager;
    private stocks: Stock[] = [];
    constructor() {
        if (!StockListManager.instance) {
            StockListManager.instance = this;
        }

        return StockListManager.instance;
    }

    async addStock(ticker: string) {
        const price = await DataRetriever.getStockPrice(ticker);
        const stock = new Stock(ticker, price);
        this.stocks.push(stock);
        console.log('stock ' + stock.getTicker() + ' added');
    }

    removeStock(ticker: string) {
        let stock = this.stocks.find(s => s.getTicker() === ticker);
        if ( stock instanceof Stock) {
            this.stocks = this.stocks.filter(s => s !== stock);
        } else {
            throw new Error(ticker + " not found in list of all stocks!");
        }
    }

    getStocks() {
        return this.stocks;
    }

    getStock(ticker: string) {

        let stock = this.stocks.find(s => s.getTicker() === ticker);
        if ( stock instanceof Stock) {
            return stock;
        } else {
            throw new Error(ticker + " not found in list of all stocks!");
        }
    }

    async getStockPrice(ticker: string) {
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

export default instance;