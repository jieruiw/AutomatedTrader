import StockListManager from "../utils/StockListManager.js";
import DatabaseManager from "../utils/DatabaseManager.js";
class Portfolio {
    constructor(cash, creationDate) {
        this.cash = cash;
        this.creationDate = creationDate;
        this.stocks = new Map();
    }
    getCash() {
        return this.cash;
    }
    getCreationDate() {
        return this.creationDate;
    }
    deposit(amount) {
        this.cash += amount;
        return this.cash;
    }
    withdraw(amount) {
        if (this.cash >= amount) {
            this.cash -= amount;
            return this.cash;
        }
        else {
            throw new Error('Insufficient funds for withdrawal.');
        }
    }
    getPortfolio() {
        const holdingsArray = [];
        this.stocks.forEach((value, key) => {
            holdingsArray.push({
                ticker: key,
                stock: value.stock,
                holdings: value.holdings
            });
        });
        return holdingsArray;
    }
    getStock(ticker) {
        if (this.stocks.has(ticker)) {
            return this.stocks.get(ticker).stock;
        }
        else {
            throw new Error('Stock not found in portfolio.');
        }
    }
    getHoldings(ticker) {
        if (this.stocks.has(ticker)) {
            return this.stocks.get(ticker).holdings;
        }
        else {
            return 0;
        }
    }
    // TODO: add logging purchase price
    async buyStock(ticker, price, quantity) {
        let currStock;
        if (price * quantity <= this.cash) {
            this.cash -= price * quantity;
            if (this.stocks.has(ticker)) {
                const currEntry = this.stocks.get(ticker);
                currStock = currEntry.stock;
                currEntry.holdings += quantity;
                currEntry.stock.price = price;
            }
            else {
                currStock = StockListManager.getStock(ticker);
                this.stocks.set(ticker, { stock: currStock, holdings: quantity });
            }
            const date = new Date();
            await DatabaseManager.logStockPurchase(ticker, date, price, quantity);
            await DatabaseManager.logTransaction(ticker, date, quantity, price, 'buy');
            return currStock;
        }
        throw new Error('Insufficient funds to buy ' + quantity + ' shares of ' + ticker + '.');
    }
    async sellStock(ticker, price, quantity) {
        if (this.stocks.has(ticker)) {
            this.stocks.get(ticker).stock.price = price;
            const stockEntry = this.stocks.get(ticker);
            if (stockEntry.holdings >= quantity) {
                stockEntry.holdings -= quantity;
                this.cash += price * quantity;
                const date = new Date();
                await DatabaseManager.reduceStockPurchase(ticker, date, quantity);
                await DatabaseManager.logTransaction(ticker, date, quantity, price, 'sell');
                return price;
            }
            else {
                throw new Error('Insufficient holdings to sell.');
            }
        }
        else {
            throw new Error('Stock not found in portfolio.');
        }
    }
    getPortfolioValue() {
        let totalValue = this.cash;
        this.stocks.forEach(({ stock, holdings }) => {
            const currentPrice = stock.getPrice();
            totalValue += currentPrice * holdings;
        });
        return totalValue;
    }
    // Saves the cash, creationDate, tickers of stocks **NOT STOCK OBJECT**, and holdings quantity
    toJSON() {
        const stocksArray = [];
        for (const [ticker, data] of this.stocks.entries()) {
            stocksArray.push({
                ticker: ticker,
                holdings: data.holdings
            });
        }
        return {
            cash: this.cash,
            creationDate: this.creationDate,
            stocks: stocksArray
        };
    }
    fromJSON(json) {
        const portfolio = new Portfolio(json.cash, new Date(json.creationDate));
        for (const stockData of json.stocks) {
            const stock = StockListManager.getStock(stockData.ticker);
            portfolio.stocks.set(stockData.ticker, {
                stock: stock,
                holdings: stockData.holdings
            });
        }
        return portfolio;
    }
}
export default Portfolio;
