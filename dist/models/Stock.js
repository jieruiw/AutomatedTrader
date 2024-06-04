export default class Stock {
    constructor(ticker, price) {
        this.signal = null;
        this.ticker = ticker;
        this.price = price;
    }
    getTicker() {
        return this.ticker;
    }
    getPrice() {
        return this.price;
    }
    getSignal() {
        return this.signal;
    }
    setSignal(signal) {
        this.signal = signal;
    }
    setPrice(price) {
        this.price = price;
    }
}
