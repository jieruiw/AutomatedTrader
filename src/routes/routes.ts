import express from 'express';
import portfolioController from '../controllers/portfolioController';
import stockListController from '../controllers/stockListController';

const router = express.Router();

// GET endpoint for getting portfolio holdings
router.get('/portfolio', portfolioController.getHoldings);

// GET endpoint for getting bookvalue of a stock
// TODO
router.get('/portfolio/bookvalue/:ticker', portfolioController.getBookValue);

// GET endpoint for getting current portfolio value
router.get('/portfolio/value', portfolioController.getValue);

// GET endpoint for getting current portfolio balance
router.get('/portfolio/cash', portfolioController.getCash);

// TODO
// getting all transactions
router.get('/portfolio/transactions', portfolioController.getTransactions)



// GET endpoint for getting historical values for a specified period
// TODO
router.get('/portfolio/history', portfolioController.getHistoricalValues);

router.post('/portfolio/buy/:ticker', portfolioController.buyStock);

router.post('/portfolio/sell/:ticker', portfolioController.sellStock);

router.post('/portfolio/deposit', portfolioController.deposit);

router.post('/portfolio/withdraw', portfolioController.withdraw);



router.get('/stocks', stockListController.getStocks);

router.get('/stocks/price/:ticker', stockListController.getStockPrice);

router.get('/stocks/score/:ticker', stockListController.getSignal);

//adds a stock to the list of monitored stocks
router.post('/stocks/add/:ticker', stockListController.addStock);

// note: reminder to check if currently holding before deleting, with proper error handling
router.delete('/stocks/delete/:ticker', stockListController.removeStock);

//updates information (price and signal) for all monitored stocks
router.put('/stocks/update', stockListController.update);

export default router;