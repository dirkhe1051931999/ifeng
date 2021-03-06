var axios = require('axios');
var cheerio = require('cheerio');
async function parseData() {
  try {
    let result = await axios.get(`https://ishare.ifeng.com/c/s/7tPlDSzDgVk`);
    let result2 = await axios.get(`https://shankapi.ifeng.com/feedflow/coopdoc/wuhanyiqing_data_local_city_detail/info/a?callback=a`);
    result2 = result2.data;
    result2 = result2.slice(2, -1);
    result2 = JSON.parse(result2);
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
    return [oneObj, twoObj, result2.data];
  } catch (error) {
    console.log(error);
    return [];
  }
}
module.exports = parseData;
