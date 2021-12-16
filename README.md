### iFeng-News-Web-APP

仿凤凰新闻客户端 Web APP，基本覆盖凤凰新闻除 token 校验外所有页面（视频，音频，地图/定位，小视频），欢迎 star
<br>
借鉴客户端是`Android`端的，版本是`7.30.3`
<br>
本项目目前只支持本地预览，需要下载到本地，并且修改`src/setting.json`的`proxy_ip`为本机 ip 地址（`ipconfig/ifconfig 查询`），然后安装（`yarn`），开启代理服务器（`yarn proxy`）和前端服务（`yarn dev`）
<br>
移动端组件使用了[Vant](https://youzan.github.io/vant/#/zh-CN/quickstart)和[Quasar](http://www.quasarchs.com/)

### Preview part of the page

[![ozwQ61.png](https://s4.ax1x.com/2021/12/15/ozwQ61.png)](https://imgtu.com/i/ozwQ61)
[![ozwlOx.png](https://s4.ax1x.com/2021/12/15/ozwlOx.png)](https://imgtu.com/i/ozwlOx)
[![ozwKp9.png](https://s4.ax1x.com/2021/12/15/ozwKp9.png)](https://imgtu.com/i/ozwKp9)
[![ozw3m6.png](https://s4.ax1x.com/2021/12/15/ozw3m6.png)](https://imgtu.com/i/ozw3m6)

## Install the dependencies

```bash
yarn
```

### Start the app in development mode

```bash
# nodejs proxy server
yarn proxy
# FE server
yarn dev
```

### Project structure

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

### Proxy

```
proxy 文件夹是为了代理接口用的
proxy/api 是路由文件
proxy/html_parser 是转发jsonp/html页面/第三方接口，重新整理了响应体的格式，方便前端调用
proxy/public 是静态文件，比如地图依赖的数据
proxy/utils  是一些公用方法
server.js 是入口文件，做了代理接口
```

### Views

```
src/pages/app  入口vue，一些公共的css
src/pages/tabs app 底部的 bottomNavItem
src/pages/home_tab_item 首页头部的左右滑动tab子项
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
