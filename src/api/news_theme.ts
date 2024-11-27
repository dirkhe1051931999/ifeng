import request from '@/utils/request';
const api = {
  hotSpotCrowdV2: 'nine_ifeng/hotSpotCrowdV2',
  hotSpotDetailListV2: 'nine_ifeng/hotSpotDetailListV2',
  soleNewsListV2: 'nine_ifeng/soleNewsListV2',
};
export const hotSpotDetailListV2 = (data: any): any => {
  let str = '?';
  for (const key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.hotSpotDetailListV2 + str,
    method: 'post',
  });
};
export const hotSpotCrowdV2 = (data: any): any => {
  let str = '?';
  for (const key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.hotSpotCrowdV2 + str,
    method: 'post',
  });
};
export const soleNewsListV2 = (data: any): any => {
  let str = '?';
  for (const key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.soleNewsListV2 + str,
    method: 'post',
  });
};
