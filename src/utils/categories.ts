export const defaultCategories = [
  { name: '关注', id: 'guanzhu' },
  { name: '头条', id: 'toutiao' },
  { name: '视频', id: 'shipin' },
  { name: '抗疫', id: 'kangyi' },
  { name: '西安', id: 'chengshi' },
  { name: '财经', id: 'caijing' },
  { name: '娱乐', id: 'yule' },
  { name: '军事', id: 'junshi' },
  { name: '君品谈', id: 'junpintan' },
  { name: '音频', id: 'yinpin' },
  { name: '小视频', id: 'xiaoshipin' },
  // { name: '影视剧', id: 'yingshiju' },
  { name: '新时代', id: 'xinshidai' },
  { name: '舍得人物', id: 'shederenwu' },
  // { name: '东京奥运', id: 'dongjingaoyun' },
  { name: '冬奥', id: 'dongao' },
  { name: '要闻', id: 'yaowen' },
  { name: '文创', id: 'wenchuang' },
  { name: '科技', id: 'keji' },
  { name: '美食', id: 'meishi' },
  { name: '教育', id: 'jiaoyu' },
  { name: 'FUN来了', id: 'FUNlaile' },
  { name: '5G', id: '5G' },
  { name: '推荐', id: 'tuijian' },
  { name: '体育', id: 'tiyu' },
  { name: '历史', id: 'lishi' },
  { name: '小说', id: 'xiaoshuo' },
  { name: '汽车', id: 'qiche' },
  { name: '房产', id: 'fangchan' },
  { name: '台湾', id: 'taiwan' },
  { name: '暖新闻', id: 'nuanxinwen' },
  { name: '国际', id: 'guoji' },
  { name: '健康', id: 'jiankang' },
  { name: '时尚', id: 'shishang' },
  { name: '青春BANG', id: 'qingchunBANG' },
  { name: '电商研究院', id: 'dianshangyanjiuyuan' },
  { name: '旅游', id: 'lvyou' },
  { name: '佛教', id: 'fojiao' },
  { name: '原创', id: 'yuanchuang' },
  { name: '炒股大赛', id: 'chaogudasai' },
  { name: '风直播', id: 'fengzhibo' },
  { name: '香港', id: 'xianggang' },
];
export const bakCategories = [
  { name: '航天', id: 'hangtian' },
  { name: '区块链', id: 'qukuailian' },
  { name: '扶贫', id: 'fupin' },
  { name: '热播', id: 'rebo' },
  { name: '精选', id: 'jingxuan' },
  { name: '港股', id: 'ganggu' },
  { name: '音乐', id: 'yinle' },
  { name: '政务', id: 'zhengwu' },
  { name: '数码', id: 'shuma' },
  { name: '文化', id: 'wenhua' },
  { name: '读书', id: 'dushu' },
  { name: '星座', id: 'xingzuo' },
  { name: '评论', id: 'pinglun' },
  { name: '电影', id: 'dianying' },
  { name: '酒业', id: 'jiuye' },
  { name: '品牌主场', id: 'pinpaizhuchang' },
  { name: '国学', id: 'guoxue' },
  { name: '公益', id: 'gongyi' },
  { name: '家居', id: 'jiaju' },
  { name: '智库', id: 'zhiku' },
  { name: '政能量', id: 'zhengnengliang' },
  { name: '科技城', id: 'kejicheng' },
  { name: '加拿大', id: 'jianada' },
  { name: '创新', id: 'chuangxin' },
];
export const allCategories = [...defaultCategories, ...bakCategories];
const _defaultCategoriesNames = [];
for (let item of defaultCategories) {
  _defaultCategoriesNames.push(item.name);
}
export const defaultCategoriesNames = _defaultCategoriesNames;
