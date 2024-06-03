import cron from 'node-cron';
import DataRetriever from './DataRetriever.js';
import TradingAlgorithm from '../services/TradingAlgorithm.js';
import StockListManager from "./StockListManager.js";

export default class Scheduler {

    //TODO: Ensure that failed analysis and other exceptions are thrown all the way to this point, where this section of
    // the program retries the analysis at a later time.

    private observers: any[];
    private tradingAlgorithm: TradingAlgorithm;

    constructor() {
        this.observers = [];
        this.tradingAlgorithm = new TradingAlgorithm();
    }


    addObserver(observer: any) {
        this.observers.push(observer);
    }

    // Method to remove an observer
    removeObserver(observer: any) {
        this.observers = this.observers.filter(obs => obs !== observer);
    }

    notifyObservers(signal: number, ticker: string) {
        for (const observer of this.observers) {
            observer.update(signal, ticker);
        }
    }

    //todo: implement a manual stock check button

    async generateSignal(ticker: string) {
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

    async delay(ms: number | undefined) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    async start(stocks: string[]) {
        for (let i = 0; i < stocks.length; i++) {
            await StockListManager.addStock(stocks[i]);

            // Add a 2-second delay every 60 stocks
            if ((i + 1) % 60 === 0) {
                await new Promise(resolve => setTimeout(resolve, 20000));
            }
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
            '30 6 * * 1-5',  // 6:30 AM PST during trading (9:30 AM EST)
            '30 12 * * 1-5'  // 12:30 PM PST during trading (3:30 PM EST)
        ];

        for (const time of times) {
            cron.schedule(time, async () => {
                const stocks = StockListManager.getStocks();
                for (let i = 0; i < stocks.length; i++) {
                    const stock = stocks[i];
                    const ticker = stock.getTicker();
                    console.log("ticker got for: " + ticker);
                    await this.generateSignal(ticker);
                    await this.delay(1000);
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
            await this.delay(1000);
        }
    }


}