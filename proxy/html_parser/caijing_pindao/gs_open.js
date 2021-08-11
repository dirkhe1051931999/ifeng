var axios = require('axios');
async function parseData(query) {
  try {
    // 大盘开盘与时间
    let dp_time = await axios.get(`https://apiapp.finance.ifeng.com/market?callback=a`);
    dp_time = dp_time.data;
    dp_time = dp_time.slice(2, -1);
    dp_time = JSON.parse(dp_time);
    return [dp_time.data];
  } catch (error) {
    console.log(error);
    return [];
  }
}
module.exports = parseData;
