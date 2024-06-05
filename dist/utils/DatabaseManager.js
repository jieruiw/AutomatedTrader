import { MongoClient } from 'mongodb';
export default class DatabaseManager {
    static async connect() {
        if (!this.client) {
            const uri = "mongodb+srv://Cluster32374:UUdrfX1hT3JV@cluster32374.seietog.mongodb.net/myNewDatabase?retryWrites=true&w=majority";
            this.client = new MongoClient(uri);
            await this.client.connect();
            console.log("Connected to MongoDB");
            this.db = this.client.db("Database");
            this.portfolioValues = this.db.collection("portfolioValues");
            this.stockPurchases = this.db.collection("stockPurchases");
            this.transactions = this.db.collection("transactions");
        }
    }
    static async logPortfolioValue(date, value) {
        await this.connect();
        try {
            const existingEntry = await this.portfolioValues.findOne({ date });
            if (!existingEntry) {
                await this.portfolioValues.insertOne({ date, value });
                console.log("Logged portfolio value:", { date, value });
            }
            else {
                console.log("Portfolio value for today already exists.");
            }
        }
        catch (error) {
            console.error("Error logging portfolio value:", error);
        }
    }
    static async logStockPurchase(ticker, date, price) {
        await this.connect();
        try {
            await this.stockPurchases.insertOne({ ticker, date, price });
            console.log("Logged stock purchase:", { ticker, date, price });
        }
        catch (error) {
            console.error("Error logging stock purchase:", error);
        }
    }
    static async removeStockPurchase(ticker, date) {
        await this.connect();
        try {
            await this.stockPurchases.deleteOne({ ticker, date });
            console.log("Removed stock purchase:", { ticker, date });
        }
        catch (error) {
            console.error("Error removing stock purchase:", error);
        }
    }
    static async logTransaction(ticker, date, quantity, price, type) {
        await this.connect();
        try {
            await this.transactions.insertOne({ ticker, date, quantity, price, type });
            console.log("Logged transaction:", { ticker, date, quantity, price, type });
        }
        catch (error) {
            console.error("Error logging transaction:", error);
        }
    }
    //return the list of the most recent 50 transactions
    static async getTransactions() {
        await this.connect();
        try {
            const transactions = await this.transactions.find().sort({ date: -1 }).limit(50).toArray();
            console.log("Fetched transactions:", transactions);
            return transactions;
        }
        catch (error) {
            console.error("Error fetching transactions:", error);
            throw error;
        }
    }
    // gets portfolio values of the specified length of date
    static async getHistoricalData(period) {
        await this.connect();
        try {
            const endDate = new Date();
            let startDate;
            switch (period) {
                case "1w":
                    startDate = new Date();
                    startDate.setDate(endDate.getDate() - 7);
                    break;
                case "1m":
                    startDate = new Date();
                    startDate.setMonth(endDate.getMonth() - 1);
                    break;
                case "3m":
                    startDate = new Date();
                    startDate.setMonth(endDate.getMonth() - 3);
                    break;
                case "1y":
                    startDate = new Date();
                    startDate.setFullYear(endDate.getFullYear() - 1);
                    break;
                case "5y":
                    startDate = new Date();
                    startDate.setFullYear(endDate.getFullYear() - 5);
                    break;
                default:
                    throw new Error("Invalid period specified");
            }
            const historicalData = await this.portfolioValues.find({
                date: { $gte: startDate, $lte: endDate }
            }).toArray();
            console.log("Fetched historical data:", historicalData);
            return historicalData;
        }
        catch (error) {
            console.error("Error fetching historical data:", error);
            throw error;
        }
    }
    // gets the corresponding "price" field of the stockPurchases collection
    static async getBookValue(ticker) {
        await this.connect();
        try {
            const stock = await this.stockPurchases.findOne({ ticker });
            if (stock) {
                console.log("Fetched book value:", stock.price);
                return stock.price;
            }
            else {
                console.log("Stock not found");
                return null;
            }
        }
        catch (error) {
            console.error("Error fetching book value:", error);
            throw error;
        }
    }
    static async close() {
        if (this.client) {
            await this.client.close();
            console.log("MongoDB connection closed");
        }
    }
}
