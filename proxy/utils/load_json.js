let axios = require('axios');
let settings = require('../settings.json');

async function loadProvinceJson(name) {
  try {
    let result = await axios.get(`${settings.s3}/province/${name}.json`);
    return result.data;
  } catch (err) {
    console.log(err);
  }
}

module.exports = loadProvinceJson;