var axios = require('axios');
const defaultCode = 'sz300033';
async function parseData(query) {
  let { code, onlynews, page, stockname } = query;
  var regex = /(?<=\{).*(?=\})/g;
  try {
    let news;
    let zhishu;
    let stockname;
    let img;
    if (onlynews) {
      // 新闻
      news = await axios.get(
        `https://api.iclient.ifeng.com/client_search_CJ?k=${stockname ? encodeURIComponent(stockname) : encodeURIComponent('同花顺')}&page=${page ||
          1}&callback=a`,
      );
      news = news.data;
      news = news.slice(2, -1);
      news = JSON.parse(news);
      news = news.data;
    } else {
      // 指数
      zhishu = await axios.get(`https://hq.finance.ifeng.com/q.php?l=${code || defaultCode}&f=json`);
      zhishu = zhishu.data;
      zhishu = zhishu.match(regex);
      zhishu = JSON.parse('{' + zhishu[0] + '}');
      // 股票名称
      stockname = await axios.get(`https://apiapp.finance.ifeng.com/getstockname?code=${code || defaultCode}&type=wx&callback=a`);
      stockname = stockname.data;
      stockname = stockname.slice(2, -1);
      stockname = JSON.parse(stockname);
      stockname = stockname[0];
      // 新闻
      news = await axios.get(`https://api.iclient.ifeng.com/client_search_CJ?k=${encodeURIComponent(stockname.name)}&page=1&callback=a`);
      news = news.data;
      news = news.slice(2, -1);
      news = JSON.parse(news);
      news = news.data;
      // 走向
      img = [
        `https://img.ifengimg.com/appnews/astock_d/min/${code || defaultCode}.gif`,
        `https://img.ifengimg.com/appnews/astock_d/kline/${code || defaultCode}.gif`,
        `https://img.ifengimg.com/appnews/astock_d/wkline/${code || defaultCode}.gif`,
        `https://img.ifengimg.com/appnews/astock_d/mkline/${code || defaultCode}.gif`,
      ];
    }
    if (onlynews) {
      return [news];
    } else {
      return [zhishu, stockname, news, img];
    }
  } catch (error) {
    console.log(error);
    return [];
  }
}
module.exports = parseData;
