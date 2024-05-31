"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require('fs');
var path = require('path');
var Logger = /** @class */ (function () {
    function Logger() {
        this.logDirectory = path.join(__dirname, 'logs'); // Directory for log files
        this.currentDate = this.getCurrentDate();
        this.logFile = path.join(this.logDirectory, "".concat(this.currentDate, ".log"));
        // Ensure the log directory exists
        if (!fs.existsSync(this.logDirectory)) {
            fs.mkdirSync(this.logDirectory, { recursive: true });
        }
    }
    Logger.prototype.getCurrentDate = function () {
        var now = new Date();
        var year = now.getFullYear();
        var month = String(now.getMonth() + 1).padStart(2, '0');
        var day = String(now.getDate()).padStart(2, '0');
        return "".concat(year, "-").concat(month, "-").concat(day);
    };
    Logger.prototype.log = function (message) {
        var now = new Date();
        var timestamp = now.toISOString();
        var logMessage = "[".concat(timestamp, "] ").concat(message, "\n");
        // Check if the date has changed to start a new log file
        var currentDate = this.getCurrentDate();
        if (currentDate !== this.currentDate) {
            this.currentDate = currentDate;
            this.logFile = path.join(this.logDirectory, "".concat(this.currentDate, ".log"));
        }
        fs.appendFile(this.logFile, logMessage, function (err) {
            if (err) {
                console.error('Failed to write to log file:', err);
            }
        });
    };
    return Logger;
}());
exports.default = Logger;
