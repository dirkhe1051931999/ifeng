var axios = require('axios');
var cheerio = require('cheerio');
async function parseData(query) {
  let { id } = query;
  try {
    let result;
    result = id
      ? await axios.get(`https://shankapi.ifeng.com/season/finance/studio/getFinanceMoreShareNewsId/${id}/a?callback=a`)
      : await axios.get(`https://shankapi.ifeng.com/season/finance/studio/getFinanceShareNewsId/a?callback=a`);
    result = result.data;
    result = result.slice(2, -1);
    result = JSON.parse(result);
    return [result.data ? result.data : []];
  } catch (error) {
    console.log(error);
    return [];
  }
}
module.exports = parseData;
