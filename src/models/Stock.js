class Stock {


    constructor(ticker, price) {
        this.ticker = ticker;
        this.price = price;
    }

    getTicker() {
        return this.ticker;
    }

    getPrice() {
        return this.price;
    }

    setPrice(price) {
        this.price = price;
    }

}