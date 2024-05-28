const fs = require('fs');
const path = require('path');

class Logger {
    constructor() {
        this.logDirectory = path.join(__dirname, 'logs'); // Directory for log files
        this.currentDate = this.getCurrentDate();
        this.logFile = path.join(this.logDirectory, `${this.currentDate}.log`);

        // Ensure the log directory exists
        if (!fs.existsSync(this.logDirectory)) {
            fs.mkdirSync(this.logDirectory, { recursive: true });
        }
    }

    getCurrentDate() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    log(message) {
        const now = new Date();
        const timestamp = now.toISOString();
        const logMessage = `[${timestamp}] ${message}\n`;

        // Check if the date has changed to start a new log file
        const currentDate = this.getCurrentDate();
        if (currentDate !== this.currentDate) {
            this.currentDate = currentDate;
            this.logFile = path.join(this.logDirectory, `${this.currentDate}.log`);
        }

        fs.appendFile(this.logFile, logMessage, (err) => {
            if (err) {
                console.error('Failed to write to log file:', err);
            }
        });
    }
}

module.exports = Logger;