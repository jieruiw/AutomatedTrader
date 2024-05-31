import Scheduler from './utils/Scheduler.js';
import TradeExecutor from './services/TradeExecutor.js';
import StockListManager from './utils/StockListManager.js';

// Configuration object for the trading algorithm and other components
const config = {
    weights: {
        zacks: 0.3,
        technical: 0.5,
        analyst: 0.2
    },
    maxCap: 0.1 // Example configuration for max investment in a single stock
};

// Initial cash balance for the portfolio
const initialCash = 100000;

// Initialize the Trade Executor
const tradeExecutor = new TradeExecutor(config, initialCash);

// Add some stocks to the Stock List Manager for monitoring (example stocks)
let stocks = ['TSLA', 'AAPL'];
// Initialize the Scheduler
const scheduler = new Scheduler(config);

// Add TradeExecutor as an observer to the Scheduler
scheduler.addObserver(tradeExecutor);

// Async function to manage the flow
async function initialize() {
    // Start the Scheduler
    await scheduler.start(stocks);

    // Manually trigger the stock check
    await scheduler.manualCheck();

    console.log('Trading application started...');
}

// Call the initialize function
initialize();


//TODO: save application process and ability to resume, and also dynamically interact with program.