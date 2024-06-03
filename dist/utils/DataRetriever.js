import axios from 'axios';
import * as cheerio from 'cheerio';
class DataRetriever {
    static async getZacksRank(ticker) {
        console.log("running getZacks for " + ticker);
        try {
            const response = await axios.get('https://www.zacks.com/stock/quote/' + ticker);
            const html = response.data;
            const $ = cheerio.load(html);
            const rankChips = $('.rank_chip');
            let zacksRank = null;
            rankChips.each((index, element) => {
                const text = $(element).text().trim();
                if (text && text !== '&nbsp;') {
                    zacksRank = parseInt(text, 10);
                    return false;
                }
            });
            return zacksRank;
        }
        catch (error) {
            throw new Error(`Error fetching Zacks Rank for ${ticker}!`);
        }
    }
    static async getPriceTargets(ticker) {
        try {
            const response = await axios.get('https://finance.yahoo.com/quote/' + ticker);
            const html = response.data;
            const $ = cheerio.load(html);
            const low = $('.lowLabel .price').text().trim();
            const average = $('.average .price').text().trim();
            const current = $('.current .price').text().trim();
            const high = $('.highLabel .price').text().trim();
            const priceTargets = {
                low: parseFloat(low.replace(',', '')),
                average: parseFloat(average.replace(',', '')),
                current: parseFloat(current.replace(',', '')),
                high: parseFloat(high.replace(',', '')),
            };
            priceTargets.low = parseFloat(low);
            priceTargets.average = parseFloat(average);
            priceTargets.current = parseFloat(current);
            priceTargets.high = parseFloat(high);
            return priceTargets;
        }
        catch (error) {
            console.error(`Error fetching price targets for ${ticker}:`, error);
            throw new Error(`Error fetching price targets for ${ticker}!`);
        }
    }
    static async getSMA(ticker, time) {
        const baseURL = 'https://api.twelvedata.com/sma';
        const params = {
            symbol: ticker,
            interval: '1day',
            apikey: this.getAPIKey(),
            outputsize: 10,
            time_period: time
        };
        const response = await axios.get(baseURL, { params });
        if (response.status === 200 && response.data.status === "ok") {
            return response.data.values.map((item) => ({
                datetime: item.datetime,
                sma: parseFloat(item.sma)
            }));
        }
        else {
            throw new Error(`API Error: ${response.data.message}`);
        }
    }
    static async getEMA(ticker, time) {
        const baseURL = 'https://api.twelvedata.com/ema';
        const params = {
            symbol: ticker,
            interval: '1day',
            apikey: this.getAPIKey(),
            outputsize: 10,
            time_period: time
        };
        const response = await axios.get(baseURL, { params });
        if (response.status === 200 && response.data.status === "ok") {
            return response.data.values.map((item) => ({
                datetime: item.datetime,
                ema: parseFloat(item.ema)
            }));
        }
        else {
            throw new Error(`API Error: ${response.data.message}`);
        }
    }
    static async getRSI(ticker) {
        const baseURL = 'https://api.twelvedata.com/rsi';
        const params = {
            symbol: ticker,
            interval: '1day',
            apikey: this.getAPIKey()
        };
        const response = await axios.get(baseURL, { params });
        if (response.status === 200 && response.data.status === "ok") {
            return response.data.values.map((item) => ({
                datetime: item.datetime,
                rsi: parseFloat(item.rsi)
            }));
        }
        else {
            throw new Error(`API Error: ${response.data.message}`);
        }
    }
    static async getMACD(ticker) {
        const baseURL = 'https://api.twelvedata.com/macd';
        const params = {
            symbol: ticker,
            interval: '1day',
            apikey: this.getAPIKey()
        };
        const response = await axios.get(baseURL, { params });
        if (response.status === 200 && response.data.status === "ok") {
            return response.data.values.map((item) => ({
                datetime: item.datetime,
                macd: parseFloat(item.macd),
                macd_signal: parseFloat(item.macd_signal),
                macd_hist: parseFloat(item.macd_hist)
            }));
        }
        else {
            throw new Error(`API Error: ${response.data.message}`);
        }
    }
    static async getBBands(ticker) {
        const baseURL = "https://api.twelvedata.com/bbands";
        const params = {
            symbol: ticker,
            interval: "1day",
            apikey: this.getAPIKey()
        };
        const response = await axios.get(baseURL, { params });
        if (response.status === 200 && response.data.status === "ok") {
            return response.data.values.map((item) => ({
                datetime: item.datetime,
                upper_band: parseFloat(item.upper_band),
                middle_band: parseFloat(item.middle_band),
                lower_band: parseFloat(item.lower_band)
            }));
        }
        else {
            throw new Error(`API Error: ${response.data.message}`);
        }
    }
    static async getOBV(ticker) {
        const baseURL = "https://api.twelvedata.com/obv";
        const params = {
            symbol: ticker,
            interval: "1day",
            apikey: this.getAPIKey()
        };
        const response = await axios.get(baseURL, { params });
        if (response.status === 200 && response.data.status === "ok") {
            return response.data.values.map((item) => ({
                datetime: item.datetime,
                obv: parseFloat(item.obv)
            }));
        }
        else {
            throw new Error(`API Error: ${response.data.message}`);
        }
    }
    static async getStockPrice(ticker) {
        const url = `https://finance.yahoo.com/quote/${ticker}`;
        try {
            const response = await axios.get(url);
            const html = response.data;
            const $ = cheerio.load(html);
            // Extract the price from the fin-streamer element
            const priceElement = $('fin-streamer[data-field="regularMarketPrice"]');
            const price = priceElement.attr('data-value');
            if (price) {
                return parseFloat(price);
            }
            else {
                throw new Error(`No price found for ticker ${ticker}`);
            }
        }
        catch (error) {
            console.error(`Error fetching stock price for ${ticker}:`, error);
            throw error;
        }
    }
    static getAPIKey() {
        const ret = this.apiKeys[this.currKey];
        if (this.currKey < this.apiKeys.length - 1) {
            this.currKey++;
        }
        else {
            this.currKey = 0;
        }
        return ret;
    }
}
DataRetriever.apiKeys = [
    '64054d02fbb640a5972ec2fb4061bfd8',
    '8e6856af48ce4ea6aebdf9d955cd80e1',
    '6441fada692f4c2baa006b2ca9080b4d',
    '8ce78a0fe62449c6b79fc0fc54dff3dc',
    '2bb245a933f144978a57512e9699008c',
    '38e6a82f685b42e391a5253de6c6d555',
    '6d49d5e74a5a4dd78d48ffeff7057a4b',
    'fffaaf907f1b4a3bb4553e467bde4c8e'
];
DataRetriever.currKey = 0;
export default DataRetriever;
