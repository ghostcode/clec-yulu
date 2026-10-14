// 投资语录数据集
// 来源：《理财圣经 CLEC 版 v3.4.1》与《CLEC 宝典 V1.14.2》
// 内容经人工筛选、归类，保留原书表述风格。

export const categories = [
  { key: 'awakening', name: '觉醒', desc: '认知与天命' },
  { key: 'happiness', name: '快乐', desc: '人生的目的' },
  { key: 'vehicle', name: '标的', desc: '买什么' },
  { key: 'discipline', name: '纪律', desc: '买卖的修行' },
  { key: 'risk', name: '风险', desc: '崩盘与杠杆' },
  { key: 'leverage', name: '杠杆税务', desc: '钱如何流动' },
  { key: 'noise', name: '噪音', desc: '远离喧哗' },
  { key: 'compound', name: '复利', desc: '时间的魔法' },
  { key: 'trend', name: '顺势配置', desc: '趋势与组合' },
  { key: 'legacy', name: '传承行动', desc: '此刻即开始' },
]

export const quotes = [
  // ── 觉醒 ──
  {
    id: 1,
    text: '富有是天赋，快乐是人权。',
    category: 'awakening',
    source: '《理财圣经》核心宣言',
    note: 'CLEC 投资哲学的总纲：富有不是技巧，而是本就属于你的权利。',
  },
  {
    id: 2,
    text: '有钱是正常的。你若陷入贫穷，不是你的错，是整个社会资本主义圈养的结果。',
    category: 'awakening',
    source: '《理财圣经》一、富有是天赋',
  },
  {
    id: 3,
    text: '富有是天赋，不是技巧。你不需要先证明自己"配得上"有钱，你只需要知道自己本来就可以有钱。',
    category: 'awakening',
    source: '《理财圣经》一、富有是天赋',
  },
  {
    id: 4,
    text: '觉知，就是一切的起点。富有不需要技巧，就像人人平等不需要技巧一样。',
    category: 'awakening',
    source: '《理财圣经》一、富有是天赋',
  },
  {
    id: 5,
    text: '你只要方向对了，成功是早晚的事；方向错了，再努力也没用。',
    category: 'awakening',
    source: '《理财圣经》三、跳出老鼠笼',
  },
  {
    id: 6,
    text: '这个世界上只有两种人——地主和佃农。差距不在谁更勤劳，而在他们站在经济结构中的不同位置。',
    category: 'awakening',
    source: '《理财圣经》三、跳出老鼠笼',
  },

  // ── 快乐 ──
  {
    id: 7,
    text: '快乐是人权。任何让你不快乐的人、事、物、关系，你都有权利拒绝。',
    category: 'happiness',
    source: '《理财圣经》二、快乐是人权',
  },
  {
    id: 8,
    text: '消费是一种道德，是一种付出。你花得起的钱要花，不花是不道德的。',
    category: 'happiness',
    source: '《理财圣经》二、快乐是人权',
  },
  {
    id: 9,
    text: '钱是工具，是用来帮你完成人生使命的工具。你不应该被金钱困住，活成金钱的奴隶。',
    category: 'happiness',
    source: '《理财圣经》二、快乐是人权',
  },
  {
    id: 10,
    text: '我们不是来吃苦的，我们是来享受人生的。',
    category: 'happiness',
    source: '《理财圣经》序言',
  },
  {
    id: 11,
    text: '过去没有遗憾，现在非常快乐，未来充满希望。',
    category: 'happiness',
    source: '《理财圣经》铁律六',
  },
  {
    id: 12,
    text: '财富只是工具，不是目的。',
    category: 'happiness',
    source: '《CLEC 宝典》序',
  },
  {
    id: 13,
    text: '永远从未来看现在。如果未来的你已经拥有数亿财富，那么今天的你最应该做的是什么？',
    category: 'happiness',
    source: '《CLEC 宝典》序',
  },
  {
    id: 14,
    text: '活在当下、珍惜当下、快乐地活在当下，远比累积数字本身更加重要。',
    category: 'happiness',
    source: '《CLEC 宝典》序',
  },
  {
    id: 15,
    text: '愿你不只是变得富有，更愿你成为一个自由、快乐、充满爱与智慧的人。',
    category: 'happiness',
    source: '《CLEC 宝典》序 · James',
  },

  // ── 标的 ──
  {
    id: 16,
    text: '理财铁律一：只投资指数基金。',
    category: 'vehicle',
    source: '《理财圣经》铁律一',
  },
  {
    id: 17,
    text: '我们不是巴菲特。普通人最好的策略，是买下整个市场，而不是去战胜它。',
    category: 'vehicle',
    source: '《理财圣经》六、我们不是巴菲特',
  },
  {
    id: 18,
    text: '为什么是纳斯达克100？因为它集中了人类科技最前沿的公司，你买的不只是股票，是时代本身在上涨。',
    category: 'vehicle',
    source: '《理财圣经》五、为什么是纳斯达克100',
  },

  // ── 纪律 ──
  {
    id: 19,
    text: '理财铁律二：任何时间买都对，任何时间卖都错。',
    category: 'discipline',
    source: '《理财圣经》铁律二',
  },
  {
    id: 20,
    text: '随时买，不要等。股市约 70% 的时间在上涨，等待期间的资金闲置成本，远超择时可能省下的价格。',
    category: 'discipline',
    source: '《理财圣经》七、随时买，不要等',
  },
  {
    id: 21,
    text: '不卖才是师傅。',
    category: 'discipline',
    source: '《理财圣经》八、不卖才是师傅',
  },
  {
    id: 22,
    text: '任何高点未来都是低点。把时间轴拉长，今天让你犹豫的"高位"，未来回头看都只是山脚。',
    category: 'discipline',
    source: '《理财圣经》九、任何高点未来都是低点',
  },

  // ── 风险 ──
  {
    id: 23,
    text: '理财铁律三：崩盘是你最好的朋友。',
    category: 'risk',
    source: '《理财圣经》铁律三',
  },
  {
    id: 24,
    text: '年轻人应该祈祷崩盘。对还在积累阶段的人，崩盘不是灾难，是打折促销——同样的资金可以买到更多份额。',
    category: 'risk',
    source: '《理财圣经》十、年轻人应该祈祷崩盘',
  },
  {
    id: 25,
    text: '一个 6 尺高的人，会淹死在平均 2 尺深的水里。平均值骗人，最坏情况才是你真正要准备的。',
    category: 'risk',
    source: '《理财圣经》铁律三',
  },
  {
    id: 26,
    text: '模拟最坏情况：市场可能下跌 70% 以上，请在投资之前，先把那一天的你演练一遍。',
    category: 'risk',
    source: '《理财圣经》十一、模拟最坏情况',
  },
  {
    id: 27,
    text: '保证金交易是毒药。它借钱加码，市场下跌时强制你在最低点卖出，把暂时的账面亏损变成永久的 real loss。',
    category: 'risk',
    source: '《理财圣经》十四、保证金交易是毒药',
  },

  // ── 杠杆税务 ──
  {
    id: 28,
    text: '理财铁律四：善用质押，远离保证金。',
    category: 'leverage',
    source: '《理财圣经》铁律四',
  },
  {
    id: 29,
    text: '质押：永远不卖也能花钱。以股票为抵押向银行贷款，你既拿到了现金，资产的所有权与增长权也完整保留。',
    category: 'leverage',
    source: '《理财圣经》十三、质押',
  },
  {
    id: 30,
    text: '银行不是存钱的地方，是借钱的地方。',
    category: 'leverage',
    source: '《理财圣经》铁律四',
  },
  {
    id: 31,
    text: '永远不缴资本利得税。不卖出，就没有已实现收益；没有已实现收益，就没有应税所得——完全合法合规。',
    category: 'leverage',
    source: '《理财圣经》十五、永远不缴资本利得税',
  },

  // ── 噪音 ──
  {
    id: 32,
    text: '理财铁律五：远离噪音与诈骗。',
    category: 'noise',
    source: '《理财圣经》铁律五',
  },
  {
    id: 33,
    text: '不要听专家的。金融业的商业模式建立在你的交易之上——你交易得越频繁，它赚得越多。',
    category: 'noise',
    source: '《理财圣经》十六、不要听专家的',
  },
  {
    id: 34,
    text: '夏虫不可语冰。困在短期波动里的人，无法理解穿越周期的力量。',
    category: 'noise',
    source: '《理财圣经》铁律五',
  },
  {
    id: 35,
    text: '警惕诈骗。凡是让你"先交钱才能赚大钱"的，都是冲着你的本金来的。',
    category: 'noise',
    source: '《理财圣经》十八、警惕诈骗',
  },

  // ── 复利 ──
  {
    id: 36,
    text: '理财铁律七：复利与时间的魔法。',
    category: 'compound',
    source: '《理财圣经》铁律七',
  },
  {
    id: 37,
    text: '复利从来不是线性的。同样的方法，时间放足，结果就是从亿级变百亿级、从百亿级变万亿级。',
    category: 'compound',
    source: '《理财圣经》序言',
  },
  {
    id: 38,
    text: '愈早开始愈好。每月一万、年化 12%，25 岁开始 40 年能滚到约 1 亿；35 岁开始 30 年只有约 3000 万。',
    category: 'compound',
    source: '《理财圣经》二十三、愈早开始愈好',
  },
  {
    id: 39,
    text: '每月 283 美元的亿万之路。时间，是这个世界上最强大、也最被低估的力量之一。',
    category: 'compound',
    source: '《理财圣经》二十一、每月283美元的亿万之路',
  },

  // ── 顺势配置 ──
  {
    id: 40,
    text: '理财铁律八：顺势而为。',
    category: 'trend',
    source: '《理财圣经》铁律八',
  },
  {
    id: 41,
    text: '所有的财富积累本质上都是转型利益。每一次转型（农业→工业→AI）都重新分配社会财富，站在趋势上的人才分得蛋糕。',
    category: 'trend',
    source: '《理财圣经》二十四、转型利益',
  },
  {
    id: 42,
    text: '433 / 442 / 613 资产配置：积累期的框架，不是为了多赚 1–2%，是让你在市场下跌与家庭意外同时发生时，还能活着。',
    category: 'trend',
    source: '《理财圣经》二十六、433/442/613 配置',
  },
  {
    id: 43,
    text: '现金是空气。上班族留 6–12 个月生活费，退休者留 20–30%。没有现金垫，再好的资产也会在最低点被迫卖出。',
    category: 'trend',
    source: '《理财圣经》二十二、退休需要多少钱',
  },

  // ── 传承行动 ──
  {
    id: 44,
    text: '免费赚最多。免费消除了利益冲突，使教育者能保持独立与真诚，也让知识传播得更广、更深。',
    category: 'legacy',
    source: '《理财圣经》二十七、免费赚最多',
  },
  {
    id: 45,
    text: '教育下一代。真正的传承，不是留多少资产，而是让正确的财富观在后代心里生根。',
    category: 'legacy',
    source: '《理财圣经》二十八、教育下一代',
  },
  {
    id: 46,
    text: '即刻行动。知道的那一刻，改变就已经发生；方向对了，剩下的只是时间。',
    category: 'legacy',
    source: '《理财圣经》二十九、即刻行动',
  },
  {
    id: 47,
    text: '知识最大的价值，不在于被拥有，而在于被传承。',
    category: 'legacy',
    source: '《CLEC 宝典》序',
  },
  {
    id: 48,
    text: '投资其实可以很简单：愿意理解资本主义的运作，愿意持有优秀的资产，愿意给时间发挥复利的力量。',
    category: 'legacy',
    source: '《CLEC 宝典》序',
  },
]
