import request from '@/utils/request';
const api = {
  getSquarerecommend: 'nine_ifeng/squarerecommend',
  getnNwsSquareColumn: 'nine_ifeng/newsSquareColumn',
};
export const getSquarerecommend = (data: any): any => {
  let str = '?';
  for (let key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.getSquarerecommend + str,
    method: 'post',
  });
};
export const getnNwsSquareColumn = (data: any): any => {
  let str = '?';
  for (let key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.getnNwsSquareColumn + str,
    method: 'post',
  });
};
