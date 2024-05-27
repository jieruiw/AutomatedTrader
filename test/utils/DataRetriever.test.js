const DataRetriever = require('../../src/utils/DataRetriever');
const { getZacksRank, getPriceTargets, getSMA, getEMA, getRSI, getMACD, getBBands, getOBV} = require('../../src/utils/DataRetriever');


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

describe('Technical Indicators', () => {
    test('should get TSLA SMA', async () => {
        const sma = await getSMA('TSLA');

        expect(Array.isArray(sma)).toBe(true);

        // Check if the array is not empty
        expect(sma.length).toBeGreaterThan(0);

        // Check if each item in the array has the required properties
        sma.forEach(item => {
            expect(item).toHaveProperty('datetime');
            expect(item).toHaveProperty('sma');
            expect(typeof item.datetime).toBe('string');
            expect(typeof item.sma).toBe('number');
        });
    });


    test('should get TSLA EMA', async () => {
        const ema = await getEMA('TSLA');
        expect(Array.isArray(ema)).toBe(true);
        expect(ema.length).toBeGreaterThan(0);

        // Check if each item in the array has the required properties
        ema.forEach(item => {
            expect(item).toHaveProperty('datetime');
            expect(item).toHaveProperty('ema');
            expect(typeof item.datetime).toBe('string');
            expect(typeof item.ema).toBe('number');
        });
    });


    test('should get TSLA RSI', async () => {
        const rsi = await getRSI('TSLA');
        console.log(rsi);
        expect(Array.isArray(rsi)).toBe(true);
        expect(rsi.length).toBeGreaterThan(0);

        // Check if each item in the array has the required properties
        rsi.forEach(item => {
            expect(item).toHaveProperty('datetime');
            expect(item).toHaveProperty('rsi');
            expect(typeof item.datetime).toBe('string');
            expect(typeof item.rsi).toBe('number');
        });
    });

    test('should get TSLA MACD', async () => {
        const macd = await getMACD('TSLA');
        expect(Array.isArray(macd)).toBe(true);
        expect(macd.length).toBeGreaterThan(0);

        // Check if each item in the array has the required properties
        macd.forEach(item => {
            expect(item).toHaveProperty('datetime');
            expect(item).toHaveProperty('macd');
            expect(item).toHaveProperty('macd_signal');
            expect(item).toHaveProperty('macd_hist');
            expect(typeof item.datetime).toBe('string');
            expect(typeof item.macd).toBe('number');
            expect(typeof item.macd_signal).toBe('number');
            expect(typeof item.macd_hist).toBe('number');
        });
    });

    test('should get TSLA BBands', async () => {
        const bbands = await getBBands('TSLA');
        expect(Array.isArray(bbands)).toBe(true);
        expect(bbands.length).toBeGreaterThan(0);

        // Check if each item in the array has the required properties
        bbands.forEach(item => {
            expect(item).toHaveProperty('datetime');
            expect(item).toHaveProperty('upper_band');
            expect(item).toHaveProperty('middle_band');
            expect(item).toHaveProperty('lower_band');
            expect(typeof item.datetime).toBe('string');
            expect(typeof item.upper_band).toBe('number');
            expect(typeof item.middle_band).toBe('number');
            expect(typeof item.lower_band).toBe('number');
        });
    });

    test('should get TSLA OBV', async () => {
        const obv = await getOBV('TSLA');
        expect(Array.isArray(obv)).toBe(true);
        expect(obv.length).toBeGreaterThan(0);

        // Check if each item in the array has the required properties
        obv.forEach(item => {
            expect(item).toHaveProperty('datetime');
            expect(item).toHaveProperty('obv');
            expect(typeof item.datetime).toBe('string');
            expect(typeof item.obv).toBe('number');
        });
    });
});