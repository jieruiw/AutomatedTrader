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
    }

    withdraw(amount) {
        if (this.cash >= amount) {
            this.cash -= amount;
            return this.cash;
        } else {
            throw new Error('Insufficient funds for withdrawal.');
        }
    }


    getHoldings() {
        return this.stocks;
    }

    buyStock(ticker, price, quantity) {
        if (price*quantity <= this.cash) {

            this.cash -= price*quantity;

            if (this.stocks.has(ticker)) {
                this.stocks.get(ticker).holdings += quantity;

            } else {
                const currStock = new Stock(ticker, price);
                this.stocks.set(ticker, {stock: currStock, holdings: quantity});
            }

        } else {
            throw new Error('Insufficient funds to buy ' + ticker + '.');
        }
    }

    sellStock(ticker, price, quantity) {
        if (this.stocks.has(ticker)) {
            const stockEntry = this.stocks.get(ticker);
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



}