import { MongoClient, Db, Collection } from 'mongodb';

export default class DatabaseManager {
    private static client: MongoClient;
    private static db: Db;
    private static portfolioValues: Collection;
    private static stockPurchases: Collection;
    private static transactions: Collection;

    private static async connect() {
        if (!this.client) {
            const uri =
                "mongodb+srv://Cluster32374:UUdrfX1hT3JV@cluster32374.seietog.mongodb.net/myNewDatabase?retryWrites=true&w=majority";
            this.client = new MongoClient(uri);
            await this.client.connect();
            console.log("Connected to MongoDB");
            this.db = this.client.db("Database");
            this.portfolioValues = this.db.collection("portfolioValues");
            this.stockPurchases = this.db.collection("stockPurchases");
            this.transactions = this.db.collection("transactions");
        }
    }

    static async logPortfolioValue(date: Date, value: number) {
        await this.connect();
        const newDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        try {
            const existingEntry = await this.portfolioValues.findOne({ newDate });
            if (!existingEntry) {
                await this.portfolioValues.insertOne({ newDate, value });
                console.log("Logged portfolio value:", { newDate, value });
            } else {
                console.log("Portfolio value for today already exists.");
            }
        } catch (error) {
            console.error("Error logging portfolio value:", error);
        }
    }

    static async logStockPurchase(ticker: string, date: Date, price: number, quantity: number) {
        await this.connect();
        try {
            const existingEntries = await this.stockPurchases.find({ ticker }).toArray();
            let totalQuantity = quantity;
            let totalCost = price * quantity;
            let oldestDate = date;

            if (existingEntries.length > 0) {
                for (const entry of existingEntries) {
                    totalQuantity += entry.quantity;
                    totalCost += entry.price * entry.quantity;
                    if (entry.date < oldestDate) {
                        oldestDate = entry.date;
                    }
                }

                // Delete existing entries
                await this.stockPurchases.deleteMany({ ticker });
            }

            const weightedAveragePrice = totalCost / totalQuantity;
            const newEntry = {
                ticker,
                date: oldestDate,
                price: weightedAveragePrice,
                quantity: totalQuantity
            };

            await this.stockPurchases.insertOne(newEntry);
            console.log("Logged stock purchase:", newEntry);
        } catch (error) {
            console.error("Error logging stock purchase:", error);
        }
    }

    static async reduceStockPurchase(ticker: string, date: Date, quantity: number) {
        await this.connect();
        try {
            const existingEntry = await this.stockPurchases.findOne({ ticker });
            if (!existingEntry) {
                throw new Error(`No stock found for ticker: ${ticker}`);
            }

            const newQuantity = existingEntry.quantity - quantity;

            if (newQuantity > 0) {
                await this.stockPurchases.updateOne(
                    { ticker },
                    { $set: { quantity: newQuantity } }
                );
                console.log("Updated stock purchase:", { ticker, date: existingEntry.date, quantity: newQuantity });
            } else {
                await this.stockPurchases.deleteOne({ ticker });
                console.log("Removed stock purchase:", { ticker, date: existingEntry.date });
            }
        } catch (error) {
            console.error("Error removing stock purchase:", error);
            throw error;
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

    //return the list of the most recent 50 transactions
    static async getTransactions() {
        await this.connect();
        try {
            const transactions = await this.transactions.find().sort({ date: -1 }).limit(50).toArray();
            console.log("Fetched transactions:", transactions);
            return transactions;
        } catch (error) {
            console.error("Error fetching transactions:", error);
            throw error;
        }
    }

    // gets portfolio values of the specified length of date
    static async getHistoricalData(period: string) {
        await this.connect();
        try {
            const endDate = new Date();
            let startDate: Date;

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
                newDate: { $gte: startDate, $lte: endDate }
            }).toArray();

            console.log("Fetched historical data:", historicalData);
            return historicalData;
        } catch (error) {
            console.error("Error fetching historical data:", error);
            throw error;
        }
    }

    // gets the corresponding "price" field of the stockPurchases collection
    static async getBookValue(ticker: string) {
        await this.connect();
        try {
            const stock = await this.stockPurchases.findOne({ ticker });
            if (stock) {
                console.log("Fetched book value:", stock.price);
                return stock.price;
            } else {
                console.log("Stock not found");
                return null;
            }
        } catch (error) {
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
