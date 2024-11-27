### iFeng-News-Web-APP

**【注：仅个人学习，绝不商用】**

仿凤凰新闻客户端 Web APP，基本覆盖凤凰新闻所有页面（视频，音频，地图/定位，小视频，个人中心，用户鉴权），欢迎 star
<br/>
共计 100+接口，80+页面，从 0 开始做 web APP
<br/>
借鉴客户端是`Android`端的，版本是`7.30.3`
<br/>

移动端组件使用了[Vant](https://youzan.github.io/vant/#/zh-CN/quickstart)和[Quasar](http://www.quasarchs.com/)

### 仓库

[Proxy 仓库 >>](https://github.com/dirkhe1051931999/ifeng/tree/proxy)
<br/>
[App 仓库 >>](https://github.com/dirkhe1051931999/ifeng/tree/app)

### 截图

| 短视频                                                                                                  | 首页                                                                                                 |
|------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|
| <img src="https://cn-sy1.rains3.com/ifeng/screenshot/duanshipin.png" alt="短视频" width="300"/>         | <img src="https://cn-sy1.rains3.com/ifeng/screenshot/home.png" alt="首页" width="300"/>              |
| 热门                                                                                                   | 话题                                                                                                 |
| <img src="https://cn-sy1.rains3.com/ifeng/screenshot/hot.png" alt="热门" width="300"/>                 | <img src="https://cn-sy1.rains3.com/ifeng/screenshot/huati.png" alt="话题" width="300"/>             |
| 抗疫                                                                                                   | 视频详情                                                                                               |
| <img src="https://cn-sy1.rains3.com/ifeng/screenshot/kangyi'.png" alt="抗疫" width="300"/>             | <img src="https://cn-sy1.rains3.com/ifeng/screenshot/shipinxiangqing.png" alt="视频详情" width="300"/> |
| 输入                                                                                                   | 图片详情                                                                                               |
| <img src="https://cn-sy1.rains3.com/ifeng/screenshot/shuru.png" alt="输入" width="300"/>               | <img src="https://cn-sy1.rains3.com/ifeng/screenshot/tupianxiangqing.png" alt="图片详情" width="300"/> |
| 文章详情                                                                                                 | 小说                                                                                                 |
| <img src="https://cn-sy1.rains3.com/ifeng/screenshot/wenzhangxiangqing.png" alt="文章详情" width="300"/> | <img src="https://cn-sy1.rains3.com/ifeng/screenshot/xiaoshuo.png" alt="小说" width="300"/>          |
| 音频                                                                                                   | 音频播放                                                                                               |
| <img src="https://cn-sy1.rains3.com/ifeng/screenshot/yinpin.png" alt="音频" width="300"/>              | <img src="https://cn-sy1.rains3.com/ifeng/screenshot/yinpinbofang.png" alt="音频播放" width="300"/>    |

| 粉丝                                                                                                        | 关注                                                                                                       |
|-----------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------|
| <img src="https://cn-sy1.rains3.com/ifeng/screenshot/个人中心/fensi.png" alt="粉丝" width="300"/>               | <img src="https://cn-sy1.rains3.com/ifeng/screenshot/个人中心/guanzhu.png" alt="关注" width="300"/>            |
| 奖牌                                                                                                        | 积分                                                                                                       |
| <img src="https://cn-sy1.rains3.com/ifeng/screenshot/个人中心/jiangpai.png" alt="奖牌" width="300"/>            | <img src="https://cn-sy1.rains3.com/ifeng/screenshot/个人中心/jifen.png" alt="积分" width="300"/>              |
| 我的                                                                                                        | 个人资料                                                                                                     |
| <img src="https://cn-sy1.rains3.com/ifeng/screenshot/个人中心/mine.png" alt="我的" width="300"/>                | <img src="https://cn-sy1.rains3.com/ifeng/screenshot/个人中心/profile.png" alt="个人资料" width="300"/>          |
| 圈友                                                                                                        | 圈子                                                                                                       |
| <img src="https://cn-sy1.rains3.com/ifeng/screenshot/个人中心/quanyou.png" alt="圈友" width="300"/>             | <img src="https://cn-sy1.rains3.com/ifeng/screenshot/个人中心/quanzi.png" alt="圈子" width="300"/>             |
| 圈子详情                                                                                                      | 收藏                                                                                                       |
| <img src="https://cn-sy1.rains3.com/ifeng/screenshot/个人中心/quanzixiangqing.png" alt="圈子详情" width="300"/>   | <img src="https://cn-sy1.rains3.com/ifeng/screenshot/个人中心/shoucang.png" alt="收藏" width="300"/>           |
| 推送                                                                                                        | 详情评论                                                                                                     |
| <img src="https://cn-sy1.rains3.com/ifeng/screenshot/个人中心/tuisong.png" alt="推送" width="300"/>             | <img src="https://cn-sy1.rains3.com/ifeng/screenshot/个人中心/xiangqingpinglun.png" alt="详情评论" width="300"/> |
| 消息                                                                                                        | 追踪                                                                                                       |
| <img src="https://cn-sy1.rains3.com/ifeng/screenshot/个人中心/xiaoxi.png" alt="消息" width="300"/>              | <img src="https://cn-sy1.rains3.com/ifeng/screenshot/个人中心/zhuizong.png" alt="追踪" width="300"/>           |
| 最终详情                                                                                                      |                                                                                                          |
| <img src="https://cn-sy1.rains3.com/ifeng/screenshot/个人中心/zuizhongxiangqing.png" alt="最终详情" width="300"/> |                                                                                                          |

### [Proxy 仓库 >>](https://github.com/dirkhe1051931999/ifeng/tree/proxy)

```
proxy 文件夹是为了代理接口用的
proxy/api 是路由文件
proxy/html_parser 是转发jsonp/html页面/第三方接口，重新整理了响应体的格式，方便前端调用
proxy/utils  是一些公用方法
server.js 是入口文件，做了代理接口
```

### [App 仓库 >>](https://github.com/dirkhe1051931999/ifeng/tree/app)

```
src/pages/app  入口vue，一些公共的css
src/pages/tabs app 底部的 bottomNavItem
src/pages/home_tab_item 首页头部的左右滑动tab子项
src/pages/webview 一些子页面，在原生app里的体现就像一个webview
```