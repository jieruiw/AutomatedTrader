import cron from 'node-cron';
import TradingAlgorithm from '../services/TradingAlgorithm.js';
import StockListManager from "./StockListManager.js";
import DatabaseManager from "./DatabaseManager.js";
import StateManager from "./StateManager.js";

export default class Scheduler {


    notifyExecutor(signal: number, ticker: string) {
        StateManager.getTradeExecutor().update(signal, ticker);
    }

    //todo: implement a manual stock check button

    async generateSignal(ticker: string) {
        try {
            const signal = await TradingAlgorithm.decision(ticker);
            this.notifyExecutor(signal, ticker);
        } catch (error) {
                throw error;
        }
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
        cron.schedule('*/20 6-13 * * 1-5', async () => {
            await StockListManager.updateStockPrices();
            const value = StateManager.getTradeExecutor().getPortfolio().getPortfolioValue();
            const date = new Date();
            await DatabaseManager.logPortfolioValue(date, value);
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


}