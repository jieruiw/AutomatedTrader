import express from 'express';
import portfolioController from '../controllers/portfolioController.js';
import stockListController from '../controllers/stockListController.js';
const router = express.Router();
// GET endpoint for getting portfolio holdings
// BROKEN
router.get('/portfolio', portfolioController.getHoldings);
// GET endpoint for getting bookvalue of a stock
// Verified WORKS, BUT:
router.get('/portfolio/bookvalue/:ticker', portfolioController.getBookValue);
// GET endpoint for getting current portfolio value
// Returns a number, but have to verify if it will give updated value
router.get('/portfolio/value', portfolioController.getValue);
// GET endpoint for getting current portfolio balance
// VERIFIED WORKS
router.get('/portfolio/cash', portfolioController.getCash);
// getting all transactions
// VERIFIED WORKS
router.get('/portfolio/transactions', portfolioController.getTransactions);
// GET endpoint for getting historical values for a specified period
// BROKEN, and also stores multiple entries for one day.
router.get('/portfolio/history', portfolioController.getHistoricalValues);
// WORKING, but: check below and sell:
// TODO: when there are multiple buys for a single stock, calculate the average Bookvalue
// may need a number of stocks bought for the stockPurchases database storage, for this objective
router.post('/portfolio/buy/:ticker', portfolioController.buyStock);
// WORKING, BUT:
// TODO: 1. only remove the transaction from database if sold ALL the holdings
// TODO: 2. find way to calculate the average book value, if bought several times at multiple prices (lower priority)
router.post('/portfolio/sell/:ticker', portfolioController.sellStock);
// either broken or dont know how to use
router.post('/portfolio/deposit', portfolioController.deposit);
// either broken or dont know how to use
router.post('/portfolio/withdraw', portfolioController.withdraw);
// verified works
// TODO sort in terms of signal
router.get('/stocks', stockListController.getStocks);
//verified works
router.get('/stocks/price/:ticker', stockListController.getStockPrice);
// verified works
router.get('/stocks/score/:ticker', stockListController.getSignal);
//adds a stock to the list of monitored stocks
//either broken or dont know how to use
router.post('/stocks/add/:ticker', stockListController.addStock);
// note: reminder to check if currently holding before deleting, with proper error handling
// verified works, but:
// TODO: ensure deletion safety for portfolio holdings
router.delete('/stocks/delete/:ticker', stockListController.removeStock);
//updates information (price and signal) for all monitored stocks
// verified works... but slow
router.put('/stocks/update', stockListController.update);
//verified works
router.put('/stocks/run', stockListController.run);
export default router;
