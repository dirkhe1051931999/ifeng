import request from '@/utils/request';
const api = {
  getNuanxinwenNewsList: 'nine_ifeng/editlist',
};
export const getNuanxinwenNewsList = (data: any): any => {
  let str = '?';
  for (const key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.getNuanxinwenNewsList + str,
    method: 'post',
    data: data.formData,
  });
};
