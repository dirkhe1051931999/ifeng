let axios = require('axios');
async function parseData(query) {
  let { q } = query;
  try {
    // 搜索
    let serach = await axios.get(`https://apiapp.finance.ifeng.com/suggest?q=${q}&type=wx&callback=a`);
    serach = serach.data;
    serach = serach.slice(2, -1);
    serach = JSON.parse(serach);
    return [serach];
  } catch (error) {
    console.log(error);
    return [];
  }
}
module.exports = parseData;
