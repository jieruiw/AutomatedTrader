const DataRetriever = require('../../src/utils/DataRetriever');
// TODO:Data Analysis: Analyze retrieved data.
// 	•	Decision Making: Implement buy/sell logic.
// 	•	Integration with Portfolio: Execute trades and update portfolio.
// 	•	Risk Management: Enforce risk parameters.
// 	•	Logging and Monitoring: Keep records of trades and strategy performance.
// 	•	Flexibility and Extensibility: Allow for different strategies to be tested and implemented.



class TradingAlgorithm {

    constructor(config) {
        this.config = config;
    }


    async decision(ticker, config) {
        const zacksRank = await this.zacksDecision(ticker);

        const technicalScore = await this.technicalDecision(ticker);

        const analystScore = await this.analystDecision(ticker);

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
        const sma = await DataRetriever.getSMA(ticker);
        const ema = await DataRetriever.getEMA(ticker);
        const rsi = await DataRetriever.getRSI(ticker);
        const macd = await DataRetriever.getMACD(ticker);
        const bbands = await DataRetriever.getBBands(ticker);
        const obv = await DataRetriever.getOBV(ticker);

        let score = 0;

        score += this.maCalc(ema, sma);

        score += this.rsiCalc(rsi);

        score += this.macdCalc(macd);

        score += this.bbandsCalc(bbands);

        score += this.obvCalc(obv);

        return score;
    }

    maCalc(ema, sma) {

        // TODO: implement golden cross and death cross
        // SMA/EMA Crossover
        if (ema[0].ema > sma[0].sma) {
            return 20;  // Positive signal for upward trend
        }

        return -20;  // Negative signal for downward trend

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
        const priceTargets = await DataRetriever.getPriceTargets();
        const { low, current, average, high } = priceTargets;
        let score = 0;

        if (current < low) {
            score = 100;  // Strong buy signal
        } else if (current > high) {
            score = -100;  // Strong sell signal
        } else {
            // Calculate score based on proximity to average
            const range = high - low;
            const distanceFromAverage = current - average;
            score = (distanceFromAverage / range) * 100;

            // Ensure the score is within -100 to 100 range
            if (score > 100) score = 100;
            if (score < -100) score = -100;
        }

        return score;
    }




}