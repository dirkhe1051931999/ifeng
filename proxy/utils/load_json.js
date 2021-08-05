const settings = require('../../src/settings.json');
var axios = require('axios');
async function loadProvinceJson(name) {
  try {
    let result = await axios.get(`http://${settings.proxy_ip}:${settings.proxy_ip_port}/static/province/${name}.json`);
    return result.data;
  } catch (err) {
    console.log(err);
    return {};
  }
}
module.exports = loadProvinceJson;
