import settings from '../settings.json';
import axios from 'axios';
import { UserModule } from '../store/modules/user';
const isPro = process.env.NODE_ENV === 'production';
const notAddUrlParamsWhiteList: any[] = [];
const haveAuthParams: any[] = ['user_ifeng/api_user_userbasic/login'];
const openAPI: any[] = ['nine_ifeng'];
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
    if (UserModule.token && !openAPI.includes(config.url.split('/')[0])) {
      const authConfig = {
        token: UserModule.token,
        guid: UserModule.guid,
        loginid: UserModule.guid,
        username: UserModule.username,
      };
      if (haveAuthParams.includes(config.url)) {
        authConfig['auth'] = UserModule.auth;
      }
      let str = '';
      for (let key in authConfig) {
        str += `${key}=${authConfig[key]}&`;
      }
      if (config.url.indexOf('?') === -1) {
        config.url = config.url + '?' + str;
      } else {
        config.url = config.url + '&' + str;
      }
    }
    if (!notAddUrlParamsWhiteList.includes(config.url)) {
      let str = '';
      for (let key in commonUrlParams) {
        str += `${key}=${commonUrlParams[key]}&`;
      }
      if (config.url.indexOf('?') === -1) {
        config.url = config.url + '?' + str;
      } else {
        config.url = config.url + '&' + str;
      }
    }
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
