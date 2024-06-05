import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import express from 'express';
import Scheduler from './utils/Scheduler.js';
import TradeExecutor from './services/TradeExecutor.js';
import Config from "./utils/Config.js";
import StateManager from "./utils/StateManager.js";
import DatabaseManager from "./utils/DatabaseManager.js";
import router from "./routes/routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '..');
const storageDir = path.join(rootDir, 'src/storage');

const app = express();
const port = 3000;

app.use(express.json());
app.use('/api', router);

async function initialize() {

    const filePath = path.join(storageDir, 'state.json');
    const scheduler = new Scheduler();
    let tradeExecutor: TradeExecutor;

    if (fs.existsSync(filePath)) {
        tradeExecutor = StateManager.deserialize();
        scheduler.addObserver(tradeExecutor);
        await scheduler.continue();

    } else {

        Config.set(0.25, 0.6, 0.15, 0.05);
        const initialCash = 100000;
        tradeExecutor = new TradeExecutor(initialCash);
        scheduler.addObserver(tradeExecutor);
        let stocks = ['TSM', 'ARM', 'TSLA', 'AAPL', 'NVDA', 'MGM', 'MOD', 'GPS', 'AMZN', 'RIVN', 'F', 'MSFT', 'META',
            'GOOG', 'FLNC', 'LLY', 'JPM', 'PG', 'AMD', 'APP', 'ASM', 'DDOG', 'EPC', 'GLDD', 'HY',
            'OGN', 'PMT', 'SN', 'TRTX', 'TPC', 'ARKO', 'SIMO', 'SFM'];
        await scheduler.start(stocks);
    }

    StateManager.setTradeExecutor(tradeExecutor);

    // await scheduler.manualCheck();

    let portfolioValue = tradeExecutor.getPortfolio().getPortfolioValue();
    await DatabaseManager.logPortfolioValue(new Date(), portfolioValue);
    console.log('Trading application started...');

    // Graceful shutdown
    process.on('SIGINT', () => {
        console.log('Caught interrupt signal');
        StateManager.serialize(tradeExecutor);
        process.exit();
    });
}

initialize().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}).catch(err => {
    console.error("Error initializing application", err);
});



