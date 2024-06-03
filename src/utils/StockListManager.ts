import DataRetriever from './DataRetriever.js';
import Stock from '../models/Stock.js';
class StockListManager {
    private static instance: StockListManager;
    private stocks: Stock[] = [];
    private constructor() {
    }

    async addStock(ticker: string) {
        const price = await DataRetriever.getStockPrice(ticker);
        const stock = new Stock(ticker, price);
        this.stocks.push(stock);
        console.log('stock ' + stock.getTicker() + ' added');
    }

    public static getInstance(): StockListManager {
        if (!StockListManager.instance) {
            StockListManager.instance = new StockListManager();
        }
        return StockListManager.instance;
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

    toJSON() {
        return {
            stocks: this.stocks.map(stock => ({
                ticker: stock.getTicker(),
                price: stock.getPrice()
            }))
        };
    }

    fromJSON(json: any): StockListManager {
        const instance = StockListManager.getInstance();
        instance.stocks = json.stocks.map((stockData: any) =>
        new Stock(stockData.ticker, stockData.price));

        return instance;

    }

}

const instance = StockListManager.getInstance();

export default instance;