import fs from 'fs';
import path from 'path';
import Config from './Config.js';
import StockListManager from './StockListManager.js';
import TradeExecutor from '../services/TradeExecutor.js';

export default class Serializer {
    private static filePath = path.join(__dirname, '../storage/state.json');

    static serialize(tradeExecutor: TradeExecutor): void {
        const state = {
            config: Config.toJSON(),
            stockListManager: StockListManager.toJSON(),
            tradeExecutor: tradeExecutor.toJSON()
        };

        const jsonString = JSON.stringify(state, null, 2);
        fs.writeFileSync(this.filePath, jsonString, 'utf8');
        console.log('State has been serialized to', this.filePath);
    }
}
