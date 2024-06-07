import axios from 'axios';
import * as cheerio from 'cheerio';

interface PriceTargets {
    low: number;
    average: number;
    current: number;
    high: number;
}

export default class DataRetriever {

    private static apiKeys: string[] = [
        '64054d02fbb640a5972ec2fb4061bfd8',
        '8e6856af48ce4ea6aebdf9d955cd80e1',
        '6441fada692f4c2baa006b2ca9080b4d',
        '8ce78a0fe62449c6b79fc0fc54dff3dc',
        '2bb245a933f144978a57512e9699008c',
        '38e6a82f685b42e391a5253de6c6d555',
        '6d49d5e74a5a4dd78d48ffeff7057a4b',
        'fffaaf907f1b4a3bb4553e467bde4c8e',
        '2471fc35ed1f48368faf380040597b4e',
        '9a4fa615f93f4850addf8bd762563fa7',
        'f1f90dddd6d045d4bc93af743ca70717',
        'c219df232e5b4075b4b734d4df1173ff',
        'd7083a021a3c4ccda8ce3f21f51547f0',
        '6c4efcc4b9c24acdaa9d29c9252fb863',
        'e51bc806de304bec970deaaf4251ac18',
        'd4f86787d27b4920ba559bb1a5763413',
        '0a9386414b9540e98a430387afc086e8',
        '2793e3e96b7d4c94a87db26b32dadccf',
        'ba3ee44f46324bd3af743866a93ac640',
        'ba7fbb5ee272457daa39dd940496802f',
        '541553528bb34f1d97337c4242777c53',
        '636655e312e943d9903e88ae35e3e438',
        '0c7ca275aaaa4768ad077d1dbcd93117',
        'b5917259767040d2b2e144fb084c19d3',
        '5c928656258c438b82292d7e50156e86',
        '65aadf5d2f974a78ba9c46a2f19eb26c',
        'c601ec756eed414eab7ef7e839940def',
        '284ca96486f648dab2f5eeec3e6fec63',
        'daa171dbd1a64b19b3dcf3b1cad2ae1a',
        'f5cf21e46a0542da88bf92e2d09ad075',
        '25f7408ef2134fd98f99060999667b8f',
        'c716549e268f42b9baa92865e9d60dba',
        '036d7f859eda4677b65933901f6556fe'


    ]

    private static currKey = 0;

    static async getZacksRank(ticker: string): Promise<number | null> {
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



static async getPriceTargets(ticker: string): Promise<PriceTargets> {
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


static async getSMA(ticker: string, time: number) {
    const baseURL = 'https://api.twelvedata.com/sma';
    const params = {
        symbol: ticker,
        interval: '1day',
        apikey: this.getAPIKey(),
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


static async getEMA(ticker: string, time: number) {
    const baseURL = 'https://api.twelvedata.com/ema';
    const params = {
        symbol: ticker,
        interval: '1day',
        apikey: this.getAPIKey(),
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

static async getRSI(ticker: string) {
    const baseURL = 'https://api.twelvedata.com/rsi';
    const params = {
        symbol: ticker,
        interval: '1day',
        apikey: this.getAPIKey()
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


static async getMACD(ticker: string) {
    const baseURL = 'https://api.twelvedata.com/macd';
    const params = {
        symbol: ticker,
        interval: '1day',
        apikey: this.getAPIKey()
    };


    const response = await axios.get(baseURL, {params});

    if (response.status === 200 && response.data.status === "ok") {
        return response.data.values.map((item: {
            datetime: any;
            macd: string;
            macd_signal: string;
            macd_hist: string;
        }) => ({
            datetime: item.datetime,
            macd: parseFloat(item.macd),
            macd_signal: parseFloat(item.macd_signal),
            macd_hist: parseFloat(item.macd_hist)
        }));
    } else {
        throw new Error(`API Error: ${response.data.message}`);
    }
}


static async getBBands(ticker: string) {
    const baseURL = "https://api.twelvedata.com/bbands";
    const params = {
        symbol: ticker,
        interval: "1day",
        apikey: this.getAPIKey()
    };

    const response = await axios.get(baseURL, {params});
    if (response.status === 200 && response.data.status === "ok") {
        return response.data.values.map((item: {
            datetime: any;
            upper_band: string;
            middle_band: string;
            lower_band: string;
        }) => ({
            datetime: item.datetime,
            upper_band: parseFloat(item.upper_band),
            middle_band: parseFloat(item.middle_band),
            lower_band: parseFloat(item.lower_band)
        }));
    } else {
        throw new Error(`API Error: ${response.data.message}`);
    }
}


static async getOBV(ticker: string) {
    const baseURL = "https://api.twelvedata.com/obv";
    const params = {
        symbol: ticker,
        interval: "1day",
        apikey: this.getAPIKey()
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

static async getStockPrice(ticker: string): Promise<number> {
    const baseURL = 'https://api.twelvedata.com/price';
    const params = {
        symbol: ticker,
        apikey: this.getAPIKey()
    };

    const response = await axios.get(baseURL, {params});

    if (response.status === 200) {
        return parseFloat(response.data.price);
    } else {
        throw new Error(`API Error: ${response.data.message}`);
    }
}


    private static getAPIKey(): string {
        const ret: string =  this.apiKeys[this.currKey];
        if (this.currKey < this.apiKeys.length - 1) {
            this.currKey++;
        } else {
            this.currKey = 0;
        }

        return ret;
}


}
