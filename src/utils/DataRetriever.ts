import axios from 'axios';
import * as cheerio from 'cheerio';

async function getZacksRank(ticker: string): Promise<number | null> {
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

interface PriceTargets {
    low: number;
    average: number;
    current: number;
    high: number;
}

async function getPriceTargets(ticker: string): Promise<PriceTargets> {
    try {
        const response = await axios.get('https://finance.yahoo.com/quote/' + ticker);
        const html = response.data;
        const $ = cheerio.load(html);

        const low = $('.lowLabel .price').text().trim();
        const average = $('.average .price').text().trim();
        const current = $('.current .price').text().trim();
        const high = $('.highLabel .price').text().trim();

        const priceTargets: PriceTargets = {
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
    } catch (error) {
        console.error(`Error fetching price targets for ${ticker}:`, error);
        throw new Error(`Error fetching price targets for ${ticker}!`);
    }
}


async function getSMA(ticker: string, time: number) {
    const baseURL = 'https://api.twelvedata.com/sma';
    const params = {
        symbol: ticker,
        interval: '1day',
        apikey: '64054d02fbb640a5972ec2fb4061bfd8',
        outputsize: 10,
        time_period: time
    };


    const response = await axios.get(baseURL, {params});

    if (response.status === 200 && response.data.status === "ok") {
        return response.data.values.map((item: { datetime: any; sma: string; }) => ({
            datetime: item.datetime,
            sma: parseFloat(item.sma)
        }));
    } else {
        throw new Error(`API Error: ${response.data.message}`);
    }
}


async function getEMA(ticker: string, time: number) {
    const baseURL = 'https://api.twelvedata.com/ema';
    const params = {
        symbol: ticker,
        interval: '1day',
        apikey: '8e6856af48ce4ea6aebdf9d955cd80e1',
        outputsize: 10,
        time_period: time
    };


    const response = await axios.get(baseURL, {params});

    if (response.status === 200 && response.data.status === "ok") {
        return response.data.values.map((item: { datetime: any; ema: string; }) => ({
            datetime: item.datetime,
            ema: parseFloat(item.ema)
        }));
    } else {
        throw new Error(`API Error: ${response.data.message}`);
    }
}

async function getRSI(ticker: string) {
    const baseURL = 'https://api.twelvedata.com/rsi';
    const params = {
        symbol: ticker,
        interval: '1day',
        apikey: '6441fada692f4c2baa006b2ca9080b4d'
    };


    const response = await axios.get(baseURL, {params});

    if (response.status === 200 && response.data.status === "ok") {
        return response.data.values.map((item: { datetime: any; rsi: string; }) => ({
            datetime: item.datetime,
            rsi: parseFloat(item.rsi)
        }));
    } else {
        throw new Error(`API Error: ${response.data.message}`);
    }
}


async function getMACD(ticker: string) {
    const baseURL = 'https://api.twelvedata.com/macd';
    const params = {
        symbol: ticker,
        interval: '1day',
        apikey: '8ce78a0fe62449c6b79fc0fc54dff3dc'
    };


    const response = await axios.get(baseURL, {params});

    if (response.status === 200 && response.data.status === "ok") {
        return response.data.values.map((item: { datetime: any; macd: string; macd_signal: string; macd_hist: string; }) => ({
            datetime: item.datetime,
            macd: parseFloat(item.macd),
            macd_signal: parseFloat(item.macd_signal),
            macd_hist: parseFloat(item.macd_hist)
        }));
    } else {
        throw new Error(`API Error: ${response.data.message}`);
    }
}


async function getBBands(ticker: string) {
    const baseURL = "https://api.twelvedata.com/bbands";
    const params = {
        symbol: ticker,
        interval: "1day",
        apikey: "2bb245a933f144978a57512e9699008c"
    };

    const response = await axios.get(baseURL, {params});
    if (response.status === 200 && response.data.status === "ok") {
        return response.data.values.map((item: { datetime: any; upper_band: string; middle_band: string; lower_band: string; }) => ({
            datetime: item.datetime,
            upper_band: parseFloat(item.upper_band),
            middle_band: parseFloat(item.middle_band),
            lower_band: parseFloat(item.lower_band)
        }));
    } else {
        throw new Error(`API Error: ${response.data.message}`);
    }
}


async function getOBV(ticker: string) {
    const baseURL = "https://api.twelvedata.com/obv";
    const params = {
        symbol: ticker,
        interval: "1day",
        apikey: "38e6a82f685b42e391a5253de6c6d555"
    };

    const response = await axios.get(baseURL, {params});
    if (response.status === 200 && response.data.status === "ok") {
        return response.data.values.map((item: { datetime: any; obv: string; }) => ({
            datetime: item.datetime,
            obv: parseFloat(item.obv)
        }));
    } else {
        throw new Error(`API Error: ${response.data.message}`);
    }
}

async function getStockPrice(ticker: any) {
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
        } else {
            throw new Error(`No price found for ticker ${ticker}`);
        }
    } catch (error) {
        console.error(`Error fetching stock price for ${ticker}:`, error);
        throw error;
    }
}

export default {getZacksRank, getPriceTargets, getSMA, getEMA, getRSI, getMACD, getBBands, getOBV, getStockPrice};