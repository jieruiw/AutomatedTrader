const DataRetriever = require('../../src/utils/DataRetriever');
const { getZacksRank } = require('../../src/utils/DataRetriever');
require('jest-extended');


describe('A few symbols', () => {
    let portfolio;

    test('should get AAPL ticker', async () => {
        const zacksRank = await DataRetriever.getZacksRank('AAPL');
        expect(typeof zacksRank).toBe("number")
        console.log(zacksRank);
    });
});