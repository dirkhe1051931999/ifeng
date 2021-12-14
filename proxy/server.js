const express = require('express');
const randomUseragent = require('random-useragent');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
const path = require('path');
require('./api/ifeng_web_kangyi')(app); // 抗疫
require('./api/ifeng_web_caijing')(app); // 财经
require('./api/ifeng_home_tab_yingshiju')(app); // 影视剧
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
      '/comment_ifeng': 'https://comment.ifeng.com',
      '/ximalaya_ifeng': 'https://ximalaya.ifeng.com/',
    },
    target: 'https://nine.ifeng.com',
    onProxyReq(proxyReq, req, res) {
      proxyReq.setHeader('User-Agent', randomUseragent.getRandom());
    },
    pathRewrite: { '^/config': '', '^/uc': '', '^/api_iclient': '', '^/shankapi': '', '^/comment_ifeng': '', '^/ximalaya_ifeng': '' },
    onError(err, req, res, target) {},
    onClose(res, socket, head) {},
    changeOrigin: true,
  }),
);
app.listen(3000, () => {
  console.log(`server is running on port ${3000}`);
});
