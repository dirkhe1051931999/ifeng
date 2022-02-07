import request from '@/utils/request';
const api = {
  getQingchunBANGNewsList: 'nine_ifeng/editlist',
};
export const getQingchunBANGNewsList = (data: any): any => {
  let str = '?';
  for (let key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.getQingchunBANGNewsList + str,
    method: 'post',
    data: data.formData,
  });
};

