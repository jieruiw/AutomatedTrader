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



});

// TODO: Test sell stock method
// TODO: Multiple buys and sells

// TODO: error handling - withdrawing more cash than available, buying with insufficient funds, etc.

// TODO: edge cases like depositing or withdrawing zero stocks