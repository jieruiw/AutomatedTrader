import fs from "fs";
import path from "path";
import cors from 'cors';
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
app.use(cors());
app.use(express.json());
app.use('/api', router);
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
        Config.set(0.25, 0.6, 0.15, 0.04);
        const initialCash = 100000;
        tradeExecutor = new TradeExecutor(initialCash);
        scheduler.addObserver(tradeExecutor);
        let stocks = ['CRBG', 'COST', 'WMT', 'NXT', 'TSM', 'ARM', 'TSLA', 'AAPL', 'NVDA', 'MGM', 'MOD', 'GPS', 'AMZN', 'RIVN', 'F', 'MSFT', 'META',
            'GOOG', 'FLNC', 'LLY', 'JPM', 'PG', 'AMD', 'ANET', 'PYPL', 'EXC', 'EA', 'BIIB', 'JD', 'HPQ', 'RCL', 'ARM', 'ANF',
            'CHWY', 'JNJ', 'PFE', 'MRK', 'UNH', 'ABBV', 'HD', 'BAC', 'WBD', 'INTC', 'ADBE', 'CSCO', 'CRM', 'GS', 'C', 'WFC', 'KO', 'PEP', 'UL', 'CL', 'GE',
            'BA', 'CAT', 'MMM', 'HON', 'XOM', 'CVX', 'COP', 'GM', 'NKE', 'SLB', 'HAL', 'V', 'NEE', 'DUK', 'D', 'SO', 'AEP', 'VZ', 'T',
            'TMUS', 'CMCSA', 'CHTR', 'DIS', 'MCD', 'SBUX', 'NFLX', 'OSCR', 'VMEO', 'PLTR', 'WWW', 'BRFS', 'DFIN', 'GTN',
            'HIMS', 'MMYT', 'ML', 'PCTY', 'RGA', 'SSTK', 'JYNT', 'TGT', 'WRK', 'WWD', 'AROC', 'NVRI', 'GVA', 'HAS', 'LDOS',
            'NWPX', 'OSPN', 'AGS', 'SPXC', 'MRNA', 'AXTA', 'GRMN', 'NGD', 'CVLT', 'VTMX', 'MS', 'POWL', 'TMHC', 'WING',
            'ZBRA', 'AEM', 'MBIN', 'MTX', 'AMKR', 'KALU', 'SKX', 'UMBF', 'CSL', 'NTNX', 'OSK', 'PUBM', 'ZM', 'SKYW',
            'TPH', 'SPOT', 'WAB', 'ERO', 'PHM', 'AZZ', 'ASIX', 'GFF', 'LPX', 'AU', 'BMI', 'GFI', 'FBK', 'LAKE', 'SUZ', 'HG',
            'DBD', 'JAKK', 'STEP', 'NTRS', 'TROW', 'GRPN', 'BB', 'GBX', 'GCT', 'CIFR', 'FIX', 'HCI', 'EME', 'COIN', 'INSW',
            'DUOL', 'BKNG', 'BSIG', 'CLS', 'GPRK', 'IVR', 'ITOCY', 'JHG', 'LMAT', 'M', 'MA', 'AXP', 'MS', 'MLM', 'NTIC', 'OPCH', 'PDD',
            'RSVR', 'SM', 'SGRP', 'ODP', 'WU', 'UPLD', 'VTS', 'APTV', 'EAT', 'CPA', 'DD', 'LNTH', 'PBI', 'UNCRY', 'VEL',
            'ANF', 'GOLD', 'HTHIY', 'COOP', 'MMS', 'SHIP', 'SCBFF', 'TYL', 'MNDY', 'FWONK', 'SPNS', 'CIM', 'DY', 'BMA',
            'PRMW', 'LPG', 'HUYA', 'OC', 'TOELY', 'CHWY', 'DBX', 'AOSL', 'UNP', 'IDN', 'KBCSY', 'BEKE', 'KD', 'IAG', 'SIG',
            'SCCO', 'SRDX', 'GOOS', 'NEWT', 'PETQ', 'BWEN', 'GS', 'IPW', 'HL', 'ODD', 'ACIC', 'EMBC', 'SRTS',
            'SNCR', 'BLBD', 'HBI', 'HMY', 'ITRI', 'SLVM', 'VITL', 'APP', 'ASM', 'DDOG', 'EPC', 'GLDD', 'HY',
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
