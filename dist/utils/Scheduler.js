import cron from 'node-cron';
import DataRetriever from './DataRetriever.js';
import TradingAlgorithm from '../services/TradingAlgorithm.js';
import StockListManager from "./StockListManager.js";
export default class Scheduler {
    constructor() {
        this.observers = [];
        this.tradingAlgorithm = new TradingAlgorithm();
    }
    addObserver(observer) {
        this.observers.push(observer);
    }
    // Method to remove an observer
    removeObserver(observer) {
        this.observers = this.observers.filter(obs => obs !== observer);
    }
    notifyObservers(signal, ticker) {
        for (const observer of this.observers) {
            observer.update(signal, ticker);
        }
    }
    //todo: implement a manual stock check button
    async generateSignal(ticker) {
        const signal = await this.tradingAlgorithm.decision(ticker);
        this.notifyObservers(signal, ticker);
    }
    async updateStockPrices() {
        const stocks = StockListManager.getStocks();
        for (const stock of stocks) {
            const price = await DataRetriever.getStockPrice(stock.getTicker());
            stock.setPrice(price);
        }
    }
    async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    async start(stocks) {
        for (const ticker of stocks) {
            await StockListManager.addStock(ticker);
        }
        await this.continue();
    }
    async continue() {
        cron.schedule('*/2 * * * 1-5', async () => {
            await this.updateStockPrices();
        }, {
            scheduled: true,
            timezone: "America/Vancouver"
        });
        // Schedule trading signals twice a day
        const times = [
            '30 6 * * 1-5', // 6:30 AM PST during trading (9:30 AM EST)
            '30 12 * * 1-5' // 12:30 PM PST during trading (3:30 PM EST)
        ];
        for (const time of times) {
            cron.schedule(time, async () => {
                const stocks = StockListManager.getStocks();
                for (let i = 0; i < stocks.length; i++) {
                    const stock = stocks[i];
                    const ticker = stock.getTicker();
                    console.log("ticker got for: " + ticker);
                    await this.generateSignal(ticker);
                    await this.delay(10000);
                }
            }, {
                scheduled: true,
                timezone: "America/Vancouver"
            });
        }
    }
    async manualCheck() {
        const stocks = StockListManager.getStocks();
        for (const stock of stocks) {
            const ticker = stock.getTicker();
            await this.generateSignal(ticker);
            await this.delay(10000);
        }
    }
}
