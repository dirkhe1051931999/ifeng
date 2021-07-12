import request from '@/utils/request';
const api = {
  headline: 'nine_ifeng/headline',
};
export const getHeadline = (data: any) =>
  request({
    url: api.headline,
    method: 'get',
    params: data,
  });
