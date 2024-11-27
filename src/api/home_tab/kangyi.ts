import request from '@/utils/request';
const api = {
  getEditlistFeiyan: 'nine_ifeng/editlist',
  getVaccinationProgress: 'default/ifeng_web/kangyi/progress',
  getAreaYiqing: 'default/ifeng_web/area/kangyi',
  getKangyiSummary: 'default/ifeng_web/kangyi/summary',
  getKangyiJingwai: '/default/ifeng_web/kangyi/jingwai',
  getKangyiQuanqiu: '/default/ifeng_web/kangyi/quanqiu',
  getKangyiOtherGuojia: 'default/ifeng_web/kangyi/other_guojia',
  loadProvinceJson: 'default/load_province_json',
};
export const getEditlistFeiyan = (data: any): any => {
  let str = '?';
  for (const key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.getEditlistFeiyan + str,
    method: 'post',
    data: data.formData,
  });
};
export const getVaccinationProgress = (data: any): any => {
  let str = '?';
  for (const key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.getVaccinationProgress + str,
    method: 'get',
  });
};
export const getAreaYiqing = (data: any): any => {
  let str = '?';
  for (const key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.getAreaYiqing + str,
    method: 'get',
  });
};
export const loadProvinceJson = (data: any): any => {
  let str = '?';
  for (const key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.loadProvinceJson + str,
    method: 'get',
  });
};
export const getKangyiSummary = (data: any): any => {
  let str = '?';
  for (const key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.getKangyiSummary + str,
    method: 'get',
  });
};
export const getKangyiJingwai = (data: any): any => {
  let str = '?';
  for (const key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.getKangyiJingwai + str,
    method: 'get',
  });
};
export const getKangyiQuanqiu = (data: any): any => {
  let str = '?';
  for (const key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.getKangyiQuanqiu + str,
    method: 'get',
  });
};
export const getKangyiOtherGuojia = (data: any): any => {
  let str = '?';
  for (const key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.getKangyiOtherGuojia + str,
    method: 'get',
  });
};
