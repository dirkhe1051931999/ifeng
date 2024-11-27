import axios from 'axios';
import { UserModule } from '@/store/modules/user';
import settings from 'src/settings.json';

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
const routeMap = {
  'nine_ifeng/': '',
  'config_nine_ifeng/': 'config/',
  'uc_ifeng/': 'uc/',
  'api_iclient_ifeng/': 'api_iclient/',
  'shankapi_ifeng/': 'shankapi/',
  'comment_ifeng/': 'comment_ifeng/',
  'ximalaya_ifeng/': 'ximalaya_ifeng/',
  'xiaoshuo_ifeng/': 'xiaoshuo_ifeng/',
  'user_ifeng/': 'user_ifeng/',
  'id_ifeng/': 'id_ifeng/',
  'group_ifeng/': 'group_ifeng/',
  'external_ifeng/': 'external_ifeng/',
  'commoncomment_ifeng/': 'commoncomment_ifeng/',
};
// 转换URL的函数
const transformUrl = (url: string, baseUrl: string) => {
  for (const key in routeMap) {
    if (url.indexOf(key) !== -1) {
      return url.replace(key, routeMap[key]);
    }
  }
  return url;
};
const baseUrl = `http://${settings.proxy_ip}:${settings.proxy_ip_port}/`;
axios.defaults.timeout = 25000;
axios.defaults.baseURL = isPro ? baseUrl : `http://127.0.0.1:${settings.proxy_ip_port}/`;
// Request interceptors
axios.interceptors.request.use(
  (config: any) => {
    config.url = transformUrl(config.url, baseUrl);
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
      for (const key in authConfig) {
        str += `${key}=${authConfig[key]}&`;
      }
      if (config.url.indexOf('?') === -1) {
        config.url = `${config.url}?${str}`;
      } else {
        config.url = `${config.url}&${str}`;
      }
    }
    if (!notAddUrlParamsWhiteList.includes(config.url)) {
      let str = '';
      for (const key in commonUrlParams) {
        str += `${key}=${commonUrlParams[key]}&`;
      }
      if (config.url.indexOf('?') === -1) {
        config.url = `${config.url}?${str}`;
      } else {
        config.url = `${config.url}&${str}`;
      }
    }
    return config;
  },
  (error) => {
    console.log(error);
    Promise.reject(error);
  }
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
  }
);

export default axios;