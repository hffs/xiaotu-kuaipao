(function (g) {
  'use strict';
  var XT = g.XT;

  XT.catalog = {
    math: {
      id: 'math',
      name: '数学',
      tag: '加法减法',
      blurb: '加法、数一数、比多少，兔兔跑过草地、森林和小镇。',
      color: '#3FA96A',
      edge: '#2E8A52',
      soft: '#E7F8EA',
      levels: [
        { id: 1, free: true, title: '草地清晨', subtitle: '10 以内加法', scene: 'morning', bank: 'math-1' },
        { id: 2, free: true, title: '森林午后', subtitle: '加减法混合', scene: 'forest', bank: 'math-2' },
        { id: 3, free: true, title: '黄昏山坡', subtitle: '20 以内进位退位', scene: 'sunset', bank: 'math-3' },
        { id: 4, free: true, title: '星空计数', subtitle: '数一数', scene: 'morning', bank: 'math-4' },
        { id: 5, free: true, title: '河边比多少', subtitle: '比一比', scene: 'forest', bank: 'math-5' },
        { id: 6, free: true, title: '小镇应用题', subtitle: '一步加减', scene: 'sunset', bank: 'math-6' }
      ]
    },
    chinese: {
      id: 'chinese',
      name: '语文',
      tag: '识字小径',
      blurb: '看图认字、拼音和短句，沿着石径走到书院。',
      color: '#1F8F86',
      edge: '#14756E',
      soft: '#E5F6F3',
      levels: [
        { id: 1, free: true, title: '石径识字', subtitle: '看图选字', scene: 'ink', variant: 1, bank: 'chinese-1' },
        { id: 2, free: true, title: '竹林再认', subtitle: '看图选字', scene: 'ink', variant: 2, bank: 'chinese-2' },
        { id: 3, free: true, title: '书院组词', subtitle: '给字找朋友', scene: 'ink', variant: 3, bank: 'chinese-3' },
        { id: 4, free: true, title: '灯下字卡', subtitle: '看拼音选字', scene: 'ink', variant: 1, bank: 'chinese-4' },
        { id: 5, free: true, title: '竹简短句', subtitle: '把句子补全', scene: 'ink', variant: 2, bank: 'chinese-5' },
        { id: 6, free: true, title: '书院听写', subtitle: '看提示选字', scene: 'ink', variant: 3, bank: 'chinese-6' }
      ]
    },
    english: {
      id: 'english',
      name: '英语',
      tag: '字母花园',
      blurb: '看图选词，从动物、动作走到天气和校园。',
      color: '#2E8FD6',
      edge: '#1E73B3',
      soft: '#E4F4FF',
      levels: [
        { id: 1, free: true, title: '动物小站', subtitle: '看图选词', scene: 'garden', variant: 1, bank: 'english-1' },
        { id: 2, free: true, title: '颜色花园', subtitle: '看图选词', scene: 'garden', variant: 2, bank: 'english-2' },
        { id: 3, free: true, title: '小物招牌', subtitle: '看图选词', scene: 'garden', variant: 3, bank: 'english-3' },
        { id: 4, free: true, title: '动作牌子', subtitle: '看图选动作', scene: 'garden', variant: 1, bank: 'english-4' },
        { id: 5, free: true, title: '天气窗口', subtitle: '看图选天气', scene: 'garden', variant: 2, bank: 'english-5' },
        { id: 6, free: true, title: '校园小路', subtitle: '看图选校园词', scene: 'garden', variant: 3, bank: 'english-6' }
      ]
    },
    poem: {
      id: 'poem',
      name: '古诗词',
      tag: '身临其境',
      blurb: '跟着兔兔走进一首首古诗。',
      color: '#5C4DB5',
      edge: '#4638A0',
      soft: '#EEE9FF'
    }
  };

  XT.demoFriends = [
    {
      name: '小明',
      color: '#7EC8F0',
      face: 'bear',
      done: [
        { subject: 'math', level: 1, stars: 3 },
        { subject: 'math', level: 2, stars: 2 }
      ]
    },
    {
      name: '小红',
      color: '#FFB7D5',
      face: 'rabbit',
      done: [
        { subject: 'chinese', level: 1, stars: 3 },
        { subject: 'chinese', level: 2, stars: 2 }
      ]
    },
    {
      name: '乐乐',
      color: '#B6F0B4',
      face: 'panda',
      done: [
        { subject: 'english', level: 1, stars: 3 },
        { subject: 'english', level: 2, stars: 3 },
        { subject: 'english', level: 3, stars: 2 }
      ]
    },
    {
      name: '朵朵',
      color: '#FFE38A',
      face: 'cat',
      done: [
        { subject: 'math', level: 1, stars: 1 },
        { subject: 'english', level: 1, stars: 2 }
      ]
    }
  ];

  XT.demoChallenges = [
    {
      id: 'demo-ming',
      from: '小明',
      subject: 'math',
      level: 1,
      type: 'add10',
      prompt: '3 + 4 = ?',
      answer: '7',
      options: ['5', '7', '8', '6'],
      visual: { kind: 'dots', a: 3, b: 4, op: '+' }
    },
    {
      id: 'demo-hong',
      from: '小红',
      subject: 'english',
      level: 1,
      type: 'animal',
      prompt: '这是什么？',
      answer: 'cat',
      options: ['cat', 'cap', 'car', 'hat'],
      visual: { kind: 'icon', name: 'cat' }
    }
  ];
})(typeof GameGlobal !== 'undefined' ? GameGlobal : (typeof window !== 'undefined' ? window : this));