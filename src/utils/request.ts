import settings from '../settings.json';
import axios from 'axios';
const isPro = process.env.NODE_ENV === 'production';
const commonUrlParams = {
  gv: '7.27.0',
  av: '7.27.0',
  uid: '910000000242544',
  deviceid: '910000000242544',
  proid: 'ifengnews',
  os: 'android_23',
  df: 'androidphone',
  vt: '5',
  screen: '576x1024',
  publishid: '6109',
  nw: 'wifi',
  loginid: '4000000089717240455',
  adAid: '',
  hw: 'oneplus_oneplus_a5010',
  ps: '1',
  st: '16257936056610',
  sn: 'f3b45b9d5cf0dcf2b1870609b000b944',
};
axios.defaults.timeout = 25000;
// Request interceptors
axios.interceptors.request.use(
  (config: any) => {
    let str = '';
    for (let key in commonUrlParams) {
      str += `${key}=${commonUrlParams[key]}&`;
    }
    if (config.method === 'get') {
      config.url = config.url + '?' + str;
    } else {
      if (config.url.indexOf('?') === -1) {
        config.url = config.url + '?' + str;
      } else {
        config.url = config.url +'&' + str;
      }
    }

    // if (UserModule.token) {
    //   config.headers['token'] = UserModule.token;
    //   config.headers['accessToken'] = UserModule.token;
    //   config.headers['signature'] = Md5.hashStr(settings.title + Math.random()).toString();
    //   config.data = config.data || {};
    //   config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    // }
    return config;
  },
  (error) => {
    console.log(error);
    Promise.reject(error);
  },
);

// Response interceptors
axios.interceptors.response.use(
  (response) => {
    // const { data, code } = response.data;
    // if (!data || (data && !data.success)) {

    //   return Promise.reject('error');
    // }
    return Promise.resolve(response.data);
  },
  (error: any) => {
    console.info(error);
    return Promise.reject('error');
  },
);

export default axios;
