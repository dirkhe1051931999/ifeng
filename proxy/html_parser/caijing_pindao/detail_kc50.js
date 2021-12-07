var axios = require('axios');
const stockcode = 'sh000688';
const stockname = '科创50';
async function parseData(query) {
  let { have_news, firstLoad, page } = query;
  var regex = /(?<=\{).*(?=\})/g;
  try {
    let news = [];
    let zhishu;
    if (have_news === 'true') {
      news = await axios.get(`https://api.iclient.ifeng.com/client_search_CJ?k=${encodeURI(stockname)}&page=${page}&callback=a`);
      news = news.data;
      news = news.slice(2, -1);
      news = JSON.parse(news);
      news = news.data;
      return [news];
    }
    if (firstLoad === 'true') {
      // 指数
      zhishu = await axios.get(`https://hq.finance.ifeng.com/q.php?l=${stockcode}&f=json`);
      zhishu = zhishu.data;
      zhishu = zhishu.match(regex);
      zhishu = JSON.parse('{' + zhishu[0] + '}');
      zhishu = zhishu[stockcode];
      // news
      news = await axios.get(`https://api.iclient.ifeng.com/client_search_CJ?k=${encodeURI(stockname)}&page=1&callback=a`);
      news = news.data;
      news = news.slice(2, -1);
      news = JSON.parse(news);
      news = news.data;
      return [
        zhishu,
        [
          '//img.ifengimg.com/appnews/astock_d/min/sh000688.gif?0.7800',
          '//img.ifengimg.com/appnews/astock_d/kline/sh000688.gif',
          '//img.ifengimg.com/appnews/astock_d/wkline/sh000688.gif?0.1543',
          '//img.ifengimg.com/appnews/astock_d/mkline/sh000688.gif?0.3676',
        ],
        news,
      ];
    }
  } catch (error) {
    console.log(error);
    return [];
  }
}
module.exports = parseData;
