import request from '@/utils/request';
const api = {
  getQicheNewsList: 'nine_ifeng/regionlist',
};
export const getQicheNewsList = (data: any): any => {
  let str = '?';
  for (let key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.getQicheNewsList + str,
    method: 'post',
    data: data.formData,
  });
};
