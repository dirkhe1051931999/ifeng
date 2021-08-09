var axios = require('axios');
var cheerio = require('cheerio');
async function parseData(query) {
  let { count } = query;
  count = count || 0;
  try {
    let result = await axios.get(`https://shankapi.ifeng.com/season/finance/studio/getSelectedPoolData/240190/${count}/20/ifengnewsh5/a?callback=a`);
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
