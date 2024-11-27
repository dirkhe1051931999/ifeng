import request from '@/utils/request';
const api = {
  getNewsDetails: 'nine_ifeng/getNewsDocs',
  apiPhoenixtvDetails: 'nine_ifeng/apiPhoenixtvDetails',
  relatedVideos: 'nine_ifeng/relatedVideos',
};
export const getNewsDetails = (data: any): any => {
  let str = '?';
  for (const key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.getNewsDetails + str,
    method: 'post',
  });
};
export const apiPhoenixtvDetails = (data: any): any => {
  let str = '?';
  for (const key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.apiPhoenixtvDetails + str,
    method: 'post',
  });
};
export const relatedVideos = (data: any): any => {
  let str = '?';
  for (const key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.relatedVideos + str,
    method: 'post',
  });
};
