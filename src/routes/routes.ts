import express from 'express';
import portfolioController from '../controllers/portfolioController.js';
import stockListController from '../controllers/stockListController.js';

const router = express.Router();

// GET endpoint for getting portfolio holdings
// WORKS
router.get('/portfolio', portfolioController.getHoldings);

// GET endpoint for getting bookValue of a stock
router.get('/portfolio/bookvalue/:ticker', portfolioController.getBookValue);

// GET endpoint for getting current portfolio value
// Verified works
router.get('/portfolio/value', portfolioController.getValue);

// GET endpoint for getting current portfolio balance
// VERIFIED WORKS
router.get('/portfolio/cash', portfolioController.getCash);


// getting all transactions
// VERIFIED WORKS
router.get('/portfolio/transactions', portfolioController.getTransactions)



// GET endpoint for getting historical values for a specified period
// works
router.get('/portfolio/history', portfolioController.getHistoricalValues);

// WORKING
// may need a number of stocks bought for the stockPurchases database storage, for this objective
router.post('/portfolio/buy/:ticker', portfolioController.buyStock);

// WORKING
router.post('/portfolio/sell/:ticker', portfolioController.sellStock);

// WORKING
router.post('/portfolio/deposit', portfolioController.deposit);

// WORKS, BUT, remember to ensure not more than current cash is being withdrawn from front end.
router.post('/portfolio/withdraw', portfolioController.withdraw);


// verified works
router.get('/stocks', stockListController.getStocks);

//verified works
router.get('/stocks/price/:ticker', stockListController.getStockPrice);

// verified works
router.get('/stocks/score/:ticker', stockListController.getSignal);

// works
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

router.put('/stocks/priceUpdate', stockListController.updatePrices)


export default router;