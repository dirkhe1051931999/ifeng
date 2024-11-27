import request from '@/utils/request';
const api = {
  getYuanchuangNewsList: 'nine_ifeng/editmixlist',
};
export const getYuanchuangNewsList = (data: any): any => {
  let str = '?';
  for (const key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.getYuanchuangNewsList + str,
    method: 'post',
    data: data.formData,
  });
};
