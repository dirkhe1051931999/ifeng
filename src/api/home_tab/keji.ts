import request from '@/utils/request';
const api = {
  getKejiNewsList: 'nine_ifeng/recomlist',
  getKejiNewsRebangList: 'default/ifeng_web/home_tab_keji',
  getKejiNewsXinshijieList: 'nine_ifeng/editlist',
  getKejiNewsPingceList: 'nine_ifeng/editlist',
  getKejiNewsHuaixiaoxiList: 'nine_ifeng/editlist',
  getKejiNewsYuanchuangList: 'nine_ifeng/editlist',
  getKejiNewsShenduList: 'nine_ifeng/editlist',
};
export const getKejiNewsList = (data: any): any => {
  let str = '?';
  for (let key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.getKejiNewsList + str,
    method: 'post',
    data: data.formData,
  });
};
export const getKejiNewsRebangList = (data: any): any => {
  let str = '?';
  for (let key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.getKejiNewsRebangList + str,
    method: 'get',
  });
};
export const getKejiNewsXinshijieList = (data: any): any => {
  let str = '?';
  for (let key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.getKejiNewsXinshijieList + str,
    method: 'post',
    data: data.formData,
  });
};
export const getKejiNewsPingceList = (data: any): any => {
  let str = '?';
  for (let key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.getKejiNewsPingceList + str,
    method: 'post',
    data: data.formData,
  });
};
export const getKejiNewsHuaixiaoxiList = (data: any): any => {
  let str = '?';
  for (let key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.getKejiNewsHuaixiaoxiList + str,
    method: 'post',
    data: data.formData,
  });
};
export const getKejiNewsYuanchuangList = (data: any): any => {
  let str = '?';
  for (let key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.getKejiNewsYuanchuangList + str,
    method: 'post',
    data: data.formData,
  });
};
export const getKejiNewsShenduList = (data: any): any => {
  let str = '?';
  for (let key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.getKejiNewsShenduList + str,
    method: 'post',
    data: data.formData,
  });
};
