### IFENG

## Install the dependencies

```bash
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
# server
npm run proxy
npm run dev
```

### config

```txt
// settings.json
...
ipconfig/ifconfig 配置代理ip
"proxy_ip": "192.168.61.1", 
"proxy_ip_port": "3000",
...
npm run lint
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
npm run lint
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
