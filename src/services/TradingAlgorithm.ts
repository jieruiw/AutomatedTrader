import DataRetriever from '../utils/DataRetriever.js';
import Config from "../utils/Config.js";
export default class TradingAlgorithm {

    constructor() {
    }

    async decision(ticker: string) {
        const zacksRank = await this.zacksDecision(ticker);

        const technicalScore = await this.technicalDecision(ticker);

        const analystScore = await this.analystDecision(ticker);

        console.log('zacks is: ' + zacksRank);
        console.log('technical is: ' + technicalScore);
        console.log('analyst is: ' + analystScore);

        return (Config.zacks * zacksRank) +
            (Config.technical * technicalScore) +
            (Config.analyst * analystScore);

    }

    async zacksDecision(ticker: string): Promise<number> {
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

        return 0;
    }

    async technicalDecision(ticker: string) {
        const sma50 = await DataRetriever.getSMA(ticker, 30);
        const sma200 = await DataRetriever.getSMA(ticker, 120);
        const ema50 = await DataRetriever.getEMA(ticker, 30);
        const ema200 = await DataRetriever.getEMA(ticker, 120);
        const rsi = await DataRetriever.getRSI(ticker);
        const macd = await DataRetriever.getMACD(ticker);
        const bbands = await DataRetriever.getBBands(ticker);
        const obv = await DataRetriever.getOBV(ticker);

        let maResult = this.maCalc(ema50, ema200, sma50, sma200);

        let rsiResult = this.rsiCalc(rsi);

        let macdResult = this.macdCalc(macd);

        let bbandsResult = this.bbandsCalc(bbands);

        let obvResult = this.obvCalc(obv);

        console.log('maResult is: ' + maResult);
        console.log('RSI is: ' + rsiResult);
        console.log('macd is: ' + macdResult);
        console.log('bbands is: ' + bbandsResult);
        console.log('obv is: ' + obvResult);

        let overallResult = maResult + rsiResult + macdResult + bbandsResult + obvResult;

        if (overallResult > 100) {
            return 100;
        } else if (overallResult < -100) {
            return -100;
        }


        return overallResult;
    }

    maCalc(emaShort: any[], emaLong: any[], smaShort: any[], smaLong: any[]) {
        // Ensure we have data for the required periods
        if (!emaShort || !emaLong || !smaShort || !smaLong) {
            console.error('Missing data for moving averages');
            return 0;  // Neutral signal due to insufficient data
        }

        // Determine the most recent values
        const latestShortTermEMA = emaShort[0].ema;
        const latestLongTermEMA = emaLong[0].ema;
        const latestShortTermSMA = smaShort[0].sma;
        const latestLongTermSMA = smaLong[0].sma;

        // Determine the values 1 day before (yesterday's values)
        const previousShortTermEMA = emaShort[1].ema;
        const previousLongTermEMA = emaLong[1].ema;
        const previousShortTermSMA = smaShort[1].sma;
        const previousLongTermSMA = smaLong[1].sma;

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

    rsiCalc(rsi: any[]): number {
        const rsiValue = rsi[0].rsi;
        if (rsiValue < 30) {
            return 30;
        } else if (rsiValue > 70) {
            return -30;  // Overbought, negative signal
        }

        return 0;
    }

    macdCalc(macd: any[]) {

        const macdValue = macd[0].macd;
        const signalValue = macd[0].macd_signal;
        if (macdValue > signalValue) {
            return 20;
        }
        return -20;
    }

    bbandsCalc(bbands: any[]) {
        const currentPrice = bbands[0].middle_band;  // Assume current price is close to middle_band
        if (currentPrice < bbands[0].lower_band) {
            return 20;  // Below lower band, positive signal
        } else if (currentPrice > bbands[0].upper_band) {
            return -20;  // Above upper band, negative signal
        }

        return 0;
    }

    obvCalc(obv: any[]) {
        const obvTrend = obv[0].obv - obv[1].obv;
        if (obvTrend > 0) {
            return 10;  // Positive volume trend
        }

        return -10;
    }

    async analystDecision(ticker: string) {
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