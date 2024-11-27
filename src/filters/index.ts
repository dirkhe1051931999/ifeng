import { AppModule } from './../store/modules/app';
import { date } from 'quasar';
// 2021/07/01 13:50:11 =>YYYY-MM-DD HH:mm
export function parseTimeFromDateString(str: string) {
  let stamp = 0;
  stamp = str.length === 10 ? Number(str) * 1000 : Number(str);
  const timestamp = +new Date(stamp);
  const formattedString = date.formatDate(timestamp, 'YYYY-MM-DD ');
  return formattedString;
}
export function parseTimeFromDateString2(str: string) {
  let stamp = 0;
  stamp = str.length === 10 ? Number(str) * 1000 : Number(str);
  const timestamp = +new Date(stamp);
  const formattedString = date.formatDate(timestamp, 'YYYY-MM-DD');
  return formattedString;
}
export function parseTimeFromDateString3(str: string) {
  let stamp = 0;
  stamp = str.length === 10 ? Number(str) * 1000 : Number(str);
  const timestamp = +new Date(stamp);
  const formattedString = date.formatDate(timestamp, 'HH:mm');
  return formattedString;
}
// 秒转成分：秒
export function getVideoTotalTime(num: number) {
  if (num <= 60) {
    return `${num} s`;
  } else {
    let secondTime = num; // 秒
    let minuteTime = 0; // 分
    let hourTime = 0; // 小时
    if (secondTime > 60) {
      //如果秒数大于60，将秒数转换成整数
      //获取分钟，除以60取整数，得到整数分钟
      minuteTime = Math.floor(secondTime / 60);
      //获取秒数，秒数取佘，得到整数秒数
      secondTime = Math.floor(secondTime % 60);
      //如果分钟大于60，将分钟转换成小时
      if (minuteTime > 60) {
        //获取小时，获取分钟除以60，得到整数小时
        hourTime = Math.floor(minuteTime / 60);
        //获取小时后取佘的分，获取分钟除以60取佘的分
        minuteTime = Math.floor(minuteTime % 60);
      }
    }
    let result: any[] = [];
    result[0] = Math.floor(secondTime) !== 0 ? (Math.floor(secondTime) < 10 ? `0${String(Math.floor(secondTime))}` : Math.floor(secondTime)) : '';
    result[1] = Math.floor(minuteTime) !== 0 ? (Math.floor(minuteTime) < 10 ? `0${String(Math.floor(minuteTime))}` : Math.floor(minuteTime)) : '';
    result[2] = Math.floor(hourTime) !== 0 ? (Math.floor(hourTime) < 10 ? `0${String(Math.floor(hourTime))}` : Math.floor(hourTime)) : '';
    result = result.filter((d) => d);
    return result.join(':');
  }
}
export function getDateDiff(str: string) {
  const minute = 1000 * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const halfamonth = day * 15;
  if (String(str).length === 10) {
    str += '000';
  }
  const dateTimeStamp = +new Date(str);
  const month = day * 30;
  const now = new Date().getTime();
  const diffValue = now - dateTimeStamp;
  if (diffValue < 0) {
    return;
  }
  const monthC = diffValue / month;
  const weekC = diffValue / (7 * day);
  const dayC = diffValue / day;
  const hourC = diffValue / hour;
  const minC = diffValue / minute;
  let result = '';
  if (monthC >= 1) {
    result = `${Math.floor(monthC)} 月前`;
  } else if (weekC >= 1) {
    result = `${Math.floor(weekC)} 周前`;
  } else if (dayC >= 1) {
    result = `${Math.floor(dayC)} 天前`;
  } else if (hourC >= 1) {
    result = `${Math.floor(hourC)} 小时前`;
  } else if (minC >= 1) {
    result = `${Math.floor(minC)} 分钟前`;
  } else result = '刚刚';
  return result;
}
export const numberFormat = (value: number) => {
  const param: any = {};
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
