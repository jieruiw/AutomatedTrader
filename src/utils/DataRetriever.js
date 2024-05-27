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

module.exports = {getZacksRank};