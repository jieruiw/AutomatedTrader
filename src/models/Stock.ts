export default class Stock {
private readonly ticker: string;
public price: number;
public signal: number| null = null;
public image: string | null = null;

    constructor(ticker: string, price: number, signal?: number, logo?: string) {
        this.ticker = ticker;
        this.price = price;
        if (signal) this.signal = signal;
        if (logo) this.image = logo;

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



    getImage(): string | null {
        return this.image;
    }

    setImage(image: string): void {
        this.image = image;
    }
}
