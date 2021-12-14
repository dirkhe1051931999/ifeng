var axios = require('axios');
var cheerio = require('cheerio');
async function parseData(query) {
  let { page } = query;
  page = page || 1;
  const cb = 'getHotDramaList';
  try {
    let result = await axios.get(`https://shankapi.ifeng.com/season/getHotDramaList/${page}/20/getHotDramaList?callback=${cb}`);
    // 院线经典
    let dajurebo = result.data;
    dajurebo = dajurebo.slice(cb.length + 1, -1);
    dajurebo = JSON.parse(dajurebo);
    return dajurebo;
  } catch (error) {
    console.log(error);
    return [];
  }
}
module.exports = parseData;
