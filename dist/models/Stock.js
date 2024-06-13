export default class Stock {
    constructor(ticker, price, signal) {
        this.signal = null;
        this.image = null;
        this.ticker = ticker;
        this.price = price;
        if (signal)
            this.signal = signal;
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
    getImage() {
        return this.image;
    }
    setImage(image) {
        this.image = image;
    }
}
