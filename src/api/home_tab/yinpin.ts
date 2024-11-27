import request from '@/utils/request';
const api = {
  getRecomlistForYinpin: 'ximalaya_ifeng/audio/index',
  getGuesslikeRefreshForYinpin: 'ximalaya_ifeng/audio/guesslike',
  getDirectory: 'ximalaya_ifeng/album',
  getCate: 'ximalaya_ifeng/cate',
  getCateAlbums: 'ximalaya_ifeng/cate/albums',
};
export const getRecomlistForYinpin = (data: any): any => {
  let str = '?';
  for (const key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.getRecomlistForYinpin + str,
    method: 'get',
  });
};
export const getGuesslikeRefreshForYinpin = (data: any): any => {
  let str = '?';
  for (const key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.getGuesslikeRefreshForYinpin + str,
    method: 'get',
  });
};
export const getDirectory = (data: any): any => {
  let str = '?';
  for (const key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.getDirectory + str,
    method: 'get',
  });
};
export const getCate = (data: any): any => {
  let str = '?';
  for (const key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.getCate + str,
    method: 'post',
    data: data.formData,
  });
};
export const getCateAlbums = (data: any): any => {
  let str = '?';
  for (const key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.getCateAlbums + str,
    method: 'post',
    data: data.formData,
  });
};
