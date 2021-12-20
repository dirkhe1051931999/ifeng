import request from '@/utils/request';
const api = {
  getG5NewsList: 'nine_ifeng/editmixlist',
};
export const getG5NewsList = (data: any): any => {
  let str = '?';
  for (let key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.getG5NewsList + str,
    method: 'post',
    data: data.formData,
  });
};
