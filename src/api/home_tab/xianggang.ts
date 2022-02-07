import request from '@/utils/request';
const api = {
  getXianggangNewsList: 'nine_ifeng/recomlist',
};
export const getXianggangNewsList = (data: any): any => {
  let str = '?';
  for (let key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.getXianggangNewsList + str,
    method: 'post',
    data: data.formData,
  });
};

