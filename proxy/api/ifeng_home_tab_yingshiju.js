module.exports = function init(app) {
  const ifeng_tab_yingshiju = require('../html_parser/home_tab_yingshiju/index');
  const ifeng_tab_yingshiju_dajurebo = require('../html_parser/home_tab_yingshiju/dajurebo');
  app.get('/ifeng_web/home_tab_yingshiju', async (req, res) => {
    const result = await ifeng_tab_yingshiju(req.query);
    res.send(result);
  });
  app.get('/ifeng_web/home_tab_yingshiju/dajurebo', async (req, res) => {
    const result = await ifeng_tab_yingshiju_dajurebo(req.query);
    res.send(result);
  });
};
