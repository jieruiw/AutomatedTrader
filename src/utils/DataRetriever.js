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
var axios_1 = require("axios");
var cheerio = require("cheerio");
function getZacksRank(ticker) {
    return __awaiter(this, void 0, void 0, function () {
        var response, html, $_1, rankChips, zacksRank_1, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("running getZacks for " + ticker);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios_1.default.get('https://www.zacks.com/stock/quote/' + ticker)];
                case 2:
                    response = _a.sent();
                    html = response.data;
                    $_1 = cheerio.load(html);
                    rankChips = $_1('.rank_chip');
                    zacksRank_1 = null;
                    rankChips.each(function (index, element) {
                        var text = $_1(element).text().trim();
                        if (text && text !== '&nbsp;') {
                            zacksRank_1 = parseInt(text, 10);
                            return false;
                        }
                    });
                    return [2 /*return*/, zacksRank_1];
                case 3:
                    error_1 = _a.sent();
                    throw new Error("Error fetching Zacks Rank for ".concat(ticker, "!"));
                case 4: return [2 /*return*/];
            }
        });
    });
}
function getPriceTargets(ticker) {
    return __awaiter(this, void 0, void 0, function () {
        var response, html, $, low, average, current, high, priceTargets, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios_1.default.get('https://finance.yahoo.com/quote/' + ticker)];
                case 1:
                    response = _a.sent();
                    html = response.data;
                    $ = cheerio.load(html);
                    low = $('.lowLabel .price').text().trim();
                    average = $('.average .price').text().trim();
                    current = $('.current .price').text().trim();
                    high = $('.highLabel .price').text().trim();
                    priceTargets = {
                        low: parseFloat(low.replace(',', '')),
                        average: parseFloat(average.replace(',', '')),
                        current: parseFloat(current.replace(',', '')),
                        high: parseFloat(high.replace(',', '')),
                    };
                    priceTargets.low = parseFloat(low);
                    priceTargets.average = parseFloat(average);
                    priceTargets.current = parseFloat(current);
                    priceTargets.high = parseFloat(high);
                    return [2 /*return*/, priceTargets];
                case 2:
                    error_2 = _a.sent();
                    console.error("Error fetching price targets for ".concat(ticker, ":"), error_2);
                    throw new Error("Error fetching price targets for ".concat(ticker, "!"));
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getSMA(ticker, time) {
    return __awaiter(this, void 0, void 0, function () {
        var baseURL, params, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    baseURL = 'https://api.twelvedata.com/sma';
                    params = {
                        symbol: ticker,
                        interval: '1day',
                        apikey: '64054d02fbb640a5972ec2fb4061bfd8',
                        outputsize: 10,
                        time_period: time
                    };
                    return [4 /*yield*/, axios_1.default.get(baseURL, { params: params })];
                case 1:
                    response = _a.sent();
                    if (response.status === 200 && response.data.status === "ok") {
                        return [2 /*return*/, response.data.values.map(function (item) { return ({
                                datetime: item.datetime,
                                sma: parseFloat(item.sma)
                            }); })];
                    }
                    else {
                        throw new Error("API Error: ".concat(response.data.message));
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function getEMA(ticker, time) {
    return __awaiter(this, void 0, void 0, function () {
        var baseURL, params, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    baseURL = 'https://api.twelvedata.com/ema';
                    params = {
                        symbol: ticker,
                        interval: '1day',
                        apikey: '8e6856af48ce4ea6aebdf9d955cd80e1',
                        outputsize: 10,
                        time_period: time
                    };
                    return [4 /*yield*/, axios_1.default.get(baseURL, { params: params })];
                case 1:
                    response = _a.sent();
                    if (response.status === 200 && response.data.status === "ok") {
                        return [2 /*return*/, response.data.values.map(function (item) { return ({
                                datetime: item.datetime,
                                ema: parseFloat(item.ema)
                            }); })];
                    }
                    else {
                        throw new Error("API Error: ".concat(response.data.message));
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function getRSI(ticker) {
    return __awaiter(this, void 0, void 0, function () {
        var baseURL, params, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    baseURL = 'https://api.twelvedata.com/rsi';
                    params = {
                        symbol: ticker,
                        interval: '1day',
                        apikey: '6441fada692f4c2baa006b2ca9080b4d'
                    };
                    return [4 /*yield*/, axios_1.default.get(baseURL, { params: params })];
                case 1:
                    response = _a.sent();
                    if (response.status === 200 && response.data.status === "ok") {
                        return [2 /*return*/, response.data.values.map(function (item) { return ({
                                datetime: item.datetime,
                                rsi: parseFloat(item.rsi)
                            }); })];
                    }
                    else {
                        throw new Error("API Error: ".concat(response.data.message));
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function getMACD(ticker) {
    return __awaiter(this, void 0, void 0, function () {
        var baseURL, params, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    baseURL = 'https://api.twelvedata.com/macd';
                    params = {
                        symbol: ticker,
                        interval: '1day',
                        apikey: '8ce78a0fe62449c6b79fc0fc54dff3dc'
                    };
                    return [4 /*yield*/, axios_1.default.get(baseURL, { params: params })];
                case 1:
                    response = _a.sent();
                    if (response.status === 200 && response.data.status === "ok") {
                        return [2 /*return*/, response.data.values.map(function (item) { return ({
                                datetime: item.datetime,
                                macd: parseFloat(item.macd),
                                macd_signal: parseFloat(item.macd_signal),
                                macd_hist: parseFloat(item.macd_hist)
                            }); })];
                    }
                    else {
                        throw new Error("API Error: ".concat(response.data.message));
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function getBBands(ticker) {
    return __awaiter(this, void 0, void 0, function () {
        var baseURL, params, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    baseURL = "https://api.twelvedata.com/bbands";
                    params = {
                        symbol: ticker,
                        interval: "1day",
                        apikey: "2bb245a933f144978a57512e9699008c"
                    };
                    return [4 /*yield*/, axios_1.default.get(baseURL, { params: params })];
                case 1:
                    response = _a.sent();
                    if (response.status === 200 && response.data.status === "ok") {
                        return [2 /*return*/, response.data.values.map(function (item) { return ({
                                datetime: item.datetime,
                                upper_band: parseFloat(item.upper_band),
                                middle_band: parseFloat(item.middle_band),
                                lower_band: parseFloat(item.lower_band)
                            }); })];
                    }
                    else {
                        throw new Error("API Error: ".concat(response.data.message));
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function getOBV(ticker) {
    return __awaiter(this, void 0, void 0, function () {
        var baseURL, params, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    baseURL = "https://api.twelvedata.com/obv";
                    params = {
                        symbol: ticker,
                        interval: "1day",
                        apikey: "38e6a82f685b42e391a5253de6c6d555"
                    };
                    return [4 /*yield*/, axios_1.default.get(baseURL, { params: params })];
                case 1:
                    response = _a.sent();
                    if (response.status === 200 && response.data.status === "ok") {
                        return [2 /*return*/, response.data.values.map(function (item) { return ({
                                datetime: item.datetime,
                                obv: parseFloat(item.obv)
                            }); })];
                    }
                    else {
                        throw new Error("API Error: ".concat(response.data.message));
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function getStockPrice(ticker) {
    return __awaiter(this, void 0, void 0, function () {
        var url, response, html, $, priceElement, price, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = "https://finance.yahoo.com/quote/".concat(ticker);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios_1.default.get(url)];
                case 2:
                    response = _a.sent();
                    html = response.data;
                    $ = cheerio.load(html);
                    priceElement = $('fin-streamer[data-field="regularMarketPrice"]');
                    price = priceElement.attr('data-value');
                    if (price) {
                        return [2 /*return*/, parseFloat(price)];
                    }
                    else {
                        throw new Error("No price found for ticker ".concat(ticker));
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    console.error("Error fetching stock price for ".concat(ticker, ":"), error_3.message);
                    throw error_3;
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.default = { getZacksRank: getZacksRank, getPriceTargets: getPriceTargets, getSMA: getSMA, getEMA: getEMA, getRSI: getRSI, getMACD: getMACD, getBBands: getBBands, getOBV: getOBV, getStockPrice: getStockPrice };
