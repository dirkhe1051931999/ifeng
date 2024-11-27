module.exports = function init(app) {
  const ifeng_web_kangyi_yimiao_progress = require('../html_parser/kangyi_yimiao_progress/index');
  const ifeng_web_kangyi_area = require('../html_parser/kangyi_area/index');
  const ifeng_web_kangyi_sunmmary = require('../html_parser/kangyi_summary/index');
  const ifeng_web_kangyi_jingwai = require('../html_parser/kangyi_jingwai/index');
  const ifeng_web_kangyi_quanqiu = require('../html_parser/kangyi_quanqiu/index');
  const ifeng_web_kangyi_other_guojia = require('../html_parser/kangyi_other_guojia/index');
  const load_province_json = require('../utils/load_json');
  app.get('/ifeng_web/kangyi/progress', async (req, res) => {
    const result = await ifeng_web_kangyi_yimiao_progress();
    res.send(result);
  });
  app.get('/ifeng_web/area/kangyi', async (req, res) => {
    const result = await ifeng_web_kangyi_area(req.query);
    res.send(result);
  });
  app.get('/load_province_json', async (req, res) => {
    const result = await load_province_json(req.query.name);
    res.send(result);
  });
  app.get('/ifeng_web/kangyi/summary', async (req, res) => {
    const result = await ifeng_web_kangyi_sunmmary();
    res.send(result);
  });
  app.get('/ifeng_web/kangyi/jingwai', async (req, res) => {
    const result = await ifeng_web_kangyi_jingwai();
    res.send(result);
  });
  app.get('/ifeng_web/kangyi/quanqiu', async (req, res) => {
    const result = await ifeng_web_kangyi_quanqiu();
    res.send(result);
  });
  app.get('/ifeng_web/kangyi/other_guojia', async (req, res) => {
    const result = await ifeng_web_kangyi_other_guojia(req.query);
    res.send(result);
  });
};
