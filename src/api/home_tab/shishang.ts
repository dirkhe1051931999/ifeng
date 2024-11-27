import request from '@/utils/request';
const api = {
  getShishangNewsList: 'nine_ifeng/recomlist',
};
export const getShishangNewsList = (data: any): any => {
  let str = '?';
  for (const key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.getShishangNewsList + str,
    method: 'post',
    data: data.formData,
  });
};
