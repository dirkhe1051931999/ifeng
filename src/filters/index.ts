import { AppModule } from './../store/modules/app';
import { date } from 'quasar';
// 2021/07/01 13:50:11 =>YYYY-MM-DD HH:mm
export function parseTimeFromDateString(str: string) {
  const timestamp = +new Date(str);
  let formattedString = date.formatDate(timestamp, 'YYYY-MM-DD HH:mm');
  return formattedString;
}
// 秒转成分：秒
export function getVideoTotalTime(num: number) {
  console.log(num)
  if (num <= 60) {
    return `${num} s`;
  } else {
    let m = Math.floor((num / 60) % 60);
    let s = Math.floor(num % 60);
    let _m = m < 10 ? '0' + m : m;
    let _s = s < 10 ? '0' + s : s;
    return `${_m}:${_s}`;
  }
}
export function getDateDiff(str: string) {
  let minute = 1000 * 60;
  let hour = minute * 60;
  let day = hour * 24;
  let halfamonth = day * 15;
  let dateTimeStamp = +new Date(str);
  let month = day * 30;
  let now = new Date().getTime();
  let diffValue = now - dateTimeStamp;
  if (diffValue < 0) {
    return;
  }
  let monthC = diffValue / month;
  let weekC = diffValue / (7 * day);
  let dayC = diffValue / day;
  let hourC = diffValue / hour;
  let minC = diffValue / minute;
  let result = '';
  if (monthC >= 1) {
    result = '' + Math.floor(monthC) + ' 月前';
  } else if (weekC >= 1) {
    result = '' + Math.floor(weekC) + ' 周前';
  } else if (dayC >= 1) {
    result = '' + Math.floor(dayC) + ' 天前';
  } else if (hourC >= 1) {
    result = '' + Math.floor(hourC) + ' 小时前';
  } else if (minC >= 1) {
    result = '' + Math.floor(minC) + ' 分钟前';
  } else result = '刚刚';
  return result;
}
export const numberFormat = (value: number) => {
  let param: any = {};
  let k = 10000,
    sizes = ['', '万', '亿', '万亿'],
    i;
  if (value < k) {
    param.value = value;
    param.unit = '';
  } else {
    i = Math.floor(Math.log(value) / Math.log(k));
    param.value = (value / Math.pow(k, i)).toFixed(2);
    param.unit = sizes[i];
  }
  return `${param.value} ${param.unit}`;
};
