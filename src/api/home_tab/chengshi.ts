import request from '@/utils/request';
const api = {
  getRegionConfig: 'nine_ifeng/getRegionConfig',
  getRegionlist: 'nine_ifeng/regionlist',
  getIndexTips: 'nine_ifeng/indexTips',
};
export const getRegionConfig = (data: any): any => {
  let str = '?';
  for (const key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.getRegionConfig + str,
    method: 'post',
    data: data.formData,
  });
};
export const getRegionlist = (data: any): any => {
  let str = '?';
  for (const key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.getRegionlist + str,
    method: 'post',
    data: data.formData,
  });
};
export const getIndexTips = (data: any): any => {
  let str = '?';
  for (const key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.getIndexTips + str,
    method: 'post',
    data: data.formData,
  });
};
