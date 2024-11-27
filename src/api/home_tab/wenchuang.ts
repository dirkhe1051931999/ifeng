import request from '@/utils/request';
const api = {
  getWenchuangNewsList: 'nine_ifeng/editmixlist',
  getWenchuangNewsJingxuanList: 'nine_ifeng/editlist',
};
export const getWenchuangNewsList = (data: any): any => {
  let str = '?';
  for (const key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.getWenchuangNewsList + str,
    method: 'post',
    data: data.formData,
  });
};
export const getWenchuangNewsJingxuanList = (data: any): any => {
  let str = '?';
  for (const key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.getWenchuangNewsJingxuanList + str,
    method: 'post',
    data: data.formData,
  });
};
