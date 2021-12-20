import request from '@/utils/request';
const api = {
  getTuijianNewsList: 'nine_ifeng/recomlist',
};
export const getTuijianNewsList = (data: any): any => {
  let str = '?';
  for (let key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.getTuijianNewsList + str,
    method: 'post',
    data: data.formData,
  });
};
