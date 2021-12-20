import request from '@/utils/request';
const api = {
  getJiaoyuNewsList: 'nine_ifeng/recomlist',
};
export const getJiaoyuNewsList = (data: any): any => {
  let str = '?';
  for (let key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.getJiaoyuNewsList + str,
    method: 'post',
    data: data.formData,
  });
};
