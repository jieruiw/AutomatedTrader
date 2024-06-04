import { MongoClient, Db, Collection } from 'mongodb';

class DatabaseManager {
    private static client: MongoClient;
    private static db: Db;
    private static portfolioValues: Collection;
    private static stockPurchases: Collection;
    private static transactions: Collection;

    private static async connect() {
        if (!this.client) {
            const uri = "mongodb://localhost:27017"; // Replace with your MongoDB URI
            this.client = new MongoClient(uri);
            await this.client.connect();
            console.log("Connected to MongoDB");
            this.db = this.client.db("automatedTrader"); // Replace with your database name
            this.portfolioValues = this.db.collection("portfolioValues");
            this.stockPurchases = this.db.collection("stockPurchases");
            this.transactions = this.db.collection("transactions");
        }
    }

    static async logPortfolioValue(date: Date, value: number) {
        await this.connect();
        try {
            const existingEntry = await this.portfolioValues.findOne({ date });
            if (!existingEntry) {
                await this.portfolioValues.insertOne({ date, value });
                console.log("Logged portfolio value:", { date, value });
            } else {
                console.log("Portfolio value for today already exists.");
            }
        } catch (error) {
            console.error("Error logging portfolio value:", error);
        }
    }

    static async logStockPurchase(ticker: string, date: Date, price: number) {
        await this.connect();
        try {
            await this.stockPurchases.insertOne({ ticker, date, price });
            console.log("Logged stock purchase:", { ticker, date, price });
        } catch (error) {
            console.error("Error logging stock purchase:", error);
        }
    }

    static async removeStockPurchase(ticker: string, date: Date) {
        await this.connect();
        try {
            await this.stockPurchases.deleteOne({ ticker, date });
            console.log("Removed stock purchase:", { ticker, date });
        } catch (error) {
            console.error("Error removing stock purchase:", error);
        }
    }

    static async logTransaction(ticker: string, date: Date, quantity: number, price: number, type: "buy" | "sell") {
        await this.connect();
        try {
            await this.transactions.insertOne({ ticker, date, quantity, price, type });
            console.log("Logged transaction:", { ticker, date, quantity, price, type });
        } catch (error) {
            console.error("Error logging transaction:", error);
        }
    }

    static async close() {
        if (this.client) {
            await this.client.close();
            console.log("MongoDB connection closed");
        }
    }
}

export default DatabaseManager;