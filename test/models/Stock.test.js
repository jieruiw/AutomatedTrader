const Stock = require('../../src/models/Stock');

describe('Stock', () => {
    let stock;

    beforeAll(() => {
        stock = new Stock('AAPL', 150);
    });

    test('should return the correct ticker', () => {
        expect(stock.getTicker()).toBe('AAPL');
    });

    test('should return the correct price', () => {
        expect(stock.getPrice()).toBe(150);
    });

    test('should set the price correctly', () => {
        stock.setPrice(200);
        expect(stock.getPrice()).toBe(200);
    });
});