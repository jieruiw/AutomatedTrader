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
        Config.set(0.25, 0.6, 0.15, 0.05);
        const initialCash = 100000;
        tradeExecutor = new TradeExecutor(initialCash);
        scheduler.addObserver(tradeExecutor);
        let stocks = ['TSM', 'ARM', 'TSLA', 'AAPL', 'NVDA', 'MGM', 'GPS', 'AMZN', 'RIVN', 'F', 'MSFT', 'META',
            'GOOG', 'FLNC', 'LLY', 'JPM', 'PG', 'AMD', 'PYPL', 'EXC', 'EA', 'BIIB', 'JD', 'HPQ', 'RCL', 'ARM', 'ANF',
            'CHWY', 'JNJ', 'PFE', 'MRK', 'UNH', 'ABBV', 'BAC', 'GS', 'C', 'WFC', 'KO', 'PEP', 'UL', 'CL', 'GE',
            'BA', 'CAT', 'MMM', 'HON', 'XOM', 'CVX', 'COP', 'SLB', 'HAL', 'NEE', 'DUK', 'D', 'SO', 'AEP', 'VZ', 'T',
            'TMUS', 'CMCSA', 'CHTR', 'DIS', 'MCD', 'SBUX', 'NFLX', 'OSCR', 'VMEO', 'PLTR',
            'WWW', 'BRFS', 'DFIN', 'GTN', 'HIMS', 'MMYT', 'ML', 'PCTY', 'RGA', 'SSTK', 'JYNT', 'WRK', 'WWD', 'AROC',
            'CRS', 'NVRI', 'GVA', 'HAS', 'LDOS', 'NWPX', 'OSPN', 'AGS', 'SPXC', 'VMI', 'AXTA', 'GRMN', 'NGD', 'CVLT', 'VTMX',
            'MS', 'POWL', 'SNBR', 'TMHC', 'WING', 'ZBRA', 'AEM', 'MBIN', 'MTX', 'AMKR', 'KALU', 'SKX', 'UMBF', 'CSL', 'EXPO',
            'NTNX', 'OSK', 'PIPR', 'PUBM', 'SKYW', 'TPH', 'MHO', 'SPOT', 'WAB', 'ERO', 'MEDP', 'PHM', 'AZZ', 'ASIX', 'LPX', 'AU', 'BMI', 'GFI',
            'FBK', 'LAKE', 'SUZ', 'HG', 'DBD', 'JAKK', 'STEP', 'NTRS', 'TROW', 'GRPN', 'BB', 'GBX', 'GCT', 'CIFR',
            'FIX', 'HCI', 'EME', 'COIN', 'DUOL', 'BKNG', 'BSIG', 'CLS', 'GPRK', 'IVR', 'ITOCY', 'JHG',
            'LMAT', 'M', 'MLM', 'NTIC', 'OPCH', 'PDD', 'RSVR', 'SM', 'SGRP', 'ODP', 'WU', 'UPLD', 'VTS', 'APTV',
            'EAT', 'CPA', 'DD', 'LNTH', 'PBI', 'UNCRY', 'VEL', 'ANF', 'GOLD', 'HTHIY', 'COOP', 'MMS', 'SHIP', 'SCBFF',
            'TYL', 'MNDY', 'FWONK', 'SPNS', 'CIM', 'DY', 'BMA', 'PRMW', 'RBA', 'LPG', 'HUYA', 'OC', 'TOELY', 'CHWY',
            'DBX', 'AOSL', 'IDN', 'KBCSY', 'BEKE', 'KD', 'NPSNY', 'IAG', 'SIG', 'SCCO', 'SRDX',
            'GOOS', 'NEWT', 'PETQ', 'BWEN', 'GS', 'IPW', 'HL', 'ODD', 'PED', 'ACIC', 'EMBC', 'SRTS',
            'SNCR', 'ANET', 'BLBD', 'HBI', 'HMY', 'ITRI', 'SLVM', 'VITL', 'APP', 'ASM', 'DDOG', 'EPC', 'GLDD',
            'HY', 'OGN', 'PMT', 'SN', 'TRTX', 'TPC', 'ARKO', 'SIMO', 'SFM'];
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
