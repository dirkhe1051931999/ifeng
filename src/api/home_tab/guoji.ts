import request from '@/utils/request';
const api = {
  getGuojiNewsList: 'nine_ifeng/recomlist',
};
export const getGuojiNewsList = (data: any): any => {
  let str = '?';
  for (const key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.getGuojiNewsList + str,
    method: 'post',
    data: data.formData,
  });
};
