var axios = require('axios');
var cheerio = require('cheerio');
async function parseData(query) {
  const cb = 'getPPVideoStreamCb';
  try {
    let result1 = await axios.get(`https://ent.ifeng.com/forpptv/videolistNews?webkit=1`);
    let result2 = await axios.get(`https://shankapi.ifeng.com/season/getPPVideoStream/300187/1/9/getPPVideoStreamCb?callback=${cb}`);
    let result3 = await axios.get(`https://shankapi.ifeng.com/season/getPPVideoStream/300188/1/9/getPPVideoStreamCb?callback=${cb}`);
    // 院线经典
    let yuanxianjingdian = result2.data;
    yuanxianjingdian = yuanxianjingdian.slice(cb.length + 1, -1);
    yuanxianjingdian = JSON.parse(yuanxianjingdian);
    // 精彩剧集
    let jingcaijuji = result3.data;
    jingcaijuji = jingcaijuji.slice(cb.length + 1, -1);
    jingcaijuji = JSON.parse(jingcaijuji);
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
    return [oneObj, yuanxianjingdian, jingcaijuji];
  } catch (error) {
    console.log(error);
    return [];
  }
}
module.exports = parseData;
