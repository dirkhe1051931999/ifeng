import request from '@/utils/request';
const api = {
  getFojiaoNewsList: 'nine_ifeng/recomlist',
};
export const getFojiaoNewsList = (data: any): any => {
  let str = '?';
  for (let key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.getFojiaoNewsList + str,
    method: 'post',
    data: data.formData,
  });
};
