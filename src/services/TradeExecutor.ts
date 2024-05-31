import Logger from '../utils/Logger.js';
import Portfolio from '../models/Portfolio.js';
import StockListManager from "../utils/StockListManager.js";

export default class TradeExecutor {

    //TODO: Encorporate a max cap on one stock investment based on total value
    //TODO: decide to buy, sell, hold, or do nothing based on signal
    private logger: Logger;
    private portfolio: Portfolio;
    private maxCap: number;

    constructor(config: {
            weights: {
                zacks: number; technical: number; analyst: number;
            }; maxCap: any;
        }, cash: number) {
        this.logger = new Logger();
        this.portfolio = new Portfolio(cash, new Date());
        this.maxCap = config.maxCap;
    }

    async update(signal: number, ticker: any) {
        console.log(`Received signal for ${ticker}: ${signal}`);
        await this.executeTrade(signal, ticker);
    }

    // Method to execute trades based on the signal
    async executeTrade(signal: number, ticker: string) {
        const currStockPrice = await StockListManager.getStockPrice(ticker);
        const currentStockValue = this.portfolio.getHoldings(ticker) * currStockPrice;
        const totalValue = this.portfolio.getCash() + this.portfolio.getPortfolioValue();
        const maxInvestment = totalValue * this.maxCap;

        console.log("current price for " + ticker + " is " + currStockPrice);
        console.log(", currently have" + currentStockValue + " of the stock. Can invest " + maxInvestment);

        if (signal > 40 && currentStockValue < maxInvestment) {
            console.log("we can invest more in " + ticker);
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
