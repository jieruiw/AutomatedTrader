const Logger = require('../../src/utils/Logger');
const Portfolio = require('../models/Portfolio');
const StockListManager = require("../utils/StockListManager");

class TradeExecutor {

    //TODO: Encorporate a max cap on one stock investment based on total value
    //TODO: decide to buy, sell, hold, or do nothing based on signal

    constructor(config, cash) {
        this.logger = new Logger();
        this.portfolio = new Portfolio(cash, new Date());
        this.maxCap = config.maxCap;
    }

    update(signal, ticker) {
        console.log(`Received signal for ${ticker}: ${signal}`);
        this.executeTrade(signal, ticker);
    }

    // Method to execute trades based on the signal
    executeTrade(signal, ticker) {
        const currStockPrice = StockListManager.getStockPrice(ticker);
        const currentStockValue = this.portfolio.getHoldings(ticker) * currStockPrice;
        const totalValue = this.portfolio.getCash() + this.portfolio.getTotalStockValue();
        const maxInvestment = totalValue * this.maxCap;

        if (signal > 40 && currentStockValue < maxInvestment) {
            // Check if we can invest more in this stock without exceeding the cap
            const availableCash = this.portfolio.getCash();
            const amountToInvest = Math.min(maxInvestment - currentStockValue, availableCash);

            if (amountToInvest > 0) {
                const quantity = Math.floor(amountToInvest / currStockPrice);
                if (quantity > 0) {
                    this.portfolio.buyStock(ticker, currStockPrice, quantity);
                    this.logger.log(`Bought ${quantity} shares of ${ticker} at ${currStockPrice} each.`);
                }
            }
        } else if (signal < -40) {
            const quantity = this.portfolio.getHoldings(ticker);
            if (quantity > 0) {
                this.portfolio.sellStock(ticker, currStockPrice, quantity);
                this.logger.log(`Sold ${quantity} shares of ${ticker} at ${currStockPrice} each.`);
            }
        } else if (this.portfolio.getHoldings(ticker) > 0) {
            this.logger.log(`Holding ${ticker}. No action taken.`);
        } else {
            this.logger.log(`No action for ${ticker}.`);
        }
    }


}

module.exports = TradeExecutor;