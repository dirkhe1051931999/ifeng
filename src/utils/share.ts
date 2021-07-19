import { BottomSheet } from 'quasar';

const shareOption = [
  {
    label: '微信',
    img: 'https://img01.yzcdn.cn/vant/share-sheet-wechat.png',
  },
  {
    label: '朋友圈',
    img: 'https://img01.yzcdn.cn/vant/share-sheet-wechat-moments.png',
  },
  {
    label: '微博',
    img: 'https://img01.yzcdn.cn/vant/share-sheet-weibo.png',
  },
  {
    label: 'QQ',
    img: 'https://img01.yzcdn.cn/vant/share-sheet-qq.png',
  },
  {
    label: '复制链接',
    img: 'https://z3.ax1x.com/2021/07/16/WMr0K0.png',
  },
];
export function handlerQuasarShare(from: string, news: any) {
  BottomSheet.create({
    message: '分享是一种快乐',
    grid: true,
    actions: shareOption,
  }).onOk((action: any) => {
    return Promise.resolve(action);
  });
}
