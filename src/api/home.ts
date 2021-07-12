import request from '@/utils/request';
const api = {
  searchHotwordSroll: 'nine_ifeng/searchHotwordSroll',
};
export const searchHotwordSroll = (data: any) =>
  request({
    url: api.searchHotwordSroll,
    method: 'get',
    params: data,
  });
