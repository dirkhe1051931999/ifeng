import settings from '../settings.json';
import axios from 'axios';
const isPro = process.env.NODE_ENV === 'production';
const commonUrlParams = {
  gv: '7.30.3',
  av: '7.30.3',
  uid: '867241265475337',
  deviceid: '867241265475337',
  proid: 'ifengnews',
  os: 'android_25',
  df: 'androidphone',
  vt: '5',
  screen: '720x1280',
  publishid: '6010',
  nw: 'wifi',
  loginid: '',
  adAid: '',
  hw: 'oppo_pcrt00',
  ps: '1',
  st: '16395595277916',
  sn: 'fcb480832205d27372f8e66d260e69d8',
};

axios.defaults.timeout = 25000;
// Request interceptors
axios.interceptors.request.use(
  (config: any) => {
    let str = '';
    for (let key in commonUrlParams) {
      str += `${key}=${commonUrlParams[key]}&`;
    }
    if (config.url.indexOf('?') === -1) {
      config.url = config.url + '?' + str;
    } else {
      config.url = config.url + '&' + str;
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
