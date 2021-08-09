module.exports = function init(app) {
  const ifeng_web_caijing_zhiboshi1 = require('../html_parser/caijing_zhiboshi/index1');
  const ifeng_web_caijing_zhiboshi2 = require('../html_parser/caijing_zhiboshi/index2');
  app.get('/ifeng_web/caijing/zhiboshi1', async function(req, res) {
    const result = await ifeng_web_caijing_zhiboshi1(req.query);
    res.send(result);
  });
  app.get('/ifeng_web/caijing/zhiboshi2', async function(req, res) {
    const result = await ifeng_web_caijing_zhiboshi2(req.query);
    res.send(result);
  });
};
