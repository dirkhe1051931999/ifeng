const express = require('express');
const randomUseragent = require('random-useragent');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
app.use(cors());
require('web-streams-polyfill');
require('./api/ifeng_home_tab_kangyi')(app); // 抗疫
require('./api/ifeng_home_tab_caijing')(app); // 财经
require('./api/ifeng_home_tab_yingshiju')(app); // 影视剧
require('./api/ifeng_home_tab_keji')(app); // 科技
require('./api/ifeng_home_tab_xiaoshuo')(app); // 小说
// https://nine.ifeng.com
app.use('/', createProxyMiddleware({
  router: {
    // /config=》host:https://config.nine.ifeng.com
    // 需要pathRewrite
    '/config': 'https://config.nine.ifeng.com',
    '/uc': 'https://uc.ifeng.com',
    '/api_iclient': 'https://api.iclient.ifeng.com',
    '/shankapi': 'https://shankapi.ifeng.com',
    '/comment_ifeng': 'https://comment.ifeng.com',
    '/ximalaya_ifeng': 'https://ximalaya.ifeng.com',
    '/xiaoshuo_ifeng': 'https://xw.yc.ifeng.com',
    '/user_ifeng': 'https://user.iclient.ifeng.com',
    '/id_ifeng': 'https://id.ifeng.com',
    '/group_ifeng': 'https://api-group.ifeng.com',
    '/external_ifeng': 'https://external-gateway.ifengidc.com',
    '/commoncomment_ifeng': 'https://ifengcommoncomment.ifeng.com',
  }, target: 'https://nine.ifeng.com', onProxyReq(proxyReq, req, res) {
    proxyReq.setHeader('User-Agent', randomUseragent.getRandom());
  }, pathRewrite: {
    '^/config': '',
    '^/uc': '',
    '^/api_iclient': '',
    '^/shankapi': '',
    '^/comment_ifeng': '',
    '^/ximalaya_ifeng': '',
    '^/xiaoshuo_ifeng': '',
    '^/user_ifeng': '',
    '^/id_ifeng': '',
    '^/group_ifeng': '',
    '^/external_ifeng': '',
    '^/commoncomment_ifeng': '',
  }, onError(err, req, res, target) {
  }, onClose(res, socket, head) {
  }, onProxyRes: function(proxyRes, req, res) {
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
    proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
  }, changeOrigin: true,
}));
app.listen(3000, () => {
  console.log(`server is running on port ${3000}`);
});