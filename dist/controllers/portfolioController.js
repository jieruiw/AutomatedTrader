import StateManager from '../utils/StateManager.js';
import DataRetriever from "../utils/DataRetriever.js";
import DatabaseManager from "../utils/DatabaseManager.js";
const portfolioController = {
    getHoldings: async (req, res) => {
        try {
            const tradeExecutor = StateManager.getTradeExecutor();
            const portfolio = tradeExecutor.getPortfolio();
            const holdings = portfolio.getPortfolio();
            res.status(200).json(holdings);
        }
        catch (error) {
            res.status(500).json({ error: 'Error fetching portfolio holdings' });
        }
    },
    getBookValue: async (req, res) => {
        const { ticker } = req.params;
        try {
            const bookValue = await DatabaseManager.getBookValue(ticker);
            res.status(200).json({ ticker, bookValue });
        }
        catch (error) {
            res.status(500).json({ error: `Error fetching book value for ${ticker}` });
        }
    },
    getValue: async (req, res) => {
        try {
            const tradeExecutor = StateManager.getTradeExecutor();
            const value = tradeExecutor.getPortfolio().getPortfolioValue();
            res.status(200).json({ value });
        }
        catch (error) {
            res.status(500).json({ error: 'Error fetching portfolio value' });
        }
    },
    getCash: async (req, res) => {
        try {
            const tradeExecutor = StateManager.getTradeExecutor();
            const portfolio = tradeExecutor.getPortfolio();
            const balance = portfolio.getCash();
            res.status(200).json(balance);
        }
        catch (error) {
            res.status(500).json({ error: 'Error fetching current balance' });
        }
    },
    getHistoricalValues: async (req, res) => {
        try {
            const period = req.query.period;
            if (!period) {
                res.status(400).json({ error: 'Period is required' });
                return;
            }
            const historicalData = await DatabaseManager.getHistoricalData(period);
            res.status(200).json(historicalData);
        }
        catch (error) {
            res.status(500).json({ error: 'Error fetching historical values' });
        }
    },
    buyStock: async (req, res) => {
        const { ticker } = req.params;
        try {
            const tradeExecutor = StateManager.getTradeExecutor();
            const { quantity } = req.body;
            const price = await DataRetriever.getStockPrice(ticker);
            const stock = await tradeExecutor.getPortfolio().buyStock(ticker, price, quantity);
            const totalCost = price * quantity;
            const response = { stock, totalCost };
            res.status(200).json(response);
        }
        catch (error) {
            res.status(500).json({ error: `Error buying stock ${ticker}` + error });
        }
    },
    sellStock: async (req, res) => {
        const { ticker } = req.params;
        try {
            const tradeExecutor = StateManager.getTradeExecutor();
            const { quantity } = req.body;
            const price = await DataRetriever.getStockPrice(ticker);
            const result = await tradeExecutor.getPortfolio().sellStock(ticker, price, quantity);
            res.status(200).json(result);
        }
        catch (error) {
            res.status(500).json({ error: `Error selling stock ${ticker}` + error });
        }
    },
    // returns the updated balance in the portfolio
    deposit: async (req, res) => {
        try {
            const tradeExecutor = StateManager.getTradeExecutor();
            const { amount } = req.body;
            const result = tradeExecutor.getPortfolio().deposit(amount);
            res.status(200).json(result);
        }
        catch (error) {
            res.status(500).json({ error: 'Error depositing funds' });
        }
    },
    //returns the updated balance
    withdraw: async (req, res) => {
        try {
            const tradeExecutor = StateManager.getTradeExecutor();
            const { amount } = req.body;
            const result = tradeExecutor.getPortfolio().withdraw(amount);
            res.status(200).json(result);
        }
        catch (error) {
            res.status(500).json({ error: 'Error withdrawing funds' });
        }
    },
    getTransactions: async (req, res) => {
        try {
            const transactions = await DatabaseManager.getTransactions();
            res.status(200).json(transactions);
        }
        catch (error) {
            res.status(500).json({ error: 'Error fetching current balance' });
        }
    }
};
export default portfolioController;
