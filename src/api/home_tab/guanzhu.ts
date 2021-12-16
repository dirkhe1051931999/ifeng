import request from '@/utils/request';
const api = {
  getFollowList: 'nine_ifeng/followList',
};
export const getFollowList = (data: any): any => {
  let str = '?';
  for (let key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.getFollowList + str,
    method: 'post',
    data: data.formData,
  });
};
