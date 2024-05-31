"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Stock = /** @class */ (function () {
    function Stock(ticker, price) {
        this.ticker = ticker;
        this.price = price;
    }
    Stock.prototype.getTicker = function () {
        return this.ticker;
    };
    Stock.prototype.getPrice = function () {
        return this.price;
    };
    Stock.prototype.setPrice = function (price) {
        this.price = price;
    };
    return Stock;
}());
exports.default = Stock;
