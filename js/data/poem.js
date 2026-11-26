(function (g) {
  'use strict';
  var XT = g.XT;

  XT.poems = [
    {
      id: 'jingyesi',
      title: '静夜思',
      author: '李白',
      dynasty: '唐',
      frame: 'court',
      doneLabel: '去院子里',
      stops: [
        {
          id: 'bed',
          scene: 'room',
          place: '床前',
          narration: '兔兔走到床边',
          before: '床前明',
          after: '光',
          answer: '月',
          options: ['月', '日', '星', '灯'],
          line: '床前明月光',
          hint: '选一个字，补全这句诗'
        },
        {
          id: 'window',
          scene: 'window',
          place: '窗边',
          narration: '兔兔打开窗子',
          before: '疑是地上',
          after: '',
          answer: '霜',
          options: ['霜', '雪', '云', '沙'],
          line: '疑是地上霜',
          hint: '地上白白的一层，像什么？'
        },
        {
          id: 'moon',
          scene: 'moon',
          place: '抬头',
          narration: '兔兔抬起头',
          before: '举头望',
          after: '月',
          answer: '明',
          options: ['明', '亮', '圆', '红'],
          line: '举头望明月',
          hint: '抬头看见什么样的月？'
        },
        {
          id: 'home',
          scene: 'home',
          place: '低头',
          narration: '兔兔低下头',
          before: '低头思',
          after: '',
          answer: '故乡',
          options: ['故乡', '妈妈', '朋友', '学校'],
          line: '低头思故乡',
          hint: '兔兔想起了哪里？'
        }
      ]
    },
    {
      id: 'chunxiao',
      title: '春晓',
      author: '孟浩然',
      dynasty: '唐',
      frame: 'spring',
      doneLabel: '去花园里',
      stops: [
        {
          id: 'sleep',
          scene: 'dawn',
          place: '床前',
          narration: '兔兔还在春日的床上',
          before: '春眠不觉',
          after: '',
          answer: '晓',
          options: ['晓', '晚', '夜', '冬'],
          line: '春眠不觉晓',
          hint: '天亮了，叫什么？'
        },
        {
          id: 'birds',
          scene: 'birds',
          place: '树边',
          narration: '兔兔听见鸟叫',
          before: '处处闻啼',
          after: '',
          answer: '鸟',
          options: ['鸟', '花', '风', '雨'],
          line: '处处闻啼鸟',
          hint: '到处都能听见谁？'
        },
        {
          id: 'rain',
          scene: 'springrain',
          place: '窗边',
          narration: '夜里下过雨',
          before: '夜来风雨',
          after: '',
          answer: '声',
          options: ['声', '花', '鸟', '光'],
          line: '夜来风雨声',
          hint: '夜里听见风雨的什么？'
        },
        {
          id: 'petals',
          scene: 'petals',
          place: '花下',
          narration: '兔兔看看落花',
          before: '花落知多',
          after: '',
          answer: '少',
          options: ['少', '多', '高', '远'],
          line: '花落知多少',
          hint: '落了多少花，诗里问的是？'
        }
      ]
    },
    {
      id: 'guanque',
      title: '登鹳雀楼',
      author: '王之涣',
      dynasty: '唐',
      frame: 'tower',
      doneLabel: '去楼上看',
      stops: [
        {
          id: 'sun',
          scene: 'mountsun',
          place: '山边',
          narration: '太阳慢慢落向山后',
          before: '白日依山',
          after: '',
          answer: '尽',
          options: ['尽', '出', '亮', '红'],
          line: '白日依山尽',
          hint: '太阳快要落完了，是哪个字？'
        },
        {
          id: 'river',
          scene: 'yellowriver',
          place: '河边',
          narration: '兔兔看见大河',
          before: '黄河入海',
          after: '',
          answer: '流',
          options: ['流', '水', '浪', '船'],
          line: '黄河入海流',
          hint: '河水朝着大海怎样？'
        },
        {
          id: 'far',
          scene: 'farlook',
          place: '远望',
          narration: '兔兔想看得更远',
          before: '欲穷千里',
          after: '',
          answer: '目',
          options: ['目', '路', '山', '云'],
          line: '欲穷千里目',
          hint: '用什么看得很远很远？'
        },
        {
          id: 'up',
          scene: 'upstairs',
          place: '楼上',
          narration: '兔兔再走高一层',
          before: '更上一层',
          after: '',
          answer: '楼',
          options: ['楼', '山', '云', '桥'],
          line: '更上一层楼',
          hint: '再往上，是一层什么？'
        }
      ]
    }
  ];

  XT.poemStory = XT.poems[0];

  XT.poemById = function (id) {
    var i;
    for (i = 0; i < XT.poems.length; i++) {
      if (XT.poems[i].id === id) return XT.poems[i];
    }
    return XT.poems[0];
  };

  XT.poemDoneCount = function () {
    var n = 0;
    var i;
    var poem = XT.save.data.poem || {};
    for (i = 0; i < XT.poems.length; i++) {
      if (poem[XT.poems[i].id]) n += 1;
    }
    return n;
  };
})(typeof GameGlobal !== 'undefined' ? GameGlobal : (typeof window !== 'undefined' ? window : this));
