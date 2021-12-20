import request from '@/utils/request';
const api = {
  getMeishiNewsList: 'nine_ifeng/recomlist',
};
export const getMeishiNewsList = (data: any): any => {
  let str = '?';
  for (let key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.getMeishiNewsList + str,
    method: 'post',
    data: data.formData,
  });
};
