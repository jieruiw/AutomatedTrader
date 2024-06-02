import Scheduler from './utils/Scheduler.js';
import TradeExecutor from './services/TradeExecutor.js';
import Config from "./utils/Config.js";


Config.set(0.3, 0.5, 0.2, 0.1);

// Initial cash balance for the portfolio
const initialCash = 100000;

// Initialize the Trade Executor
const tradeExecutor = new TradeExecutor(initialCash);

// Add some stocks to the Stock List Manager for monitoring (example stocks)
let stocks = ['TSLA', 'AAPL', 'NVDA', 'MGM', 'GPS', 'AMZN', 'RIVN', 'F', 'MSFT', 'META',
    'GOOG', 'LLY', 'JPM', 'PG', 'AMD', 'PYPL', 'EXC', 'EA', 'BIIB', 'JD', 'HPQ', 'RCL', 'ARM', 'ANF',
    'CHWY', 'JNJ', 'PFE', 'MRK', 'UNH', 'ABBV', 'BAC', 'GS', 'C', 'WFC', 'KO', 'PEP', 'UL', 'CL', 'GE',
    'BA', 'CAT', 'MMM', 'HON', 'XOM', 'CVX', 'COP', 'SLB', 'HAL', 'NEE', 'DUK', 'D', 'SO', 'AEP', 'VZ', 'T',
    'TMUS', 'CMCSA', 'CHTR', 'DIS', 'MCD', 'SBUX', 'NFLX', 'BKNG', 'LNTH'];
// Initialize the Scheduler
const scheduler = new Scheduler();

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