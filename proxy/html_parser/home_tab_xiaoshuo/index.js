var axios = require('axios');
var cheerio = require('cheerio');
async function parseData(query) {
  let { sex, page } = query;
  sex = sex || '1'; // 1 男生 3女生
  try {
    let result = await axios.get(`https://xw.yc.ifeng.com/api/book/store/${sex}?page=${page || ''}`, {
      headers: { Host: 'xw.yc.ifeng.com', Referer: 'https://xw.yc.ifeng.com/', appid: '15183226' },
    });
    return result.data;
  } catch (error) {
    console.log(error);
    return [];
  }
}
module.exports = parseData;
