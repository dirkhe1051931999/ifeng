import request from '@/utils/request';
const api = {
  getYaowenNewsList: 'nine_ifeng/recomlist',
};
export const getYaowenNewsList = (data: any): any => {
  let str = '?';
  for (let key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.getYaowenNewsList + str,
    method: 'post',
    data: data.formData,
  });
};
