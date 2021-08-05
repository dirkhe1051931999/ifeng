### IFENG-NEWS-WEB_APP

## Install the dependencies

```bash
yarn
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
# nodejs proxy server
yarn proxy
# FE server
yarn dev
```

### Config

```txt
// settings.json
...
ipconfig/ifconfig 配置代理ip
"proxy_ip": "192.168.61.1",
"proxy_ip_port": "3000",
...
```

```js
// proxy/server.js
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
```

### Build the app for production

```bash
# spa
quasar build
# electron
quasar build -m electron
# pwa
quasar build -m pwa
# capacitor
quasar build -m capacitor -T ios
```

### Customize the configuration

See [Configuring quasar.conf.js](https://quasar.dev/quasar-cli/quasar-conf-js).
