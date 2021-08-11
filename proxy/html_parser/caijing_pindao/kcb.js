var axios = require('axios');
async function parseData(query) {
  let { page, sort } = query;
  try {
    // 科创板
    let kcb = await axios.get(`https://apiapp.finance.ifeng.com/getstockrank/kcb?type=wx&order=${sort || 'desc'}&page=${page || 1}&callback=a`);
    kcb = kcb.data;
    kcb = kcb.slice(2, -1);
    kcb = JSON.parse(kcb);
    return [kcb];
  } catch (error) {
    console.log(error);
    return [];
  }
}
module.exports = parseData;
