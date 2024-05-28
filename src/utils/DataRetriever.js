const axios = require('axios');
const cheerio = require('cheerio');

async function getZacksRank(ticker) {
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
    } catch (error) {
        throw new Error(`Error fetching Zacks Rank for ${ticker}!`);
    }
}


async function getPriceTargets(ticker) {
    try {
        const response = await axios.get('https://finance.yahoo.com/quote/' + ticker);
        const html = response.data;
        const $ = cheerio.load(html);

        const priceTargets = {};

        const low = $('.lowLabel .price').text().trim();
        const average = $('.average .price').text().trim();
        const current = $('.current .price').text().trim();
        const high = $('.highLabel .price').text().trim();

        priceTargets.low = parseFloat(low);
        priceTargets.average = parseFloat(average);
        priceTargets.current = parseFloat(current);
        priceTargets.high = parseFloat(high);

        return priceTargets;
    } catch (error) {
        console.error(`Error fetching price targets for ${ticker}:`, error);
        throw new Error(`Error fetching price targets for ${ticker}!`);
    }
}


async function getSMA(ticker, time){
    const baseURL = 'https://api.twelvedata.com/sma';
    const params = {
        symbol: ticker,
        interval: '1day',
        apikey: '64054d02fbb640a5972ec2fb4061bfd8',
        outputsize: 10,
        time_period: time
    };


    const response = await axios.get(baseURL, { params });

    if (response.status === 200 && response.data.status === "ok") {
        return response.data.values.map(item => ({
            datetime: item.datetime,
            sma: parseFloat(item.sma)
        }));
    } else {
        throw new Error(`API Error: ${response.data.message}`);
    }
}


async function getEMA(ticker, time){
    const baseURL = 'https://api.twelvedata.com/ema';
    const params = {
        symbol: ticker,
        interval: '1day',
        apikey: '8e6856af48ce4ea6aebdf9d955cd80e1',
        outputsize: 10,
        time_period: time
    };


    const response = await axios.get(baseURL, { params });

    if (response.status === 200 && response.data.status === "ok") {
        return response.data.values.map(item => ({
            datetime: item.datetime,
            ema: parseFloat(item.ema)
        }));
    } else {
        throw new Error(`API Error: ${response.data.message}`);
    }
}

async function getRSI(ticker){
    const baseURL = 'https://api.twelvedata.com/rsi';
    const params = {
        symbol: ticker,
        interval: '1day',
        apikey: '6441fada692f4c2baa006b2ca9080b4d'
    };


    const response = await axios.get(baseURL, { params });

    if (response.status === 200 && response.data.status === "ok") {
        return response.data.values.map(item => ({
            datetime: item.datetime,
            rsi: parseFloat(item.rsi)
        }));
    } else {
        throw new Error(`API Error: ${response.data.message}`);
    }
}


async function getMACD(ticker){
    const baseURL = 'https://api.twelvedata.com/macd';
    const params = {
        symbol: ticker,
        interval: '1day',
        apikey: '8ce78a0fe62449c6b79fc0fc54dff3dc'
    };


    const response = await axios.get(baseURL, { params });

    if (response.status === 200 && response.data.status === "ok") {
        return response.data.values.map(item => ({
            datetime: item.datetime,
            macd: parseFloat(item.macd),
            macd_signal: parseFloat(item.macd_signal),
            macd_hist: parseFloat(item.macd_hist)
        }));
    } else {
        throw new Error(`API Error: ${response.data.message}`);
    }
}


async function getBBands(ticker) {
    const baseURL = "https://api.twelvedata.com/bbands";
    const params = {
        symbol: ticker,
        interval: "1day",
        apikey: "2bb245a933f144978a57512e9699008c"
    };

    const response = await axios.get(baseURL, { params });
    if (response.status === 200 && response.data.status === "ok") {
        return response.data.values.map(item => ({
            datetime: item.datetime,
            upper_band: parseFloat(item.upper_band),
            middle_band: parseFloat(item.middle_band),
            lower_band: parseFloat(item.lower_band)
        }));
    } else {
        throw new Error(`API Error: ${response.data.message}`);
    }
}


async function getOBV(ticker) {
    const baseURL = "https://api.twelvedata.com/obv";
    const params = {
        symbol: ticker,
        interval: "1day",
        apikey: "38e6a82f685b42e391a5253de6c6d555"
    };

    const response = await axios.get(baseURL, { params });
    if (response.status === 200 && response.data.status === "ok") {
        return response.data.values.map(item => ({
            datetime: item.datetime,
            obv: parseFloat(item.obv)
        }));
    } else {
        throw new Error(`API Error: ${response.data.message}`);
    }
}

async function getStockPrice(ticker) {
    const apiKey = 'LtTzlKlTZb931YisiggYFCWv2mJbJmAi';
    const url = `https://financialmodelingprep.com/api/v3/quote-short/${ticker}?apikey=${apiKey}`;

    try {
        const response = await axios.get(url);
        if (response.data && response.data.length > 0) {
            const stockData = response.data[0];
            return stockData.price;
        } else {
            throw new Error(`No data found for ticker ${ticker}`);
        }
    } catch (error) {
        console.error(`Error fetching stock price for ${ticker}:`, error);
        throw error;
    }
}

module.exports = {getZacksRank, getPriceTargets, getSMA, getEMA, getRSI, getMACD, getBBands, getOBV, getStockPrice};