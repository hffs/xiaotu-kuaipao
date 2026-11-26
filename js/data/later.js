(function (g) {
  'use strict';
  var XT = g.XT;

  function pad(n) {
    return n < 10 ? '0' + n : String(n);
  }

  function near(answer, min, max) {
    var prefs = [1, -1, 2, -2, 3, -3, 4, -4];
    var out = [];
    var i, v;
    for (i = 0; i < prefs.length && out.length < 3; i++) {
      v = answer + prefs[i];
      if (v >= min && v <= max && v !== answer && out.indexOf(v) < 0) out.push(v);
    }
    v = min;
    while (out.length < 3 && v <= max) {
      if (v !== answer && out.indexOf(v) < 0) out.push(v);
      v += 1;
    }
    return out;
  }

  function nums(id, type, prompt, answer, min, max, visual) {
    var wrong = near(answer, min, max);
    return {
      id: id,
      type: type,
      prompt: prompt,
      answer: String(answer),
      options: [String(answer), String(wrong[0]), String(wrong[1]), String(wrong[2])],
      visual: visual || null
    };
  }

  var countRows = [
    [4, 'star', '数一数，有几颗星？'],
    [6, 'star', '数一数，有几颗星？'],
    [8, 'star', '数一数，有几颗星？'],
    [5, 'flower', '数一数，有几朵花？'],
    [7, 'flower', '数一数，有几朵花？'],
    [9, 'flower', '数一数，有几朵花？'],
    [3, 'fish', '数一数，有几条鱼？'],
    [6, 'fish', '数一数，有几条鱼？'],
    [10, 'fish', '数一数，有几条鱼？'],
    [4, 'bird', '数一数，有几只鸟？'],
    [8, 'bird', '数一数，有几只鸟？'],
    [5, 'fruit', '数一数，有几个果子？'],
    [7, 'fruit', '数一数，有几个果子？'],
    [9, 'fruit', '数一数，有几个果子？'],
    [11, 'star', '数一数，有几颗星？'],
    [12, 'star', '数一数，有几颗星？'],
    [14, 'flower', '数一数，有几朵花？'],
    [15, 'fish', '数一数，有几条鱼？'],
    [2, 'bird', '数一数，有几只鸟？'],
    [13, 'fruit', '数一数，有几个果子？'],
    [16, 'star', '数一数，有几颗星？'],
    [18, 'flower', '数一数，有几朵花？']
  ];
  var bank4 = [];
  var i;
  for (i = 0; i < countRows.length; i++) {
    bank4.push(nums(
      'm4-' + pad(i + 1),
      'count',
      countRows[i][2],
      countRows[i][0],
      0,
      20,
      { kind: 'count', icon: countRows[i][1], n: countRows[i][0] }
    ));
  }
  XT.banks['math-4'] = bank4;

  function sideQ(id, leftIcon, leftN, rightIcon, rightN) {
    var answer = '一样多';
    if (leftN > rightN) answer = '左边';
    else if (rightN > leftN) answer = '右边';
    return {
      id: id,
      type: 'whichMore',
      prompt: '哪边更多？',
      answer: answer,
      options: ['左边', '右边', '一样多', '都没有'],
      visual: { kind: 'compare', leftIcon: leftIcon, leftN: leftN, rightIcon: rightIcon, rightN: rightN }
    };
  }

  function diffQ(id, leftIcon, leftN, rightIcon, rightN, askLeft) {
    var diff = askLeft ? leftN - rightN : rightN - leftN;
    var prompt = askLeft ? '左边比右边多几个？' : '右边比左边多几个？';
    return nums(id, askLeft ? 'moreLeft' : 'moreRight', prompt, diff, 0, 12, {
      kind: 'compare',
      leftIcon: leftIcon,
      leftN: leftN,
      rightIcon: rightIcon,
      rightN: rightN
    });
  }

  XT.banks['math-5'] = [
    sideQ('m5-01', 'star', 5, 'flower', 3),
    sideQ('m5-02', 'fish', 2, 'bird', 6),
    sideQ('m5-03', 'fruit', 4, 'fruit', 4),
    sideQ('m5-04', 'star', 7, 'star', 4),
    sideQ('m5-05', 'flower', 3, 'fish', 8),
    sideQ('m5-06', 'bird', 6, 'fruit', 6),
    sideQ('m5-07', 'fish', 9, 'star', 5),
    sideQ('m5-08', 'flower', 1, 'bird', 4),
    sideQ('m5-09', 'fruit', 8, 'flower', 2),
    sideQ('m5-10', 'star', 3, 'fish', 3),
    sideQ('m5-11', 'bird', 5, 'star', 9),
    diffQ('m5-12', 'star', 6, 'flower', 2, true),
    diffQ('m5-13', 'fish', 3, 'bird', 7, false),
    diffQ('m5-14', 'fruit', 8, 'star', 3, true),
    diffQ('m5-15', 'flower', 2, 'fish', 6, false),
    diffQ('m5-16', 'bird', 9, 'fruit', 4, true),
    diffQ('m5-17', 'star', 4, 'bird', 8, false),
    diffQ('m5-18', 'flower', 7, 'star', 1, true),
    diffQ('m5-19', 'fish', 5, 'flower', 9, false),
    diffQ('m5-20', 'fruit', 10, 'fish', 4, true),
    diffQ('m5-21', 'star', 3, 'fruit', 8, false),
    diffQ('m5-22', 'bird', 6, 'flower', 2, true)
  ];

  function story(id, type, prompt, answer) {
    return nums(id, type, prompt, answer, 0, 20, { kind: 'story' });
  }

  XT.banks['math-6'] = [
    story('m6-01', 'storyAdd', '小兔有 3 根萝卜，又得到 2 根。现在有几根？', 5),
    story('m6-02', 'storyAdd', '树上有 4 只鸟，又飞来 3 只。一共几只？', 7),
    story('m6-03', 'storyAdd', '小明有 6 颗糖，妈妈再给 2 颗。一共几颗？', 8),
    story('m6-04', 'storyAdd', '河里有 5 条鱼，又游来 4 条。一共几条？', 9),
    story('m6-05', 'storyAdd', '花园里有 7 朵花，又开了 3 朵。一共几朵？', 10),
    story('m6-06', 'storyAdd', '书包里有 8 本书，又放进 2 本。一共几本？', 10),
    story('m6-07', 'storyAdd', '停车场有 9 辆车，又开来 6 辆。一共几辆？', 15),
    story('m6-08', 'storyAdd', '小红摘了 4 个苹果，又摘了 5 个。一共几个？', 9),
    story('m6-09', 'storyAdd', '盒子里有 11 支铅笔，又放进 3 支。一共几支？', 14),
    story('m6-10', 'storyAdd', '班上有 8 个男孩，7 个女孩。一共几个小朋友？', 15),
    story('m6-11', 'storyAdd', '兔兔跳了 6 下，又跳了 6 下。一共跳了几下？', 12),
    story('m6-12', 'storySub', '小兔有 8 根萝卜，吃掉 3 根。还剩几根？', 5),
    story('m6-13', 'storySub', '树上有 9 只鸟，飞走 4 只。还剩几只？', 5),
    story('m6-14', 'storySub', '小明有 10 颗糖，送给朋友 2 颗。还剩几颗？', 8),
    story('m6-15', 'storySub', '河里有 7 条鱼，游走 3 条。还剩几条？', 4),
    story('m6-16', 'storySub', '花园里有 12 朵花，摘走 5 朵。还剩几朵？', 7),
    story('m6-17', 'storySub', '书包里有 15 本书，借出 6 本。还剩几本？', 9),
    story('m6-18', 'storySub', '停车场有 14 辆车，开走 8 辆。还剩几辆？', 6),
    story('m6-19', 'storySub', '小红有 11 个苹果，吃了 2 个。还剩几个？', 9),
    story('m6-20', 'storySub', '盒子里有 13 支铅笔，用掉 4 支。还剩几支？', 9),
    story('m6-21', 'storySub', '班上 16 个小朋友，走了 7 个。还剩几个？', 9),
    story('m6-22', 'storyAdd', '早上有 2 只蝴蝶，中午又来了 9 只。一共几只？', 11)
  ];

  function py(id, pinyin, answer, options) {
    return {
      id: id,
      type: 'pinyin',
      prompt: '这是哪个字？',
      answer: answer,
      options: options,
      visual: { kind: 'pinyin', text: pinyin }
    };
  }

  XT.banks['chinese-4'] = [
    py('c4-01', 'rì', '日', ['日', '目', '白', '田']),
    py('c4-02', 'yuè', '月', ['月', '日', '明', '用']),
    py('c4-03', 'shuǐ', '水', ['水', '小', '木', '火']),
    py('c4-04', 'huǒ', '火', ['火', '大', '人', '木']),
    py('c4-05', 'shān', '山', ['山', '出', '土', '上']),
    py('c4-06', 'mù', '木', ['木', '本', '禾', '米']),
    py('c4-07', 'rén', '人', ['人', '入', '八', '大']),
    py('c4-08', 'kǒu', '口', ['口', '日', '中', '田']),
    py('c4-09', 'tiān', '天', ['天', '大', '夫', '太']),
    py('c4-10', 'shàng', '上', ['上', '下', '土', '工']),
    py('c4-11', 'xià', '下', ['下', '上', '不', '丁']),
    py('c4-12', 'dà', '大', ['大', '天', '太', '犬']),
    py('c4-13', 'xiǎo', '小', ['小', '少', '水', '木']),
    py('c4-14', 'zhōng', '中', ['中', '口', '日', '申']),
    py('c4-15', 'tián', '田', ['田', '由', '甲', '日']),
    py('c4-16', 'bái', '白', ['白', '日', '目', '自']),
    py('c4-17', 'mǎ', '马', ['马', '鸟', '乌', '为']),
    py('c4-18', 'niǎo', '鸟', ['鸟', '马', '乌', '岛']),
    py('c4-19', 'yú', '鱼', ['鱼', '渔', '鸟', '羊']),
    py('c4-20', 'huā', '花', ['花', '草', '华', '化']),
    py('c4-21', 'yǔ', '雨', ['雨', '雪', '云', '电']),
    py('c4-22', 'shǒu', '手', ['手', '毛', '看', '目'])
  ];

  function sent(id, prompt, answer, options) {
    return {
      id: id,
      type: 'sentence',
      prompt: prompt,
      answer: answer,
      options: options,
      visual: { kind: 'story' }
    };
  }

  XT.banks['chinese-5'] = [
    sent('c5-01', '小鸟在天上___。', '飞', ['飞', '游', '爬', '睡']),
    sent('c5-02', '鱼儿在水里___。', '游', ['游', '飞', '跑', '跳']),
    sent('c5-03', '我用___写字。', '笔', ['笔', '杯', '球', '鞋']),
    sent('c5-04', '下雨了，快打___。', '伞', ['伞', '灯', '床', '书']),
    sent('c5-05', '晚上，月亮挂在___。', '天上', ['天上', '水里', '书包', '鞋子']),
    sent('c5-06', '小兔最爱吃___。', '萝卜', ['萝卜', '石头', '铅笔', '雨伞']),
    sent('c5-07', '我们去学校___。', '读书', ['读书', '游泳', '睡觉', '下雨']),
    sent('c5-08', '花儿开在___上。', '枝头', ['枝头', '河底', '鞋子', '书包']),
    sent('c5-09', '妈妈给我讲___。', '故事', ['故事', '石头', '雨伞', '汽车']),
    sent('c5-10', '太阳从东方___。', '升起', ['升起', '落下', '睡觉', '游泳']),
    sent('c5-11', '冬天会下___。', '雪', ['雪', '花', '果', '书']),
    sent('c5-12', '我每天早上___。', '起床', ['起床', '下雨', '开花', '游泳']),
    sent('c5-13', '小鸟用翅膀___。', '飞翔', ['飞翔', '写字', '读书', '打伞']),
    sent('c5-14', '清水里有___。', '小鱼', ['小鱼', '小鸟', '太阳', '书包']),
    sent('c5-15', '书要放在___里。', '书包', ['书包', '河里', '天上', '花里']),
    sent('c5-16', '好朋友要互相___。', '帮助', ['帮助', '下雨', '开花', '睡觉']),
    sent('c5-17', '红色的灯说___。', '停下', ['停下', '飞走', '游走', '睡觉']),
    sent('c5-18', '绿色的灯可以___。', '通过', ['通过', '睡觉', '下雨', '开花']),
    sent('c5-19', '春天来了，花儿___。', '开了', ['开了', '飞了', '跑了', '睡了']),
    sent('c5-20', '我爱我的___。', '家人', ['家人', '石头', '雨伞', '铅笔']),
    sent('c5-21', '小手洗干净再___。', '吃饭', ['吃饭', '下雨', '开花', '飞翔']),
    sent('c5-22', '晚上要早早___。', '睡觉', ['睡觉', '游泳', '爬山', '写字'])
  ];

  function dict(id, hint, answer, options, pinyin) {
    return {
      id: id,
      type: 'dict',
      prompt: hint,
      answer: answer,
      options: options,
      visual: pinyin ? { kind: 'pinyin', text: pinyin } : { kind: 'story' }
    };
  }

  XT.banks['chinese-6'] = [
    dict('c6-01', '听写：选出这个字', '日', ['日', '月', '目', '白'], 'rì'),
    dict('c6-02', '听写：选出这个字', '月', ['月', '日', '明', '用'], 'yuè'),
    dict('c6-03', '听写：选出这个字', '水', ['水', '火', '木', '小'], 'shuǐ'),
    dict('c6-04', '听写：选出这个字', '火', ['火', '水', '大', '人'], 'huǒ'),
    dict('c6-05', '听写：选出这个字', '山', ['山', '土', '上', '出'], 'shān'),
    dict('c6-06', '听写：选出这个字', '人', ['人', '入', '八', '大'], 'rén'),
    dict('c6-07', '听写：选出这个字', '天', ['天', '大', '夫', '太'], 'tiān'),
    dict('c6-08', '听写：选出这个字', '上', ['上', '下', '土', '工'], 'shàng'),
    dict('c6-09', '听写：选出这个字', '下', ['下', '上', '不', '丁'], 'xià'),
    dict('c6-10', '听写：选出这个字', '中', ['中', '口', '日', '申'], 'zhōng'),
    dict('c6-11', '太阳的___', '日', ['日', '月', '星', '云'], null),
    dict('c6-12', '月亮的___', '月', ['月', '日', '明', '光'], null),
    dict('c6-13', '山水的___', '山', ['山', '水', '石', '土'], null),
    dict('c6-14', '火车的___', '火', ['火', '水', '木', '车'], null),
    dict('c6-15', '小鸟的___', '鸟', ['鸟', '马', '鱼', '羊'], null),
    dict('c6-16', '小鱼的___', '鱼', ['鱼', '鸟', '马', '虫'], null),
    dict('c6-17', '花朵的___', '花', ['花', '草', '叶', '果'], null),
    dict('c6-18', '雨水的___', '雨', ['雨', '雪', '云', '风'], null),
    dict('c6-19', '大小的___', '大', ['大', '小', '天', '太'], null),
    dict('c6-20', '上下的___', '下', ['下', '上', '中', '不'], null),
    dict('c6-21', '听写：选出这个字', '手', ['手', '目', '口', '耳'], 'shǒu'),
    dict('c6-22', '听写：选出这个字', '目', ['目', '日', '自', '且'], 'mù')
  ];

  function word(id, type, prompt, icon, answer, options) {
    return {
      id: id,
      type: type,
      prompt: prompt,
      answer: answer,
      options: options,
      visual: { kind: 'icon', name: icon }
    };
  }

  XT.banks['english-4'] = [
    word('e4-01', 'verb', '他在做什么？', 'run', 'run', ['run', 'ran', 'fun', 'sun']),
    word('e4-02', 'verb', '他在做什么？', 'jump', 'jump', ['jump', 'bump', 'pump', 'junk']),
    word('e4-03', 'verb', '他在做什么？', 'eat', 'eat', ['eat', 'ear', 'tea', 'hat']),
    word('e4-04', 'verb', '他在做什么？', 'sit', 'sit', ['sit', 'sat', 'sip', 'six']),
    word('e4-05', 'verb', '他在做什么？', 'sleep', 'sleep', ['sleep', 'sheep', 'slip', 'steep']),
    word('e4-06', 'verb', '他在做什么？', 'walk', 'walk', ['walk', 'talk', 'wall', 'work']),
    word('e4-07', 'verb', '他在做什么？', 'read', 'read', ['read', 'red', 'road', 'ride']),
    word('e4-08', 'verb', '他在做什么？', 'swim', 'swim', ['swim', 'swing', 'slim', 'swan']),
    word('e4-09', 'verb', '他在做什么？', 'sing', 'sing', ['sing', 'song', 'ring', 'sink']),
    word('e4-10', 'verb', '他在做什么？', 'drink', 'drink', ['drink', 'think', 'drive', 'pink']),
    word('e4-11', 'verb', '他在做什么？', 'write', 'write', ['write', 'white', 'ride', 'wait']),
    word('e4-12', 'verb', '他在做什么？', 'clap', 'clap', ['clap', 'clip', 'cap', 'flap']),
    word('e4-13', 'verb', '他在做什么？', 'fly', 'fly', ['fly', 'fry', 'sky', 'cry']),
    word('e4-14', 'verb', '他在做什么？', 'kick', 'kick', ['kick', 'kiss', 'pick', 'king']),
    word('e4-15', 'verb', '他在做什么？', 'draw', 'draw', ['draw', 'drag', 'dry', 'day']),
    word('e4-16', 'verb', '他在做什么？', 'wash', 'wash', ['wash', 'wish', 'watch', 'fish']),
    word('e4-17', 'verb', '他在做什么？', 'hop', 'hop', ['hop', 'hope', 'hot', 'hip']),
    word('e4-18', 'verb', '他在做什么？', 'hug', 'hug', ['hug', 'bug', 'mug', 'rug']),
    word('e4-19', 'verb', '他在做什么？', 'cry', 'cry', ['cry', 'try', 'dry', 'sky']),
    word('e4-20', 'verb', '他在做什么？', 'open', 'open', ['open', 'pen', 'oven', 'hope'])
  ];

  XT.banks['english-5'] = [
    word('e5-01', 'weather', '这是什么天气？', 'sun', 'sunny', ['sunny', 'funny', 'snowy', 'sandy']),
    word('e5-02', 'weather', '这是什么天气？', 'rain', 'rainy', ['rainy', 'shiny', 'runny', 'sandy']),
    word('e5-03', 'weather', '这是什么天气？', 'cloud', 'cloudy', ['cloudy', 'windy', 'candy', 'cloud']),
    word('e5-04', 'weather', '这是什么天气？', 'wind', 'windy', ['windy', 'window', 'winter', 'wonder']),
    word('e5-05', 'weather', '这是什么天气？', 'snow', 'snowy', ['snowy', 'slowly', 'showy', 'sunny']),
    word('e5-06', 'weather', '这是什么天气？', 'hot', 'hot', ['hot', 'hat', 'hit', 'not']),
    word('e5-07', 'weather', '这是什么天气？', 'cold', 'cold', ['cold', 'gold', 'hold', 'old']),
    word('e5-08', 'weather', '这是什么天气？', 'fog', 'foggy', ['foggy', 'frog', 'doggy', 'fog']),
    word('e5-09', 'weather', '这是什么天气？', 'storm', 'stormy', ['stormy', 'story', 'starry', 'snowy']),
    word('e5-10', 'weather', '这是什么天气？', 'warm', 'warm', ['warm', 'worm', 'farm', 'warn']),
    word('e5-11', 'weather', '这是什么天气？', 'cool', 'cool', ['cool', 'pool', 'cold', 'cook']),
    word('e5-12', 'weather', '这是什么天气？', 'sun', 'sunny', ['sunny', 'sorry', 'snowy', 'sunday']),
    word('e5-13', 'weather', '这是什么天气？', 'rain', 'rainy', ['rainy', 'rain', 'train', 'brain']),
    word('e5-14', 'weather', '这是什么天气？', 'cloud', 'cloudy', ['cloudy', 'could', 'crowd', 'loud']),
    word('e5-15', 'weather', '这是什么天气？', 'wind', 'windy', ['windy', 'wind', 'wide', 'kind']),
    word('e5-16', 'weather', '这是什么天气？', 'snow', 'snowy', ['snowy', 'snow', 'now', 'slow']),
    word('e5-17', 'weather', '这是什么天气？', 'hot', 'hot', ['hot', 'hop', 'pot', 'lot']),
    word('e5-18', 'weather', '这是什么天气？', 'cold', 'cold', ['cold', 'cord', 'fold', 'told']),
    word('e5-19', 'weather', '这是什么天气？', 'storm', 'stormy', ['stormy', 'storm', 'store', 'story']),
    word('e5-20', 'weather', '这是什么天气？', 'fog', 'foggy', ['foggy', 'fog', 'log', 'jog'])
  ];

  XT.banks['english-6'] = [
    word('e6-01', 'school', '这是什么？', 'bag', 'bag', ['bag', 'big', 'bug', 'bat']),
    word('e6-02', 'school', '这是什么？', 'desk', 'desk', ['desk', 'disk', 'duck', 'dusk']),
    word('e6-03', 'school', '这是什么？', 'pen', 'pen', ['pen', 'pan', 'pet', 'ten']),
    word('e6-04', 'school', '这是什么？', 'book', 'book', ['book', 'boot', 'look', 'box']),
    word('e6-05', 'school', '这是什么？', 'bus', 'bus', ['bus', 'but', 'bug', 'bun']),
    word('e6-06', 'school', '这是什么？', 'ruler', 'ruler', ['ruler', 'rubber', 'rule', 'runner']),
    word('e6-07', 'school', '这是什么？', 'chair', 'chair', ['chair', 'hair', 'chain', 'cheer']),
    word('e6-08', 'school', '这是什么？', 'door', 'door', ['door', 'floor', 'poor', 'doll']),
    word('e6-09', 'school', '这是什么？', 'pencil', 'pencil', ['pencil', 'pen', 'pickle', 'parcel']),
    word('e6-10', 'school', '这是什么？', 'map', 'map', ['map', 'mop', 'cap', 'mat']),
    word('e6-11', 'school', '这是什么？', 'bell', 'bell', ['bell', 'ball', 'bill', 'belt']),
    word('e6-12', 'school', '这是什么？', 'clock', 'clock', ['clock', 'click', 'lock', 'block']),
    word('e6-13', 'school', '这是什么？', 'cup', 'cup', ['cup', 'cap', 'cut', 'pup']),
    word('e6-14', 'school', '这是什么？', 'rubber', 'rubber', ['rubber', 'ruler', 'robber', 'butter']),
    word('e6-15', 'school', '这是什么？', 'bag', 'bag', ['bag', 'beg', 'tag', 'rag']),
    word('e6-16', 'school', '这是什么？', 'desk', 'desk', ['desk', 'deck', 'nest', 'rest']),
    word('e6-17', 'school', '这是什么？', 'chair', 'chair', ['chair', 'chart', 'chase', 'share']),
    word('e6-18', 'school', '这是什么？', 'pencil', 'pencil', ['pencil', 'pens', 'stencil', 'cancel']),
    word('e6-19', 'school', '这是什么？', 'bell', 'bell', ['bell', 'tell', 'well', 'fell']),
    word('e6-20', 'school', '这是什么？', 'map', 'map', ['map', 'nap', 'tap', 'lap'])
  ];
})(typeof GameGlobal !== 'undefined' ? GameGlobal : (typeof window !== 'undefined' ? window : this));
