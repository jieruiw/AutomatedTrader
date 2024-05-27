const DataRetriever = require('../../src/utils/DataRetriever');
const { getZacksRank, getPriceTargets } = require('../../src/utils/DataRetriever');


describe('A few symbols', () => {
    let portfolio;

    test('should get AAPL ticker', async () => {
        const zacksRank = await DataRetriever.getZacksRank('AAPL');
        expect(typeof zacksRank).toBe("number")
        console.log(zacksRank);
    });
});


describe('Analyst Price Targets', () => {
    test('should get TSLA analyst price targets', async () => {
        const priceTargets = await getPriceTargets('TSLA');
        expect(typeof priceTargets.low).toBe('number');
        expect(typeof priceTargets.average).toBe('number');
        expect(typeof priceTargets.current).toBe('number');
        expect(typeof priceTargets.high).toBe('number');
        console.log(priceTargets);
    });
});