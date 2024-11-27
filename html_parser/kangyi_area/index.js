let axios = require('axios');
let cheerio = require('cheerio');
async function parseData(query) {
  let { code, data, areaName, prov } = query;
  try {
    code = code ? code : '029';
    let result = await axios.get(`https://ishare.ifeng.com/c/s/7uGaH6JaA1A?prov=${code}`);
    let result2 = await axios.get(`https://shankapi.ifeng.com/c/api/getAreaContent/${data}/40/a?callback=a`);
    let provNews = result2.data;
    provNews = provNews.slice(2, -1);
    provNews = JSON.parse(provNews);
    let $ = cheerio.load(result.data);
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
    let regex3 = /(?<=\{).*(?=\})/g;
    let one = arr[0].match(regex3);
    let two = arr[1].match(regex3);
    let oneObj = JSON.parse(`{${  one[0]  }}`);
    let twoObj = JSON.parse(`{${  two[0]  }}`);
    return [oneObj, twoObj, provNews.data ? provNews.data : []];
  } catch (error) {
    console.log(error);
    return [];
  }
}
module.exports = parseData;
