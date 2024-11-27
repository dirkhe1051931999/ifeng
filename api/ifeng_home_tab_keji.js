module.exports = function init(app) {
  const ifeng_tab_keji_rebang = require('../html_parser/home_tab_keji/rebang');
  app.get('/ifeng_web/home_tab_keji', async (req, res) => {
    const result = await ifeng_tab_keji_rebang(req.query);
    res.send(result);
  });
};
