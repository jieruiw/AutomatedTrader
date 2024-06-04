import Portfolio from '../models/Portfolio.js';
import StockListManager from "../utils/StockListManager.js";
import Config from "../utils/Config.js";
export default class TradeExecutor {
    constructor(cash) {
        this.portfolio = new Portfolio(cash, new Date());
    }
    getPortfolio() {
        return this.portfolio;
    }
    async update(signal, ticker) {
        console.log(`Received signal for ${ticker}: ${signal}`);
        StockListManager.getStock(ticker).setSignal(signal);
        await this.executeTrade(signal, ticker);
    }
    // Method to execute trades based on the signal
    async executeTrade(signal, ticker) {
        const currStockPrice = await StockListManager.getStockPrice(ticker);
        const currentStockValue = this.portfolio.getHoldings(ticker) * currStockPrice;
        const totalValue = this.portfolio.getPortfolioValue();
        const maxInvestment = totalValue * Config.maxCap;
        console.log("current price for " + ticker + " is " + currStockPrice);
        console.log(", currently have " + currentStockValue + " of the stock. Can invest " + maxInvestment);
        if (signal >= 35 && currentStockValue < maxInvestment) {
            console.log("we can invest more in " + ticker);
            // Check if we can invest more in this stock without exceeding the cap
            const availableCash = this.portfolio.getCash();
            const amountToInvest = Math.min(maxInvestment - currentStockValue, availableCash);
            if (amountToInvest > 0) {
                const quantity = Math.floor(amountToInvest / currStockPrice);
                if (quantity > 0) {
                    await this.portfolio.buyStock(ticker, currStockPrice, quantity);
                    const date = new Date();
                }
            }
        }
        else if (signal <= -35) {
            const quantity = this.portfolio.getHoldings(ticker);
            if (quantity > 0) {
                this.portfolio.sellStock(ticker, currStockPrice, quantity);
            }
        }
    }
    toJSON() {
        return {
            portfolio: this.portfolio.toJSON()
        };
    }
    static fromJSON(json) {
        let portfolio = new Portfolio(0, new Date());
        portfolio = portfolio.fromJSON(json.portfolio);
        const tradeExecutor = new TradeExecutor(portfolio.getCash());
        tradeExecutor.portfolio = portfolio;
        return tradeExecutor;
    }
}
