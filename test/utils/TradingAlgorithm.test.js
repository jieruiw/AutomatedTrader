const TradingAlgorithm = require('../../src/services/TradingAlgorithm.js');
const Portfolio = require("../../src/models/Portfolio.js");

describe('TradingAlg Unit Tests', () => {
    const config = {
        weights: {
            zacks: 0.3,
            technical: 0.5,
            analyst: 0.2
        }
    };

    beforeAll(() => {
        tradingAlgorithm = new TradingAlgorithm(config);
    });

    test('test zacks recommendations', async () => {
        const zackScore = await tradingAlgorithm.zacksDecision('NVDA');
        console.log(zackScore);
        expect(zackScore).toBeGreaterThan(-101);
        expect(zackScore).toBeLessThan(101);
    });

    test('test technical recommendations', async () => {
        const techScore = await tradingAlgorithm.technicalDecision('AAPL');
        console.log(techScore);
        expect(techScore).toBeGreaterThan(-101);
        expect(techScore).toBeLessThan(101);
    });

    test('test analyst/PT recommendations', async () => {
        const ptScore = await tradingAlgorithm.analystDecision('AAPL');
        console.log(ptScore);
        expect(ptScore).toBeGreaterThan(-101);
        expect(ptScore).toBeLessThan(101);
    });

    test('test overall recommendations', async () => {
        const score = await tradingAlgorithm.decision('NVDA');
        console.log(score);
        expect(score).toBeGreaterThan(-101);
        expect(score).toBeLessThan(101);
    });


});