import { Request, Response } from 'express';
import StateManager from '../utils/StateManager.js';
import Portfolio from "../models/Portfolio.js";
import DataRetriever from "../utils/DataRetriever";
import Stock from "../models/Stock";

const portfolioController = {
    getHoldings: async (req: Request, res: Response) => {
        try {
            const tradeExecutor = StateManager.getTradeExecutor();
            const portfolio: Portfolio = tradeExecutor.getPortfolio();
            const holdings = portfolio.getPortfolio();
            res.status(200).json(holdings);
        } catch (error) {
            res.status(500).json({ error: 'Error fetching portfolio holdings' });
        }
    },

    getBookValue: async (req: Request, res: Response) => {
        const { ticker } = req.params;
        try {
            const tradeExecutor = StateManager.getTradeExecutor();
            const bookValue = tradeExecutor.getPortfolio().getBookValue(ticker);
            res.status(200).json({ ticker, bookValue });
        } catch (error) {
            res.status(500).json({ error: `Error fetching book value for ${ticker}` });
        }
    },

    getValue: async (req: Request, res: Response) => {
        try {
            const tradeExecutor = StateManager.getTradeExecutor();
            const value = tradeExecutor.getPortfolio().getPortfolioValue();
            res.status(200).json({ value });
        } catch (error) {
            res.status(500).json({ error: 'Error fetching portfolio value' });
        }
    },

    getHistoricalValues: async (req: Request, res: Response) => {
        try {
            const tradeExecutor = StateManager.getTradeExecutor();
            const { period } = req.query;
            const historicalData = tradeExecutor.getPortfolio().getHistoricalData(period);
            res.status(200).json(historicalData);
        } catch (error) {
            res.status(500).json({ error: 'Error fetching historical values' });
        }
    },

    buyStock: async (req: Request, res: Response) => {
        const { ticker } = req.params;
        try {
            const tradeExecutor = StateManager.getTradeExecutor();
            const { quantity } = req.body;
            const price = await DataRetriever.getStockPrice(ticker);
            const stock: Stock = tradeExecutor.getPortfolio().buyStock(ticker, price, quantity);
            const response = {stock, price};
            res.status(200).json(res);
        } catch (error) {
            res.status(500).json({ error: `Error buying stock ${ticker}` + error });
        }
    },

    sellStock: async (req: Request, res: Response) => {
        const { ticker } = req.params;
        try {
            const tradeExecutor = StateManager.getTradeExecutor();
            const { quantity } = req.body;
            const price = await DataRetriever.getStockPrice(ticker);
            const result: number = tradeExecutor.getPortfolio().sellStock(ticker, price, quantity);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: `Error selling stock ${ticker}` + error });
        }
    },

    // returns the updated balance in the portfolio
    deposit: async (req: Request, res: Response) => {
        try {
            const tradeExecutor = StateManager.getTradeExecutor();
            const { amount } = req.body;
            const result = tradeExecutor.getPortfolio().deposit(amount);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: 'Error depositing funds' });
        }
    },


    //returns the updated balance
    withdraw: async (req: Request, res: Response) => {
        try {
            const tradeExecutor = StateManager.getTradeExecutor();
            const { amount } = req.body;
            const result = tradeExecutor.getPortfolio().withdraw(amount);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: 'Error withdrawing funds' });
        }
    },
};

export default portfolioController;