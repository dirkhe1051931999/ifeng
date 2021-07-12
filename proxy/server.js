const express = require('express');
const randomUseragent = require('random-useragent');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
// https://nine.ifeng.com
app.use(
  '/',
  createProxyMiddleware({
    router: {
      // /config=》host:https://config.nine.ifeng.com
      // 需要pathRewrite
      '/config': 'https://config.nine.ifeng.com',
    },
    target: 'https://nine.ifeng.com',
    onProxyReq(proxyReq, req, res) {
      proxyReq.setHeader('User-Agent', randomUseragent.getRandom());
    },
    pathRewrite: { '^/config': '' },
    onError(err, req, res, target) {},
    onClose(res, socket, head) {},
    changeOrigin: true,
  }),
);
app.listen(3000, () => {
  console.log(`server is running on port ${3000}`);
});
