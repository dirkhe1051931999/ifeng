var axios = require('axios');
async function parseData(query) {
  let { page, sort } = query;
  try {
    // 涨跌幅榜
    let desc_asc = await axios.get(`https://apiapp.finance.ifeng.com/getstockrank?type=wx&order=${sort || 'desc'}&page=${page || 1}&callback=a`);
    desc_asc = desc_asc.data;
    desc_asc = desc_asc.slice(2, -1);
    desc_asc = JSON.parse(desc_asc);
    return [desc_asc];
  } catch (error) {
    console.log(error);
    return [];
  }
}
module.exports = parseData;
