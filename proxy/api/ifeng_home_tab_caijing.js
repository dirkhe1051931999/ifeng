module.exports = function init(app) {
  const ifeng_web_caijing_zhiboshi1 = require('../html_parser/caijing_zhiboshi/index1');
  const ifeng_web_caijing_zhiboshi2 = require('../html_parser/caijing_zhiboshi/index2');
  const ifeng_web_caijing_pindao = require('../html_parser/caijing_pindao/index');
  const ifeng_web_caijing_dapan_shijian = require('../html_parser/caijing_pindao/gs_open');
  const ifeng_web_caijing_kcb = require('../html_parser/caijing_pindao/kcb');
  const ifeng_web_caijing_stock_desc_asc = require('../html_parser/caijing_pindao/desc_asc');
  const ifeng_web_caijing_search = require('../html_parser/caijing_pindao/search');
  const ifeng_web_caijing_detail = require('../html_parser/caijing_pindao/detail');
  const ifeng_web_caijing_detail_ganggu = require('../html_parser/caijing_pindao/detail_ganggu');
  const ifeng_web_caijing_detail_kc50 = require('../html_parser/caijing_pindao/detail_kc50');
  app.get('/ifeng_web/caijing/zhiboshi1', async (req, res) => {
    const result = await ifeng_web_caijing_zhiboshi1(req.query);
    res.send(result);
  });
  app.get('/ifeng_web/caijing/zhiboshi2', async (req, res) => {
    const result = await ifeng_web_caijing_zhiboshi2(req.query);
    res.send(result);
  });
  app.get('/ifeng_web/caijing/pindao', async (req, res) => {
    const result = await ifeng_web_caijing_pindao(req.query);
    res.send(result);
  });
  app.get('/ifeng_web/caijing/shijian', async (req, res) => {
    const result = await ifeng_web_caijing_dapan_shijian();
    res.send(result);
  });
  app.get('/ifeng_web/caijing/kcb', async (req, res) => {
    const result = await ifeng_web_caijing_kcb(req.query);
    res.send(result);
  });
  app.get('/ifeng_web/caijing/stock_desc_asc', async (req, res) => {
    const result = await ifeng_web_caijing_stock_desc_asc(req.query);
    res.send(result);
  });
  app.get('/ifeng_web/caijing/search', async (req, res) => {
    const result = await ifeng_web_caijing_search(req.query);
    res.send(result);
  });
  app.get('/ifeng_web/caijing/detail', async (req, res) => {
    const result = await ifeng_web_caijing_detail(req.query);
    res.send(result);
  });
  app.get('/ifeng_web/caijing/detail_ganggu', async (req, res) => {
    const result = await ifeng_web_caijing_detail_ganggu(req.query);
    res.send(result);
  });
  app.get('/ifeng_web/caijing/detail_kc50', async (req, res) => {
    const result = await ifeng_web_caijing_detail_kc50(req.query);
    res.send(result);
  });
};
