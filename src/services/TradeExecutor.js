const Logger = require('../../src/utils/Logger');
const Portfolio = require('../models/Portfolio');

class TradeExecutor {

    //TODO: Encorporate a max cap on one stock investment based on total value
    //TODO: decide to buy, sell, hold, or do nothing based on signal

    constructor(config, cash) {
        this.logger = new Logger();
        this.portfolio = new Portfolio(cash, new Date());
    }

    update(signal) {
        console.log(`Received signal: ${signal}`);
        this.executeTrade(signal);
    }

    // Method to execute trades based on the signal
    executeTrade(signal) {
        // Placeholder for trade execution logic
        // e.g., if signal is "buy", buy the stock
        // e.g., if signal is "sell", sell the stock

        // Update portfolio accordingly
        // this.portfolio.update(signal);
        console.log(`Executing trade based on signal: ${signal}`);
    }


}

module.export = TradeExecutor;