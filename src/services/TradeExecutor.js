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
var Logger_1 = require("../../src/utils/Logger");
var Portfolio_1 = require("../models/Portfolio");
var StockListManager = require("../utils/StockListManager");
var TradeExecutor = /** @class */ (function () {
    function TradeExecutor(config, cash) {
        this.logger = new Logger_1.default();
        this.portfolio = new Portfolio_1.default(cash, new Date());
        this.maxCap = config.maxCap;
    }
    TradeExecutor.prototype.update = function (signal, ticker) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("Received signal for ".concat(ticker, ": ").concat(signal));
                        return [4 /*yield*/, this.executeTrade(signal, ticker)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // Method to execute trades based on the signal
    TradeExecutor.prototype.executeTrade = function (signal, ticker) {
        return __awaiter(this, void 0, void 0, function () {
            var currStockPrice, currentStockValue, totalValue, maxInvestment, availableCash, amountToInvest, quantity, quantity;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, StockListManager.getStockPrice(ticker)];
                    case 1:
                        currStockPrice = _a.sent();
                        currentStockValue = this.portfolio.getHoldings(ticker) * currStockPrice;
                        totalValue = this.portfolio.getCash() + this.portfolio.getPortfolioValue();
                        maxInvestment = totalValue * this.maxCap;
                        console.log("current price for " + ticker + " is " + currStockPrice);
                        console.log(", currently have" + currentStockValue + " of the stock. Can invest " + maxInvestment);
                        if (signal > 40 && currentStockValue < maxInvestment) {
                            console.log("we can invest more in " + ticker);
                            availableCash = this.portfolio.getCash();
                            amountToInvest = Math.min(maxInvestment - currentStockValue, availableCash);
                            if (amountToInvest > 0) {
                                quantity = Math.floor(amountToInvest / currStockPrice);
                                if (quantity > 0) {
                                    this.portfolio.buyStock(ticker, currStockPrice, quantity);
                                    this.logger.log("Bought ".concat(quantity, " shares of ").concat(ticker, " at ").concat(currStockPrice, " each."));
                                }
                            }
                        }
                        else if (signal < -40) {
                            quantity = this.portfolio.getHoldings(ticker);
                            if (quantity > 0) {
                                this.portfolio.sellStock(ticker, currStockPrice, quantity);
                                this.logger.log("Sold ".concat(quantity, " shares of ").concat(ticker, " at ").concat(currStockPrice, " each."));
                            }
                        }
                        else if (this.portfolio.getHoldings(ticker) > 0) {
                            this.logger.log("Holding ".concat(ticker, ". No action taken."));
                        }
                        else {
                            this.logger.log("No action for ".concat(ticker, "."));
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return TradeExecutor;
}());
exports.default = TradeExecutor;
