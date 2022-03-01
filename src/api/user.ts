import request from '@/utils/request';
const api = {
  getUserPlatService: 'user_ifeng/event_protal/list_lite',
};
export const getUserPlatService = (data: any) =>
  request({
    url: api.getUserPlatService,
    method: 'post',
    data,
  });
