const Portfolio = require('../../src/models/Portfolio');


describe('User Sim', () => {
    let portfolio;

    beforeAll(() => {
        portfolio = new Portfolio(1000, new Date());
    });

    test('should initialize with given cash and creation date', () => {
        expect(portfolio.getCash()).toBe(1000);
        expect(portfolio.getCreationDate()).toBeInstanceOf(Date);
        console.log(portfolio.getCreationDate());
    });

    test('should deposit cash', () => {
        portfolio.deposit(500);
        expect(portfolio.getCash()).toBe(1500);
    });

    test('should withdraw cash', () => {
        portfolio.withdraw(200);
        expect(portfolio.getCash()).toBe(1300);
    });


    test('should add AAPL', () => {
        let applePrice = 188.92;
        const appleTicker = 'AAPL'
        portfolio.buyStock(appleTicker, applePrice, 1)
        expect(portfolio.getCash()).toBe(1300-applePrice);
        expect(portfolio.getStock(appleTicker).getTicker()).toBe(appleTicker);
        expect(portfolio.getHoldings(appleTicker)).toBe(1);
    });

    test('should sell AAPL', () => {
        let applePrice = 190.92;
        const appleTicker = 'AAPL';
        portfolio.sellStock(appleTicker, applePrice, 1);
        expect(portfolio.getCash()).toBe(1302);
        expect(portfolio.getHoldings(appleTicker)).toBe(0);
    });
});



describe('Multiple Transactions', () => {
    let portfolio;

    beforeAll(() => {
        portfolio = new Portfolio(1000, new Date());

        test('should handle multiple buys and sells', () => {
            let googlePrice = 2800;
            const googleTicker = 'GOOGL';
            portfolio.buyStock(googleTicker, googlePrice, 1);
            expect(portfolio.getCash()).toBe(1300 - googlePrice);
            expect(portfolio.getStock(googleTicker).getTicker()).toBe(googleTicker);
            expect(portfolio.getHoldings(googleTicker)).toBe(1);

            portfolio.sellStock(googleTicker, googlePrice, 1);
            expect(portfolio.getCash()).toBe(1300);
            expect(portfolio.getHoldings(googleTicker)).toBe(0);
        });
    });
});

describe('Error Handling and Edge Cases', () => {
    let portfolio;

    beforeAll(() => {
        portfolio = new Portfolio(1000, new Date());

    });

    test('should throw error when withdrawing more cash than available', () => {
        expect(() => portfolio.withdraw(2000)).toThrow('Insufficient funds for withdrawal.');
    });

    test('should throw error when buying stock with insufficient funds', () => {
        let expensiveStockPrice = 5000;
        const expensiveStockTicker = 'EXPNSV';
        expect(() => portfolio.buyStock(expensiveStockTicker, expensiveStockPrice, 1)).toThrow('Insufficient funds to buy EXPNSV.');
    });

    test('should handle depositing zero cash', () => {
        portfolio.deposit(0);
        expect(portfolio.getCash()).toBe(1000);
    });

    test('should handle withdrawing zero cash', () => {
        portfolio.withdraw(0);
        expect(portfolio.getCash()).toBe(1000);
    });

    test('should handle buying zero stocks', () => {
        const googleTicker = 'GOOGL';
        let googlePrice = 200;
        portfolio.buyStock(googleTicker, googlePrice, 0);
        expect(portfolio.getHoldings(googleTicker)).toBe(0);
    });

    test('should handle selling zero stocks', () => {
        const googleTicker = 'GOOGL';
        let googlePrice = 200;
        portfolio.sellStock(googleTicker, googlePrice, 0);
        expect(portfolio.getHoldings(googleTicker)).toBe(0);
    });

});
