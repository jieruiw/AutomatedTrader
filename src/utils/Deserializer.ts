import fs from 'fs';
import path from 'path';
import Config from './Config.js';
import StockListManager from './StockListManager.js';
import TradeExecutor from '../services/TradeExecutor.js';
export default class Deserializer {
    private static filePath = path.join(__dirname, '../storage/state.json');

    static deserialize(): void {
        const jsonString = fs.readFileSync(this.filePath).toString();
        const json = JSON.parse(jsonString);
        StockListManager.fromJSON(json.stockListManager);
        Config.fromJSON(json.config);
        TradeExecutor.fromJSON(json.tradeExecutor);
        console.log('State has been deserialized from, ', this.filePath);
    }
}