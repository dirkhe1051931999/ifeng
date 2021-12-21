module.exports = function init(app) {
  const ifeng_tab_xiaoshuo_index = require('../html_parser/home_tab_xiaoshuo/index');
  // const ifeng_tab_yingshiju_dajurebo = require('../html_parser/home_tab_yingshiju/dajurebo');
  app.get('/ifeng_web/home_tab_xiaoshuo/index', async function (req, res) {
    const result = await ifeng_tab_xiaoshuo_index(req.query);
    res.send(result);
  });
};
