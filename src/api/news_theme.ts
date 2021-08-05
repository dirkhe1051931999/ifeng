import request from '@/utils/request';
const api = {
  getHotSpotDetailListV2: 'nine_ifeng/hotSpotCrowdV2',
};
export const getHotSpotDetailListV2 = (data: any): any => {
  let str = '?';
  for (let key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.getHotSpotDetailListV2 + str,
    method: 'post',
  });
};
