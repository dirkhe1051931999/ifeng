var axios = require('axios');
var cheerio = require('cheerio');
async function parseData(query) {
  try {
    let result1 = await axios.get(`https://ishare.ifeng.com/hotTechRank?aman=733w574v562M142d768`);
    // banner data
    var $ = cheerio.load(result1.data);
    let dataStr = '';
    $('script').map((i, el) => {
      if (el.children[0]) {
        if (el.children[0].type === 'text') {
          if (el.children[0].data.indexOf('var allData =') !== -1) {
            dataStr = el.children[0].data;
          }
        }
      }
    });
    const arr = dataStr.split(';');
    var regex3 = /(?<=\{).*(?=\})/g;
    var one = arr[0].match(regex3);
    var oneObj = JSON.parse('{' + one[0] + '}');
    return [oneObj];
  } catch (error) {
    console.log(error);
    return [];
  }
}
module.exports = parseData;
