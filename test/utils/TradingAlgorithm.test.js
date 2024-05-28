const TradingAlgorithm = require('../../src/services/TradingAlgorithm');
const Portfolio = require("../../src/models/Portfolio");

describe('TradingAlg Unit Tests', () => {
    let config;

    beforeAll(() => {
        tradingAlgorithm = new TradingAlgorithm(config);
    });

    test('test zacks reccomendations', () => {
        //TODO
    });
});