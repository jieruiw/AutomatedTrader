export default class Stock {
private readonly ticker: string;
public price: number;
public signal: number| null = null;

    constructor(ticker: string, price: number, signal?: number) {
        this.ticker = ticker;
        this.price = price;
        if (signal) this.signal = signal;

    }



    getTicker(): string {
        return this.ticker;
    }

    getPrice(): number {
        return this.price;
    }

    getSignal(): number | null {
        return this.signal;
    }

    setSignal(signal: number): void {
        this.signal = signal;
    }

    setPrice(price: number): void {
        this.price = price;
    }

}