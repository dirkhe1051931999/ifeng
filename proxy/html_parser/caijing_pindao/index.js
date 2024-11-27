let axios = require('axios');
async function parseData(query) {
  let regex = /(?<=\{).*(?=\})/g;
  try {
    // 行情
    let hq = await axios.get(`https://hq.finance.ifeng.com/q.php?l=sh000001,sz399001,sz399006,sh000016,sh000300,sh000688&f=json`);
    hq = hq.data;
    hq = hq.match(regex);
    hq = JSON.parse(`{${  hq[0]  }}`);
    // 恒生指数
    let hengsheng = await axios.get(`https://api.iclient.ifeng.com/hkStockMarke?callback=a`);
    hengsheng = hengsheng.data;
    hengsheng = hengsheng.slice(2, -1);
    hengsheng = JSON.parse(hengsheng);
    hq['hk0000100'] = [
      hengsheng['hk0000100_dly'].last,
      hengsheng['hk0000100_dly'].hst_close,
      hengsheng['hk0000100_dly'].chg,
      hengsheng['hk0000100_dly'].chg_pct,
    ];
    // 板块
    let board = await axios.get(`https://apiapp.finance.ifeng.com/hotcate?callback=a`);
    board = board.data;
    board = board.slice(2, -1);
    board = JSON.parse(board);
    // 科创板
    let kcb = await axios.get(`https://apiapp.finance.ifeng.com/getstockrank/kcb?order=desc&page=1&pagesize=5&callback=a`);
    kcb = kcb.data;
    kcb = kcb.slice(2, -1);
    kcb = JSON.parse(kcb);
    // 涨幅榜与跌幅榜
    let zfb_dfb = await axios.get(`https://apiapp.finance.ifeng.com/getstockrank?callback=a`);
    zfb_dfb = zfb_dfb.data;
    return [hq, board, kcb, zfb_dfb];
  } catch (error) {
    console.log(error);
    return [];
  }
}
module.exports = parseData;
