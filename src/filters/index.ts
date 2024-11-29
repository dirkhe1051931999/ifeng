import { date } from 'quasar';

// 时间处理 --------------------- start
const formatTimestamp = (timestamp: number, formatStr: string): string => {
  try {
    return date.formatDate(+new Date(timestamp), formatStr);
  } catch (error) {
    console.error('日期格式化错误:', error);
    return '';
  }
};
const getTimestamp = (str: string): number => {
  if (!str) return 0;

  if (str.includes('-') || str.includes('/')) {
    return new Date(str).getTime();
  }

  const num = Number(str);
  // 处理10位时间戳
  if (String(num).length === 10) {
    return num * 1000;
  }
  // 处理13位时间戳
  if (String(num).length === 13) {
    return num;
  }

  return 0;
};

export const formatDate = (value: string, formatStr = 'YYYY-MM-DD'): string => {
  if (!value) return '';
  const timestamp = getTimestamp(value);
  return formatTimestamp(timestamp, formatStr);
};

export const dateOnly = (value: string): string => {
  if (!value) return '';
  const timestamp = getTimestamp(value);
  return formatTimestamp(timestamp, 'YYYY-MM-DD');
};

export const timeOnly = (value: string): string => {
  if (!value) return '';
  const timestamp = getTimestamp(value);
  return formatTimestamp(timestamp, 'HH:MM');
};

export const fullDateTime = (value: string): string => {
  if (!value) return '';
  const timestamp = getTimestamp(value);
  return formatTimestamp(timestamp, 'YYYY-MM-DD HH:mm:ss');
};

export const relativeTime = (value: string): string => {
  if (!value) return '';
  const timestamp = getTimestamp(value);
  const now = Date.now();
  const diff = now - timestamp;

  // 刚刚: 小于1分钟
  if (diff < 60000) return '刚刚';

  // 分钟: 小于1小时
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`;

  // 小时: 小于1天
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`;

  // 天: 小于1周
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}天前`;

  // 周: 小于1个月
  if (diff < 2592000000) return `${Math.floor(diff / 604800000)}周前`;

  // 月: 小于1年
  if (diff < 31536000000) return `${Math.floor(diff / 2592000000)}个月前`;

  // 年: 小于2年
  if (diff < 63072000000) return `${Math.floor(diff / 31536000000)}年前`;

  // 超过2年显示具体日期
  return formatTimestamp(timestamp, 'YYYY-MM-DD HH:mm:ss');
};

export function getVideoTotalTime(seconds: number): string {
  // 处理小于60秒的情况
  if (seconds <= 60) {
    return `${seconds} s`;
  }
  // 计算小时、分钟、秒
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  // 格式化数字为两位数
  const formatNumber = (num: number): string => (num > 0 ? (num < 10 ? `0${num}` : String(num)) : '');
  // 构建结果数组并过滤空值
  const result = [formatNumber(remainingSeconds), formatNumber(minutes), formatNumber(hours)].filter(Boolean);
  // 反转数组并用冒号连接
  return result.reverse().join(':');
}

export function numberFormat(value: number): string {
  const units = ['', '万', '亿', '万亿'];
  const base = 10000;
  // 处理小于基数的情况
  if (value < base) {
    return `${value} `;
  }
  // 计算单位索引
  const unitIndex = Math.floor(Math.log(value) / Math.log(base));
  // 计算格式化后的值
  const formattedValue = (value / Math.pow(base, unitIndex)).toFixed(2);
  return `${formattedValue} ${units[unitIndex]}`;
}

// 时间处理 --------------------- end