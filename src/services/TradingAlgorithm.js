const DataRetriever = require('../../src/utils/DataRetriever');
class TradingAlgorithm {

    constructor(config) {
        this.config = config;
    }


    async decision(ticker) {
        const zacksRank = await this.zacksDecision(ticker);

        const technicalScore = await this.technicalDecision(ticker);

        const analystScore = await this.analystDecision(ticker);

        console.log('zacks is: ' + zacksRank);
        console.log('technical is: ' + technicalScore);
        console.log('analyst is: ' + analystScore);

        return (this.config.weights.zacks * zacksRank) +
            (this.config.weights.technical * technicalScore) +
            (this.config.weights.analyst * analystScore);

    }

    async zacksDecision(ticker) {
        const zacksRank = await DataRetriever.getZacksRank(ticker);
        try {
            switch (zacksRank) {
                case 1:
                    return 100;
                case 2:
                    return 50;
                case 3:
                    return 0;
                case 4:
                    return -50;
                case 5:
                    return -100;
            }
        } catch (e) {
            console.error(e);
        }
    }

    async technicalDecision(ticker) {
        const sma50 = await DataRetriever.getSMA(ticker, 50);
        const sma200 = await DataRetriever.getSMA(ticker, 200);
        const ema50 = await DataRetriever.getEMA(ticker, 50);
        const ema200 = await DataRetriever.getEMA(ticker, 200);
        const rsi = await DataRetriever.getRSI(ticker);
        const macd = await DataRetriever.getMACD(ticker);
        const bbands = await DataRetriever.getBBands(ticker);
        const obv = await DataRetriever.getOBV(ticker);

        let maResult = this.maCalc(ema50, ema200, sma50, sma200);

        let rsiResult = this.rsiCalc(rsi);

        let macdResult = this.macdCalc(macd);

        let bbandsResult = this.bbandsCalc(bbands);

        let obvResult = this.obvCalc(obv);

        let overallResult = maResult + rsiResult + macdResult + bbandsResult + obvResult;

        if (overallResult > 100) {
            return 100;
        } else if (overallResult < -100) {
            return -100;
        }


        return overallResult;
    }

    maCalc(ema50, ema200, sma50, sma200) {
        // Ensure we have data for the required periods
        if (!ema50 || !ema200 || !sma50 || !sma200) {
            console.error('Missing data for moving averages');
            return 0;  // Neutral signal due to insufficient data
        }

        // Determine the most recent values
        const latestShortTermEMA = ema50[0].ema;
        const latestLongTermEMA = ema200[0].ema;
        const latestShortTermSMA = sma50[0].sma;
        const latestLongTermSMA = sma200[0].sma;

        // Determine the values 1 day before (yesterday's values)
        const previousShortTermEMA = ema50[1].ema;
        const previousLongTermEMA = ema200[1].ema;
        const previousShortTermSMA = sma50[1].sma;
        const previousLongTermSMA = sma200[1].sma;

        // Primary Indicator: Check for Golden Cross and Death Cross for EMA
        if (previousShortTermEMA <= previousLongTermEMA && latestShortTermEMA > latestLongTermEMA) {
            // Golden Cross: 50-day EMA crosses above 200-day EMA
            return 30;  // Strong positive signal
        } else if (previousShortTermEMA >= previousLongTermEMA && latestShortTermEMA < latestLongTermEMA) {
            // Death Cross: 50-day EMA crosses below 200-day EMA
            return -30;  // Strong negative signal
        }

        // Primary Indicator: Check for Golden Cross and Death Cross for SMA
        if (previousShortTermSMA <= previousLongTermSMA && latestShortTermSMA > latestLongTermSMA) {
            // Golden Cross: 50-day SMA crosses above 200-day SMA
            return 30;  // Strong positive signal
        } else if (previousShortTermSMA >= previousLongTermSMA && latestShortTermSMA < latestLongTermSMA) {
            // Death Cross: 50-day SMA crosses below 200-day SMA
            return -30;  // Strong negative signal
        }

        // Secondary Indicator: General comparison of EMA and SMA
        if (latestShortTermEMA > latestShortTermSMA) {
            // Positive signal for upward trend
            return 20;
        }

        // Negative signal for downward trend
        return -20;
    }

    rsiCalc(rsi) {
        const rsiValue = rsi[0].rsi;
        if (rsiValue < 30) {
            return 30;
        } else if (rsiValue > 70) {
            return -30;  // Overbought, negative signal
        }

        return 0;
    }

    macdCalc(macd) {

        const macdValue = macd[0].macd;
        const signalValue = macd[0].macd_signal;
        if (macdValue > signalValue) {
            return 20;
        }
        return -20;
    }

    bbandsCalc(bbands) {
        const currentPrice = bbands[0].middle_band;  // Assume current price is close to middle_band
        if (currentPrice < bbands[0].lower_band) {
            return 20;  // Below lower band, positive signal
        } else if (currentPrice > bbands[0].upper_band) {
            return -20;  // Above upper band, negative signal
        }

        return 0;
    }

    obvCalc(obv) {
        const obvTrend = obv[0].obv - obv[1].obv;
        if (obvTrend > 0) {
            return 10;  // Positive volume trend
        }

        return -10;
    }

    async analystDecision(ticker) {
        const priceTargets = await DataRetriever.getPriceTargets(ticker);
        const { low, current, average, high } = priceTargets;
        console.log(priceTargets);
        let score = 0;

        if (current < low) {
            score = 100;  // Strong buy signal
        } else if (current > high) {
            score = -100;  // Strong sell signal
        } else {
            // Calculate score based on proximity to average
            const range = high - low;
            const distanceFromAverage = average - current;
            score = (distanceFromAverage / range) * 100;

            // Ensure the score is within -100 to 100 range
            if (score > 100) score = 100;
            if (score < -100) score = -100;
        }

        return score;
    }

}

module.exports = TradingAlgorithm;