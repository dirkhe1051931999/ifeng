import request from '@/utils/request';
const api = {
  getYingshijuList: 'default/ifeng_web/home_tab_yingshiju',
  getYingshijuDajureboList: 'default/ifeng_web/home_tab_yingshiju/dajurebo',
};
export const getYingshijuList = (data: any): any => {
  let str = '?';
  for (let key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.getYingshijuList + str,
    method: 'get',
  });
};
export const getYingshijuDajureboList = (data: any): any => {
  let str = '?';
  for (let key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.getYingshijuDajureboList + str,
    method: 'get',
  });
};
