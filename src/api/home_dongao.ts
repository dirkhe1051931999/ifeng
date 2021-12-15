import request from '@/utils/request';
const api = {
  getDongaoNewsList: 'nine_ifeng/recomlist',
};
export const getDongaoNewsList = (data: any): any => {
  let str = '?';
  for (let key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.getDongaoNewsList + str,
    method: 'post',
    data: data.formData,
  });
};
