import fs from 'fs';
import path from 'path';
import Config from './Config.js';
import StockListManager from './StockListManager.js';
import TradeExecutor from '../services/TradeExecutor.js';

export default class Deserializer {
    private static filePath = path.join(__dirname, '../storage/state.json');

    static deserialize(): void {
        const jsonString = fs.readFileSync(this.filePath);
        //TODO pull from JSON and run fromJSON methods
        console.log('State has been serialized to', this.filePath);
    }
}