import request from '@/utils/request';
const api = {
  headline: 'nine_ifeng/headline',
  getQualityReadingList: 'nine_ifeng/qualityReadingList',
};
export const getHeadline = (data: any): any =>
  request({
    url: api.headline,
    method: 'get',
    params: data,
  });
export const getQualityReadingList = (data: any): any =>
  request({
    url: `${api.getQualityReadingList}?page=${data.page}`,
    method: 'post',
    data: {
      ltoken: '',
    },
  });
