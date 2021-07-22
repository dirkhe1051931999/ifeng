import request from '@/utils/request';
const api = {
  getRecomlistForYule: 'nine_ifeng/recomlist',
  getVeryMuchDao: '',
  getUpConstellation: '',
  getPublicScreeningCeremony: '',
};
export const getRecomlistForYule = (data: any): any => {
  let str = '?';
  for (let key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.getRecomlistForYule + str,
    method: 'post',
    data: data.formData,
  });
};
export const getChasingHotSpot = (data: any): any => {
  return request({
    url: `shankapi_ifeng/season/content/ent/chaseHot/${data.page}/a?callback=a`,
    method: 'get',
  });
};
export const getVeryMuchDao = (data: any): any => {
  return request({
    url: `shankapi_ifeng/season/content/ent/hotColumn/entVeryWay/${data.page}/a?callback=a`,
    method: 'get',
  });
};
export const getUpConstellation = (data: any): any => {
  return request({
    url: `shankapi_ifeng/season/content/ent/hotColumn/entConstellation/${data.page}/a?callback=a`,
    method: 'get',
  });
};
export const getPublicScreeningCeremony = (data: any): any => {
  return request({
    url: `shankapi_ifeng/season/content/ent/hotColumn/pubulicGift/${data.page}/a?callback=a`,
    method: 'get',
  });
};
