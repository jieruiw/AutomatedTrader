import { Request, Response } from 'express';
import StockListManager from '../utils/StockListManager';
import DataRetriever from '../utils/DataRetriever';
import TradingAlgorithm from "../services/TradingAlgorithm";
import StateManager from "../utils/StateManager";

const stockListController = {
    // GET endpoint for getting all monitored stocks
    getStocks: async (req: Request, res: Response) => {
        try {
            const stocks = StockListManager.getStocks();
            res.status(200).json(stocks);
        } catch (error) {
            res.status(500).json({ error: 'Error fetching stocks' });
        }
    },

    // GET endpoint for getting the price of a specific stock
    getStockPrice: async (req: Request, res: Response) => {
        const { ticker } = req.params;
        try {
            const price = await DataRetriever.getStockPrice(ticker);

                StockListManager.getStock(ticker).setPrice(price);
            res.status(200).json({ ticker, price });
        } catch (error) {
            res.status(500).json({ error: `Error fetching stock price for ${ticker}: ${error}` });
        }
    },

    // GET endpoint for getting the signal score of a specific stock
    getSignal: async (req: Request, res: Response) => {
        const { ticker } = req.params;
        try {
            const signal = await TradingAlgorithm.decision(ticker); // Placeholder, implement as needed
            res.status(200).json({ ticker, signal });
        } catch (error) {
            res.status(500).json({ error: `Error fetching signal for ${ticker}: ${error}` });
        }
    },

    // POST endpoint for adding a stock to the monitored list
    addStock: async (req: Request, res: Response) => {
        const { ticker } = req.params;
        try {
            await StockListManager.addStock(ticker);
            res.status(200).json({ message: `Stock ${ticker} added successfully` });
        } catch (error) {
            res.status(500).json({ error: `Error adding stock ${ticker}: ${error}` });
        }
    },

    // DELETE endpoint for removing a stock from the monitored list
    removeStock: async (req: Request, res: Response) => {
        const { ticker } = req.params;
        try {
            StockListManager.removeStock(ticker);
            res.status(200).json({ message: `Stock ${ticker} removed successfully` });
        } catch (error) {
            res.status(500).json({ error: `Error removing stock ${ticker}: ${error}` });
        }
    },

    // PUT endpoint for updating information (price and signal) for all monitored stocks
    update: async (req: Request, res: Response) => {
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
        } catch (error) {
            res.status(500).json({ error: 'Error updating stocks: ' + error });
        }
    },

    run: async (req: Request, res: Response) => {
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
        } catch (error) {
            res.status(500).json({ error: 'Error updating running algorithm: ' + error });
        }
    }
};

export default stockListController;