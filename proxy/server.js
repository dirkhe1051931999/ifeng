const express = require('express');
const randomUseragent = require('random-useragent');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
const path = require('path');
const ifeng_web_kangyi_yimiao_progress = require('./html_parser/kangyi_yimiao_progress/index');
const ifeng_web_kangyi_area = require('./html_parser/kangyi_area/index');
const ifeng_web_kangyi_sunmmary = require('./html_parser/kangyi_summary/index');
const ifeng_web_kangyi_jingwai = require('./html_parser/kangyi_jingwai/index');
const ifeng_web_kangyi_quanqiu = require('./html_parser/kangyi_quanqiu/index');
const load_province_json = require('./utils/load_json');
// custom api
app.get('/ifeng_web/kangyi/progress', async function(req, res) {
  const result = await ifeng_web_kangyi_yimiao_progress();
  res.send(result);
});
app.get('/ifeng_web/area/kangyi', async function(req, res) {
  const result = await ifeng_web_kangyi_area(req.query);
  res.send(result);
});
app.get('/load_province_json', async function(req, res) {
  const result = await load_province_json(req.query.name);
  res.send(result);
});
app.get('/ifeng_web/kangyi/summary', async function(req, res) {
  const result = await ifeng_web_kangyi_sunmmary();
  res.send(result);
});
app.get('/ifeng_web/kangyi/jingwai', async function(req, res) {
  const result = await ifeng_web_kangyi_jingwai();
  res.send(result);
});
app.get('/ifeng_web/kangyi/quanqiu', async function(req, res) {
  const result = await ifeng_web_kangyi_quanqiu();
  res.send(result);
});
// static file
app.use('/static', express.static(path.join(__dirname, 'public')));
// https://nine.ifeng.com
app.use(
  '/',
  createProxyMiddleware({
    router: {
      // /config=》host:https://config.nine.ifeng.com
      // 需要pathRewrite
      '/config': 'https://config.nine.ifeng.com',
      '/uc': 'https://uc.ifeng.com',
      '/api_iclient': 'https://api.iclient.ifeng.com',
      '/shankapi': 'https://shankapi.ifeng.com',
      '/shankapi': 'https://shankapi.ifeng.com',
      '/comment': 'https://comment.ifeng.com',
    },
    target: 'https://nine.ifeng.com',
    onProxyReq(proxyReq, req, res) {
      proxyReq.setHeader('User-Agent', randomUseragent.getRandom());
    },
    pathRewrite: { '^/config': '', '^/uc': '', '^/api_iclient': '', '^/shankapi': '', '^/comment': '' },
    onError(err, req, res, target) {},
    onClose(res, socket, head) {},
    changeOrigin: true,
  }),
);
app.listen(3000, () => {
  console.log(`server is running on port ${3000}`);
});
