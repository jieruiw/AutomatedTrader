import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Config from './Config.js';
import StockListManager from './StockListManager.js';
import TradeExecutor from '../services/TradeExecutor.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');
const storageDir = path.join(rootDir, 'src/storage');



export default class StateManager {
    private static tradeExecutor: TradeExecutor | null = null;

    private static filePath = path.join(storageDir, 'state.json');

    static setTradeExecutor(tradeExecutor: TradeExecutor) {
        this.tradeExecutor = tradeExecutor;
    }

    static getTradeExecutor(): TradeExecutor {
        if (!this.tradeExecutor) {
            throw new Error('TradeExecutor not initialized');
        }
        return this.tradeExecutor;
    }

    static serialize(tradeExecutor: TradeExecutor): void {
        const state = {
            config: Config.toJSON(),
            stockListManager: StockListManager.toJSON(),
            tradeExecutor: tradeExecutor.toJSON()
        };

        const jsonString = JSON.stringify(state, null, 2);

        if (!fs.existsSync(storageDir)) {
            fs.mkdirSync(storageDir, { recursive: true });
        }

        fs.writeFileSync(this.filePath, jsonString, 'utf8');
        console.log('State has been serialized to', this.filePath);
    }

    static deserialize(): TradeExecutor {
        const jsonString = fs.readFileSync(this.filePath).toString();
        const json = JSON.parse(jsonString);
        StockListManager.fromJSON(json.stockListManager);
        Config.fromJSON(json.config);
        const te = TradeExecutor.fromJSON(json.tradeExecutor);
        console.log('State has been deserialized from, ', this.filePath);
        return te;
    }


}
