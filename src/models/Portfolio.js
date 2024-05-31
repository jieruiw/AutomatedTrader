"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var StockListManager_1 = require("../utils/StockListManager");
var Portfolio = /** @class */ (function () {
    function Portfolio(cash, creationDate) {
        this.cash = cash;
        this.creationDate = creationDate;
        this.stocks = new Map();
    }
    Portfolio.prototype.getCash = function () {
        return this.cash;
    };
    Portfolio.prototype.getCreationDate = function () {
        return this.creationDate;
    };
    Portfolio.prototype.deposit = function (amount) {
        this.cash += amount;
    };
    Portfolio.prototype.withdraw = function (amount) {
        if (this.cash >= amount) {
            this.cash -= amount;
            return this.cash;
        }
        else {
            throw new Error('Insufficient funds for withdrawal.');
        }
    };
    Portfolio.prototype.getPortfolio = function () {
        return this.stocks;
    };
    Portfolio.prototype.getStock = function (ticker) {
        if (this.stocks.has(ticker)) {
            return this.stocks.get(ticker).stock;
        }
        else {
            throw new Error('Stock not found in portfolio.');
        }
    };
    Portfolio.prototype.getHoldings = function (ticker) {
        if (this.stocks.has(ticker)) {
            return this.stocks.get(ticker).holdings;
        }
        else {
            return 0;
        }
    };
    Portfolio.prototype.buyStock = function (ticker, price, quantity) {
        if (price * quantity <= this.cash) {
            this.cash -= price * quantity;
            if (this.stocks.has(ticker)) {
                this.stocks.get(ticker).holdings += quantity;
                this.stocks.get(ticker).stock.price = price;
            }
            else {
                var currStock = StockListManager_1.default.getStock(ticker);
                this.stocks.set(ticker, { stock: currStock, holdings: quantity });
            }
        }
        else {
            throw new Error('Insufficient funds to buy ' + ticker + '.');
        }
    };
    Portfolio.prototype.sellStock = function (ticker, price, quantity) {
        if (this.stocks.has(ticker)) {
            this.stocks.get(ticker).stock.price = price;
            var stockEntry = this.stocks.get(ticker);
            if (stockEntry.holdings >= quantity) {
                stockEntry.holdings -= quantity;
                this.cash += price * quantity;
            }
            else {
                throw new Error('Insufficient holdings to sell.');
            }
        }
        else {
            throw new Error('Stock not found in portfolio.');
        }
    };
    Portfolio.prototype.getPortfolioValue = function () {
        var totalValue = this.cash;
        this.stocks.forEach(function (_a) {
            var stock = _a.stock, holdings = _a.holdings;
            var currentPrice = stock.getPrice(); // Assuming getPrice() returns the latest price
            totalValue += currentPrice * holdings;
        });
        return totalValue;
    };
    return Portfolio;
}());
exports.default = Portfolio;
