var axios = require('axios');
var cheerio = require('cheerio');
async function parseData(query) {
  let { code, data } = query;
  try {
    code = code ? code : 'USA';
    let result = await axios.get(`https://ishare.ifeng.com/c/s/7uLyp1412jw?code=${code}`);
    let result2 = await axios.get(`https://shankapi.ifeng.com/c/api/getAreaContent/${data}/40/a?callback=a`);
    let provNews = result2.data;
    provNews = provNews.slice(2, -1);
    provNews = JSON.parse(provNews);
    var $ = cheerio.load(result.data);
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
    var two = arr[1].match(regex3);
    var oneObj = JSON.parse('{' + one[0] + '}');
    var twoObj = JSON.parse('{' + two[0] + '}');
    return [oneObj, twoObj, provNews.data ? provNews.data : []];
  } catch (error) {
    console.log(error);
    return [];
  }
}
module.exports = parseData;
