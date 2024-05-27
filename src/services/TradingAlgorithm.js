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


    buyDecision(ticker) {
        const zacksRank = DataRetriever.getZacksRank(ticker);
        // TODO: Add other analyst/indicator inputs and make decision
    }

    sellDecision(ticker) {
        const zacksRank = DataRetriever.getZacksRank(ticker);
        // TODO: Add other analyst/indicator inputs and make decision
    }


}