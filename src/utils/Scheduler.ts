import cron from 'node-cron';
import DataRetriever from './DataRetriever.js';
import TradingAlgorithm from '../services/TradingAlgorithm.js';
import StockListManager from "./StockListManager.js";

export default class Scheduler {

    //TODO: Ensure that failed analysis and other exceptions are thrown all the way to this point, where this section of
    // the program retries the analysis at a later time.

    private observers: any[];

    constructor() {
        this.observers = [];
    }


    addObserver(observer: any) {
        this.observers.push(observer);
    }

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
        try {
            const signal = await TradingAlgorithm.decision(ticker);
            this.notifyObservers(signal, ticker);
        } catch (error) {
                throw error;
        }
    }



    async delay(ms: number | undefined) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }



    async start(stocks: string[]) {
        for (let i = 0; i < stocks.length; i++) {
            try {
                await StockListManager.addStock(stocks[i]);
            } catch (error) {
                console.error(`Error adding stock ${stocks[i]}: ${error}`);
            }
        }

        await this.continue();
    }


    async continue() {
        cron.schedule('*/20 * * * 1-5', async () => {
            await StockListManager.updateStockPrices();
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
            try {
                const ticker = stock.getTicker();
                await this.generateSignal(ticker);
            } catch (error) {
                console.error(error);
            }
        }
    }


}