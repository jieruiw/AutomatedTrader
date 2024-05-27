const axios = require('axios');
const cheerio = require('cheerio');

async function getZacksRank(ticker) {
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





module.exports = {getZacksRank, getPriceTargets};