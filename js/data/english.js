(function (g) {
  'use strict';
  var XT = g.XT;

  function animal(id, answer, icon, options) {
    return {
      id: id,
      type: 'animal',
      prompt: '这是什么？',
      answer: answer,
      options: options,
      visual: { kind: 'icon', name: icon }
    };
  }

  function color(id, answer, hex, options) {
    return {
      id: id,
      type: 'color',
      prompt: '这是什么颜色？',
      answer: answer,
      options: options,
      visual: { kind: 'color', color: hex }
    };
  }

  function object(id, answer, icon, options) {
    return {
      id: id,
      type: 'object',
      prompt: '这是什么？',
      answer: answer,
      options: options,
      visual: { kind: 'icon', name: icon }
    };
  }

  XT.banks['english-1'] = [
    animal('e1-01', 'cat', 'cat', ['cat', 'cap', 'car', 'hat']),
    animal('e1-02', 'dog', 'dog', ['dog', 'dot', 'log', 'dig']),
    animal('e1-03', 'pig', 'pig', ['pig', 'pin', 'big', 'pit']),
    animal('e1-04', 'duck', 'duck', ['duck', 'luck', 'dock', 'dark']),
    animal('e1-05', 'fish', 'fish', ['fish', 'dish', 'wish', 'fist']),
    animal('e1-06', 'bird', 'bird', ['bird', 'bind', 'bid', 'bar']),
    animal('e1-07', 'bee', 'bee', ['bee', 'see', 'bed', 'tea']),
    animal('e1-08', 'frog', 'frog', ['frog', 'fog', 'from', 'flag']),
    animal('e1-09', 'cow', 'cow', ['cow', 'how', 'cot', 'bow']),
    animal('e1-10', 'panda', 'panda', ['panda', 'pond', 'band', 'candy']),
    animal('e1-11', 'rabbit', 'rabbit', ['rabbit', 'habit', 'ribbon', 'robot']),
    animal('e1-12', 'sheep', 'sheep', ['sheep', 'ship', 'sleep', 'shop']),
    animal('e1-13', 'bear', 'bear', ['bear', 'pear', 'beer', 'bean']),
    animal('e1-14', 'hen', 'hen', ['hen', 'pen', 'ten', 'hat']),
    animal('e1-15', 'mouse', 'mouse', ['mouse', 'house', 'mouth', 'moose']),
    animal('e1-16', 'horse', 'horse', ['horse', 'house', 'horn', 'home'])
  ];

  XT.banks['english-2'] = [
    color('e2-01', 'red', '#FF5A5A', ['red', 'blue', 'green', 'yellow']),
    color('e2-02', 'blue', '#4DA3FF', ['blue', 'black', 'brown', 'green']),
    color('e2-03', 'green', '#3CB86A', ['green', 'red', 'yellow', 'black']),
    color('e2-04', 'yellow', '#FFD23A', ['yellow', 'white', 'orange', 'red']),
    color('e2-05', 'pink', '#FF8FB8', ['pink', 'red', 'purple', 'white']),
    color('e2-06', 'black', '#3A3344', ['black', 'blue', 'brown', 'red']),
    color('e2-07', 'white', '#FFFFFF', ['white', 'black', 'yellow', 'pink']),
    color('e2-08', 'orange', '#FF9F43', ['orange', 'red', 'yellow', 'pink']),
    color('e2-09', 'purple', '#8B78F6', ['purple', 'blue', 'pink', 'black']),
    color('e2-10', 'brown', '#A97142', ['brown', 'black', 'orange', 'red']),
    color('e2-11', 'gold', '#E6B423', ['gold', 'yellow', 'orange', 'brown']),
    color('e2-12', 'gray', '#9AA0A6', ['gray', 'black', 'white', 'green']),
    color('e2-13', 'red', '#E23B3B', ['red', 'pink', 'orange', 'brown']),
    color('e2-14', 'blue', '#2E6FE0', ['blue', 'purple', 'green', 'black']),
    color('e2-15', 'green', '#2F9E4F', ['green', 'blue', 'yellow', 'brown']),
    color('e2-16', 'yellow', '#FFC107', ['yellow', 'gold', 'orange', 'white']),
    color('e2-17', 'pink', '#FF6FA0', ['pink', 'purple', 'red', 'orange']),
    color('e2-18', 'purple', '#6C5CE7', ['purple', 'blue', 'pink', 'brown'])
  ];

  XT.banks['english-3'] = [
    object('e3-01', 'apple', 'fruit', ['apple', 'apply', 'ape', 'ball']),
    object('e3-02', 'book', 'book', ['book', 'boot', 'look', 'box']),
    object('e3-03', 'ball', 'ball', ['ball', 'bell', 'tall', 'call']),
    object('e3-04', 'star', 'star', ['star', 'start', 'stay', 'car']),
    object('e3-05', 'cake', 'cake', ['cake', 'cape', 'lake', 'cat']),
    object('e3-06', 'milk', 'milk', ['milk', 'mill', 'silk', 'mink']),
    object('e3-07', 'sun', 'sun', ['sun', 'son', 'sit', 'run']),
    object('e3-08', 'moon', 'moon', ['moon', 'soon', 'room', 'mouse']),
    object('e3-09', 'tree', 'tree', ['tree', 'three', 'free', 'train']),
    object('e3-10', 'flower', 'flower', ['flower', 'flour', 'floor', 'fly']),
    object('e3-11', 'house', 'house', ['house', 'horse', 'mouse', 'home']),
    object('e3-12', 'car', 'car', ['car', 'cat', 'card', 'can']),
    object('e3-13', 'hat', 'hat', ['hat', 'hot', 'hit', 'cat']),
    object('e3-14', 'cup', 'cup', ['cup', 'cap', 'cut', 'pup']),
    object('e3-15', 'egg', 'egg', ['egg', 'leg', 'beg', 'end']),
    object('e3-16', 'bus', 'bus', ['bus', 'but', 'bug', 'bun']),
    object('e3-17', 'rain', 'rain', ['rain', 'train', 'pain', 'run']),
    object('e3-18', 'shoe', 'shoe', ['shoe', 'shop', 'show', 'she']),
    object('e3-19', 'bird', 'bird', ['bird', 'book', 'bear', 'bed']),
    object('e3-20', 'fish', 'fish', ['fish', 'fist', 'dish', 'five'])
  ];
})(typeof GameGlobal !== 'undefined' ? GameGlobal : (typeof window !== 'undefined' ? window : this));