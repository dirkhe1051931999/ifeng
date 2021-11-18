var axios = require('axios');
const stockname = '恒生指数';
async function parseData(query) {
  let { code, have_news, have_minutely, have_daily, have_weekly, have_monthly, firstLoad, page, stockname } = query;
  var regex = /(?<=\{).*(?=\})/g;
  try {
    let news = [];
    let zhishu;
    let minutely;
    let daily;
    let weekly;
    let monthly;
    let stockname1;
    if (have_minutely === 'true') {
      minutely = await axios.get(`https://ifeng.szfuit.com:883/hkquote/api/minutely.php?code=${code}&mode=dly&_callback=a`, {
        headers: { Host: 'ifeng.szfuit.com:883', Referer: 'https://hk.finance.ifeng.com:81/' },
      });
      minutely = minutely.data;
      minutely = minutely.slice(2, -1);
      minutely = JSON.parse(minutely);
      return [minutely];
    }
    if (have_daily === 'true') {
      daily = await axios.get(`https://ifeng.szfuit.com:883/hkquote/api/daily.php?code=${code}&mode=dly&ma_a=5&ma_b=10&ma_c=20&_callback=a`, {
        headers: { Host: 'ifeng.szfuit.com:883', Referer: 'https://hk.finance.ifeng.com:81/' },
      });

      daily = daily.data;
      daily = daily.slice(2, -1);
      daily = JSON.parse(daily);
      
      return [daily];
    }
    if (have_weekly === 'true') {
      weekly = await axios.get(`https://ifeng.szfuit.com:883/hkquote/api/weekly.php?code=${code}&mode=dly&ma_a=5&ma_b=10&ma_c=20&_callback=a`, {
        headers: { Host: 'ifeng.szfuit.com:883', Referer: 'https://hk.finance.ifeng.com:81/' },
      });
      weekly = weekly.data;
      weekly = weekly.slice(2, -1);
      weekly = JSON.parse(weekly);
      return [weekly];
    }
    if (have_monthly === 'true') {
      monthly = await axios.get(`https://ifeng.szfuit.com:883/hkquote/api/monthly.php?code=${code}&mode=dly&ma_a=5&ma_b=10&ma_c=20&_callback=a`, {
        headers: { Host: 'ifeng.szfuit.com:883', Referer: 'https://hk.finance.ifeng.com:81/' },
      });
      monthly = monthly.data;
      monthly = monthly.slice(2, -1);
      monthly = JSON.parse(monthly);
      return [monthly];
    }
    if (have_news === 'true') {
      news = await axios.get(`https://api.iclient.ifeng.com/client_search_CJ?page=${page}&k=${stockname}&callback=a`);
      news = news.data;
      news = news.slice(2, -1);
      news = JSON.parse(news);
      news = news.data;
      return [news];
    }
    if (firstLoad === 'true') {
      // 指数
      zhishu = await axios.get(`https://ifeng.szfuit.com:883/hkquote/api/query.php?key=${code}_dly&_callback=a`, {
        headers: { Host: 'ifeng.szfuit.com:883', Referer: 'https://hk.finance.ifeng.com:81/' },
      });
      zhishu = zhishu.data;
      zhishu = zhishu.slice(2, -1);
      zhishu = JSON.parse(zhishu);
      zhishu = zhishu[`${code}_dly`];
      // 分时
      minutely = await axios.get(`https://ifeng.szfuit.com:883/hkquote/api/minutely.php?code=${code}&mode=dly&_callback=a`, {
        headers: { Host: 'ifeng.szfuit.com:883', Referer: 'https://hk.finance.ifeng.com:81/' },
      });
      minutely = minutely.data;
      minutely = minutely.slice(2, -1);
      minutely = JSON.parse(minutely);
      // news
      news = await axios.get(`https://api.iclient.ifeng.com/client_search_CJ?page=1&k=%E6%81%92%E7%94%9F%E6%8C%87%E6%95%B0&callback=a`);
      news = news.data;
      news = news.slice(2, -1);
      news = JSON.parse(news);
      news = news.data;
      return [zhishu, minutely, news];
    }
  } catch (error) {
    console.log(error);
    return [];
  }
}
module.exports = parseData;
