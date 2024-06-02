export default class Stock {
private readonly ticker: string;
public price: number;

    constructor(ticker: string, price: number) {
        this.ticker = ticker;
        this.price = price;
    }

    getTicker(): string {
        return this.ticker;
    }

    getPrice(): number {
        return this.price;
    }

    setPrice(price: number): void {
        this.price = price;
    }

    // toJSON(): any {
    //     return {
    //         ticker: this.ticker,
    //         price: this.price
    //     };
    // }
    //
    // fromJSON(json: any): Stock {
    //     return new Stock(json.ticker, json.price);
    // }

}
