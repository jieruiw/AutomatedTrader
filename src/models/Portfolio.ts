import StockListManager from "../utils/StockListManager.js";
import Stock from "./Stock.js";

interface StockEntry {
    stock : Stock;
    holdings: number;
}

class Portfolio {

    private cash: number;
    private readonly creationDate: Date;
    private stocks: Map<string, StockEntry>;

    constructor(cash: number, creationDate: Date) {
        this.cash = cash;
        this.creationDate = creationDate;
        this.stocks = new Map();
    }

    getCash(): number {
        return this.cash;
    }

    getCreationDate(): Date {
        return this.creationDate;
    }

    deposit(amount: number): void {
        this.cash += amount;
    }

    withdraw(amount: number): number {
        if (this.cash >= amount) {
            this.cash -= amount;
            return this.cash;
        } else {
            throw new Error('Insufficient funds for withdrawal.');
        }
    }


    getPortfolio(): Map<string, StockEntry>  {
        return this.stocks;
    }

    getStock(ticker: string): Stock {
        if (this.stocks.has(ticker)) {
            return this.stocks.get(ticker)!.stock;
        } else {
            throw new Error('Stock not found in portfolio.');
        }
    }

    getHoldings(ticker: string): number {
        if (this.stocks.has(ticker)) {
            return this.stocks.get(ticker)!.holdings;
        } else {
            return 0;
        }
    }

    buyStock(ticker: string, price: number, quantity: number): void {
        if (price*quantity <= this.cash) {

            this.cash -= price*quantity;

            if (this.stocks.has(ticker)) {
                this.stocks.get(ticker)!.holdings += quantity;
                this.stocks.get(ticker)!.stock.price = price;

            } else {
                let currStock = StockListManager.getStock(ticker)!;
                this.stocks.set(ticker, {stock: currStock, holdings: quantity});
            }

        } else {
            throw new Error('Insufficient funds to buy ' + ticker + '.');
        }
    }

    sellStock(ticker: string, price: number, quantity: number): void {
        if (this.stocks.has(ticker)) {
            this.stocks.get(ticker)!.stock.price = price;
            const stockEntry = this.stocks.get(ticker)!;
            if (stockEntry.holdings >= quantity) {
                stockEntry.holdings -= quantity;

                this.cash += price * quantity;
            } else {
                throw new Error('Insufficient holdings to sell.');
            }


        } else {
            throw new Error('Stock not found in portfolio.');
        }
    }


    getPortfolioValue(): number {
        let totalValue = this.cash;

        this.stocks.forEach(({stock, holdings}) => {
            const currentPrice = stock.getPrice(); // Assuming getPrice() returns the latest price
            totalValue += currentPrice * holdings;
        });

        return totalValue;
    }
}

export default Portfolio;