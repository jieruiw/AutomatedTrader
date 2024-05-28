
const cron = require('node-cron');
const DataRetriever = require('./DataRetriever');
const TradingAlgorithm = require('../services/TradingAlgorithm');
const StockListManager = require("./StockListManager");
class Scheduler {

    //TODO: Ensure that failed analysis and other exceptions are thrown all the way to this point, where this section of
    // the program retries the analysis at a later time.

    constructor(config) {
        this.observers = [];
        this.tradingAlgorithm = new TradingAlgorithm(config);
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
        const signal = await this.tradingAlgorithm.decision(ticker, this.tradingAlgorithm.config);
        this.notifyObservers(signal, ticker);
    }

    async updateStockPrices() {
        const stocks = StockListManager.getStocks();
        for (const stock of stocks) {
            const price = await DataRetriever.getStockPrice(stock.getTicker());
            stock.setPrice(price);
        }
    }

    start() {
        // Schedule stock price updates every 2 minutes
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
                    const ticker = stocks[i];
                    await this.generateSignal(ticker);
                }
            }, {
                scheduled: true,
                timezone: "America/Vancouver"
            });
        }
    }




}

module.exports = Scheduler;