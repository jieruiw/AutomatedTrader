const TradingAlgorithm = require('../services/TradingAlgorithm');
class Scheduler {

    constructor(config) {
        this.observers = [];
        this.tradingAlgorithm = new TradingAlgorithm(config);
    }


    addObserver(observer) {
        this.observers.push(observer);
    }

    // Method to remove an observer
    removeObserver(observer) {
        this.observers = this.observers.filter(obs => obs !== observer);
    }

    notifyObservers(signal) {
        for (const observer of this.observers) {
            observer.update(signal);
        }
    }

    start() {
        // Placeholder for scheduling logic
        // e.g., setInterval to notify observers at specific intervals
        console.log('Scheduler started');

        // Example: Notify observers with a dummy signal
        setInterval(() => {
            const signal = this.generateSignal(); // Placeholder for actual signal generation
            this.notifyObservers(signal);
        }, 60000); // Notify every minute for demonstration purposes
    }

    // Method to generate signals (placeholder)
    generateSignal() {
        // Implement the logic to generate buy/sell/hold signals
        return "buy"; // Example signal
    }





}

module.exports = Scheduler;