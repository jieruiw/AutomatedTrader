import StockListManager from '../utils/StockListManager.js';
import DataRetriever from '../utils/DataRetriever.js';
import TradingAlgorithm from "../services/TradingAlgorithm.js";
import StateManager from "../utils/StateManager.js";
const stockListController = {
    // GET endpoint for getting all monitored stocks
    getStocks: async (req, res) => {
        try {
            const stocks = StockListManager.getStocks();
            stocks.sort((a, b) => {
                // If a's signal is null and b's signal is not null, a should come after b
                if (a.signal === null && b.signal !== null) {
                    return 1;
                }
                // If b's signal is null and a's signal is not null, b should come after a
                if (b.signal === null && a.signal !== null) {
                    return -1;
                }
                // If both signals are null, they remain in their current order (0 means no change)
                if (a.signal === null && b.signal === null) {
                    return 0;
                }
                else
                    // If both signals are present, sort by signal in descending order
                    return b.signal - a.signal;
            });
            res.status(200).json(stocks);
        }
        catch (error) {
            res.status(500).json({ error: 'Error fetching stocks' });
        }
    },
    // GET endpoint for getting the price of a specific stock
    getStockPrice: async (req, res) => {
        const { ticker } = req.params;
        try {
            const price = await DataRetriever.getStockPrice(ticker);
            StockListManager.getStock(ticker).setPrice(price);
            res.status(200).json({ ticker, price });
        }
        catch (error) {
            res.status(500).json({ error: `Error fetching stock price for ${ticker}: ${error}` });
        }
    },
    // GET endpoint for getting the signal score of a specific stock
    getSignal: async (req, res) => {
        const { ticker } = req.params;
        try {
            const signal = await TradingAlgorithm.decision(ticker); // Placeholder, implement as needed
            res.status(200).json({ ticker, signal });
        }
        catch (error) {
            res.status(500).json({ error: `Error fetching signal for ${ticker}: ${error}` });
        }
    },
    // POST endpoint for adding a stock to the monitored list
    addStock: async (req, res) => {
        const { ticker } = req.params;
        try {
            await StockListManager.addStock(ticker);
            res.status(200).json({ message: `Stock ${ticker} added successfully` });
        }
        catch (error) {
            res.status(500).json({ error: `Error adding stock ${ticker}: ${error}` });
        }
    },
    // DELETE endpoint for removing a stock from the monitored list
    removeStock: async (req, res) => {
        const { ticker } = req.params;
        try {
            StockListManager.removeStock(ticker);
            res.status(200).json({ message: `Stock ${ticker} removed successfully` });
        }
        catch (error) {
            res.status(500).json({ error: `Error removing stock ${ticker}: ${error}` });
        }
    },
    // PUT endpoint for updating information (price and signal) for all monitored stocks
    update: async (req, res) => {
        try {
            const stocks = StockListManager.getStocks();
            for (const stock of stocks) {
                const ticker = stock.getTicker();
                const newPrice = await DataRetriever.getStockPrice(ticker);
                stock.setPrice(newPrice);
                // Assume a function to update the signal, implement as needed
                const newSignal = await TradingAlgorithm.decision(ticker);
                stock.setSignal(newSignal);
            }
            res.status(200).json({ message: 'All stocks updated successfully' });
        }
        catch (error) {
            res.status(500).json({ error: 'Error updating stocks: ' + error });
        }
    },
    run: async (req, res) => {
        try {
            const tradeExecutor = StateManager.getTradeExecutor();
            const stocks = StockListManager.getStocks();
            for (const stock of stocks) {
                const ticker = stock.getTicker();
                const newPrice = await DataRetriever.getStockPrice(ticker);
                stock.setPrice(newPrice);
                const newSignal = await TradingAlgorithm.decision(ticker);
                stock.setSignal(newSignal);
                await tradeExecutor.executeTrade(newSignal, ticker);
            }
            res.status(200).json({ message: 'Algorithm completed' });
        }
        catch (error) {
            res.status(500).json({ error: 'Error updating running algorithm: ' + error });
        }
    }
};
export default stockListController;
