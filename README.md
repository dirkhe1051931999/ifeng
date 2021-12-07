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

### 架构

[![ocJsnP.png](https://s4.ax1x.com/2021/12/07/ocJsnP.png)](https://imgtu.com/i/ocJsnP)

### Config

```txt
// settings.json
配置代理ip和端口
...
"proxy_ip": "192.168.3.240",
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
      '/comment_list': 'https://comment.ifeng.com',
    },
    target: 'https://nine.ifeng.com',
    onProxyReq(proxyReq, req, res) {
      proxyReq.setHeader('User-Agent', randomUseragent.getRandom());
    },
    pathRewrite: { '^/config': '', '^/uc': '', '^/api_iclient': '', '^/shankapi': '', '^/comment_list': '' },
    onError(err, req, res, target) {},
    onClose(res, socket, head) {},
    changeOrigin: true,
  }),
);
```

### Proxy 代理层

```
proxy 文件夹是为了代理接口用的
proxy/api 是路由文件
proxy/html_parser 是转发jsonp/html页面/第三方接口，重新整理了响应体的格式，方便前端调用
proxy/public 是静态文件，比如地图依赖的数据
proxy/utils  是一些公用方法
server.js 是入口文件，做了代理接口
```

### Views 视图层

```
src/pages/app  入口vue，一些公共的css
src/pages/tabs app 底部的 bottomNavItem
src/pages/tabs_home_item 首页头部的左右滑动tab子项
src/pages/webview 一些子页面，在原生app里的体现就像一个webview
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
