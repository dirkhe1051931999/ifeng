import request from '@/utils/request';
const api = {
  getTaiwanNewsList: 'nine_ifeng/recomlist',
};
export const getTaiwanNewsList = (data: any): any => {
  let str = '?';
  for (let key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.getTaiwanNewsList + str,
    method: 'post',
    data: data.formData,
  });
};
