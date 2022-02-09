import request from '@/utils/request';
const api = {
  getNewsDetails: 'nine_ifeng/getNewsDocs',
};
export const getNewsDetails = (data: any): any => {
  let str = '?';
  for (let key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.getNewsDetails + str,
    method: 'post',
  });
};
