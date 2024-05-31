"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var DataRetriever_1 = require("../utils/DataRetriever");
var TradingAlgorithm = /** @class */ (function () {
    function TradingAlgorithm(config) {
        this.config = config;
    }
    TradingAlgorithm.prototype.decision = function (ticker) {
        return __awaiter(this, void 0, void 0, function () {
            var zacksRank, technicalScore, analystScore;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.zacksDecision(ticker)];
                    case 1:
                        zacksRank = _a.sent();
                        return [4 /*yield*/, this.technicalDecision(ticker)];
                    case 2:
                        technicalScore = _a.sent();
                        return [4 /*yield*/, this.analystDecision(ticker)];
                    case 3:
                        analystScore = _a.sent();
                        console.log('zacks is: ' + zacksRank);
                        console.log('technical is: ' + technicalScore);
                        console.log('analyst is: ' + analystScore);
                        return [2 /*return*/, (this.config.weights.zacks * zacksRank) +
                                (this.config.weights.technical * technicalScore) +
                                (this.config.weights.analyst * analystScore)];
                }
            });
        });
    };
    TradingAlgorithm.prototype.zacksDecision = function (ticker) {
        return __awaiter(this, void 0, void 0, function () {
            var zacksRank;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, DataRetriever_1.default.getZacksRank(ticker)];
                    case 1:
                        zacksRank = _a.sent();
                        try {
                            switch (zacksRank) {
                                case 1:
                                    return [2 /*return*/, 100];
                                case 2:
                                    return [2 /*return*/, 50];
                                case 3:
                                    return [2 /*return*/, 0];
                                case 4:
                                    return [2 /*return*/, -50];
                                case 5:
                                    return [2 /*return*/, -100];
                            }
                        }
                        catch (e) {
                            console.error(e);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    TradingAlgorithm.prototype.technicalDecision = function (ticker) {
        return __awaiter(this, void 0, void 0, function () {
            var sma50, sma200, ema50, ema200, rsi, macd, bbands, obv, maResult, rsiResult, macdResult, bbandsResult, obvResult, overallResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, DataRetriever_1.default.getSMA(ticker, 30)];
                    case 1:
                        sma50 = _a.sent();
                        return [4 /*yield*/, DataRetriever_1.default.getSMA(ticker, 120)];
                    case 2:
                        sma200 = _a.sent();
                        return [4 /*yield*/, DataRetriever_1.default.getEMA(ticker, 30)];
                    case 3:
                        ema50 = _a.sent();
                        return [4 /*yield*/, DataRetriever_1.default.getEMA(ticker, 120)];
                    case 4:
                        ema200 = _a.sent();
                        return [4 /*yield*/, DataRetriever_1.default.getRSI(ticker)];
                    case 5:
                        rsi = _a.sent();
                        return [4 /*yield*/, DataRetriever_1.default.getMACD(ticker)];
                    case 6:
                        macd = _a.sent();
                        return [4 /*yield*/, DataRetriever_1.default.getBBands(ticker)];
                    case 7:
                        bbands = _a.sent();
                        return [4 /*yield*/, DataRetriever_1.default.getOBV(ticker)];
                    case 8:
                        obv = _a.sent();
                        maResult = this.maCalc(ema50, ema200, sma50, sma200);
                        rsiResult = this.rsiCalc(rsi);
                        macdResult = this.macdCalc(macd);
                        bbandsResult = this.bbandsCalc(bbands);
                        obvResult = this.obvCalc(obv);
                        console.log('maResult is: ' + maResult);
                        console.log('RSI is: ' + rsiResult);
                        console.log('macd is: ' + macdResult);
                        console.log('bbands is: ' + bbandsResult);
                        console.log('obv is: ' + obvResult);
                        overallResult = maResult + rsiResult + macdResult + bbandsResult + obvResult;
                        if (overallResult > 100) {
                            return [2 /*return*/, 100];
                        }
                        else if (overallResult < -100) {
                            return [2 /*return*/, -100];
                        }
                        return [2 /*return*/, overallResult];
                }
            });
        });
    };
    TradingAlgorithm.prototype.maCalc = function (emaShort, emaLong, smaShort, smaLong) {
        // Ensure we have data for the required periods
        if (!emaShort || !emaLong || !smaShort || !smaLong) {
            console.error('Missing data for moving averages');
            return 0; // Neutral signal due to insufficient data
        }
        // Determine the most recent values
        var latestShortTermEMA = emaShort[0].ema;
        var latestLongTermEMA = emaLong[0].ema;
        var latestShortTermSMA = smaShort[0].sma;
        var latestLongTermSMA = smaLong[0].sma;
        // Determine the values 1 day before (yesterday's values)
        var previousShortTermEMA = emaShort[1].ema;
        var previousLongTermEMA = emaLong[1].ema;
        var previousShortTermSMA = smaShort[1].sma;
        var previousLongTermSMA = smaLong[1].sma;
        // Primary Indicator: Check for Golden Cross and Death Cross for EMA
        if (previousShortTermEMA <= previousLongTermEMA && latestShortTermEMA > latestLongTermEMA) {
            // Golden Cross: 50-day EMA crosses above 200-day EMA
            return 30; // Strong positive signal
        }
        else if (previousShortTermEMA >= previousLongTermEMA && latestShortTermEMA < latestLongTermEMA) {
            // Death Cross: 50-day EMA crosses below 200-day EMA
            return -30; // Strong negative signal
        }
        // Primary Indicator: Check for Golden Cross and Death Cross for SMA
        if (previousShortTermSMA <= previousLongTermSMA && latestShortTermSMA > latestLongTermSMA) {
            // Golden Cross: 50-day SMA crosses above 200-day SMA
            return 30; // Strong positive signal
        }
        else if (previousShortTermSMA >= previousLongTermSMA && latestShortTermSMA < latestLongTermSMA) {
            // Death Cross: 50-day SMA crosses below 200-day SMA
            return -30; // Strong negative signal
        }
        // Secondary Indicator: General comparison of EMA and SMA
        if (latestShortTermEMA > latestShortTermSMA) {
            // Positive signal for upward trend
            return 20;
        }
        // Negative signal for downward trend
        return -20;
    };
    TradingAlgorithm.prototype.rsiCalc = function (rsi) {
        var rsiValue = rsi[0].rsi;
        if (rsiValue < 30) {
            return 30;
        }
        else if (rsiValue > 70) {
            return -30; // Overbought, negative signal
        }
        return 0;
    };
    TradingAlgorithm.prototype.macdCalc = function (macd) {
        var macdValue = macd[0].macd;
        var signalValue = macd[0].macd_signal;
        if (macdValue > signalValue) {
            return 20;
        }
        return -20;
    };
    TradingAlgorithm.prototype.bbandsCalc = function (bbands) {
        var currentPrice = bbands[0].middle_band; // Assume current price is close to middle_band
        if (currentPrice < bbands[0].lower_band) {
            return 20; // Below lower band, positive signal
        }
        else if (currentPrice > bbands[0].upper_band) {
            return -20; // Above upper band, negative signal
        }
        return 0;
    };
    TradingAlgorithm.prototype.obvCalc = function (obv) {
        var obvTrend = obv[0].obv - obv[1].obv;
        if (obvTrend > 0) {
            return 10; // Positive volume trend
        }
        return -10;
    };
    TradingAlgorithm.prototype.analystDecision = function (ticker) {
        return __awaiter(this, void 0, void 0, function () {
            var priceTargets, low, current, average, high, score, range, distanceFromAverage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, DataRetriever_1.default.getPriceTargets(ticker)];
                    case 1:
                        priceTargets = _a.sent();
                        low = priceTargets.low, current = priceTargets.current, average = priceTargets.average, high = priceTargets.high;
                        console.log(priceTargets);
                        score = 0;
                        if (current < low) {
                            score = 100; // Strong buy signal
                        }
                        else if (current > high) {
                            score = -100; // Strong sell signal
                        }
                        else {
                            range = high - low;
                            distanceFromAverage = average - current;
                            score = (distanceFromAverage / range) * 100;
                            // Ensure the score is within -100 to 100 range
                            if (score > 100)
                                score = 100;
                            if (score < -100)
                                score = -100;
                        }
                        return [2 /*return*/, score];
                }
            });
        });
    };
    return TradingAlgorithm;
}());
exports.default = TradingAlgorithm;
