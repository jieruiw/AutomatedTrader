import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import Scheduler from './utils/Scheduler.js';
import TradeExecutor from './services/TradeExecutor.js';
import Config from "./utils/Config.js";
import StateManager from "./utils/StateManager.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const storageDir = path.join(rootDir, 'src/storage');
async function initialize() {
    const filePath = path.join(storageDir, 'state.json');
    const scheduler = new Scheduler();
    let tradeExecutor;
    if (fs.existsSync(filePath)) {
        tradeExecutor = StateManager.deserialize();
        scheduler.addObserver(tradeExecutor);
        await scheduler.continue();
    }
    else {
        Config.set(0.3, 0.5, 0.2, 0.1);
        const initialCash = 100000;
        tradeExecutor = new TradeExecutor(initialCash);
        scheduler.addObserver(tradeExecutor);
        let stocks = ['TSLA', 'AAPL', 'NVDA', 'MGM', 'GPS'];
        await scheduler.start(stocks);
    }
    await scheduler.manualCheck();
    console.log('Trading application started...');
    // Graceful shutdown
    process.on('SIGINT', () => {
        console.log('Caught interrupt signal');
        StateManager.serialize(tradeExecutor);
        process.exit();
    });
}
initialize();
//TODO: save application process and ability to resume, and also dynamically interact with program.
