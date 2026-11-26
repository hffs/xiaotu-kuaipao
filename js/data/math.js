(function (g) {
  'use strict';
  var XT = g.XT;

  function near(answer, count, min, max, extra) {
    var prefs = [1, -1, 2, -2, 3, -3, 4, -4, 5, -5];
    var out = [];
    var i, v;
    if (extra) {
      for (i = 0; i < extra.length; i++) prefs.unshift(extra[i] - answer);
    }
    for (i = 0; i < prefs.length && out.length < count; i++) {
      v = answer + prefs[i];
      if (v >= min && v <= max && v !== answer && out.indexOf(v) < 0) out.push(v);
    }
    v = min;
    while (out.length < count && v <= max) {
      if (v !== answer && out.indexOf(v) < 0) out.push(v);
      v += 1;
    }
    return out;
  }

  function make(id, type, prompt, answer, min, max, visual, extra) {
    var wrong = near(answer, 3, min, max, extra);
    return {
      id: id,
      type: type,
      prompt: prompt,
      answer: String(answer),
      options: [String(answer), String(wrong[0]), String(wrong[1]), String(wrong[2])],
      visual: visual || null
    };
  }

  function pad(n) {
    return n < 10 ? '0' + n : String(n);
  }

  var adds = [
    [0, 2], [0, 5], [0, 7], [0, 8], [0, 9],
    [1, 1], [1, 2], [1, 3], [1, 4], [1, 5], [1, 6], [1, 7], [1, 8], [1, 9],
    [2, 2], [2, 3], [2, 4], [2, 5], [2, 6], [2, 7], [2, 8],
    [3, 3], [3, 4], [3, 5], [3, 6], [3, 7],
    [4, 4], [4, 5], [4, 6],
    [5, 5], [6, 2], [6, 3], [6, 4], [7, 2], [7, 3], [8, 1], [8, 2], [9, 1], [4, 3], [5, 2], [5, 4]
  ];
  var bank1 = [];
  var seen = {};
  var i, a, b, sum, prompt, id;
  for (i = 0; i < adds.length; i++) {
    a = adds[i][0];
    b = adds[i][1];
    sum = a + b;
    if (sum > 10) continue;
    prompt = a + ' + ' + b + ' = ?';
    if (seen[prompt]) continue;
    seen[prompt] = 1;
    id = 'm1-' + pad(bank1.length + 1);
    bank1.push(make(id, 'add10', prompt, sum, 0, 10, { kind: 'dots', a: a, b: b, op: '+' }));
  }
  XT.banks['math-1'] = bank1;

  var mix = [
    ['+', 2, 5], ['+', 3, 6], ['+', 4, 4], ['+', 1, 8], ['+', 0, 6], ['+', 7, 2],
    ['+', 5, 5], ['+', 3, 3], ['+', 6, 4], ['+', 8, 2], ['+', 9, 0], ['+', 4, 2],
    ['+', 1, 6], ['+', 2, 8], ['+', 3, 7], ['+', 5, 3], ['+', 6, 1], ['+', 4, 5],
    ['-', 5, 2], ['-', 6, 1], ['-', 7, 3], ['-', 8, 4], ['-', 9, 2], ['-', 10, 3],
    ['-', 10, 5], ['-', 10, 7], ['-', 9, 4], ['-', 9, 6], ['-', 8, 3], ['-', 8, 5],
    ['-', 7, 2], ['-', 7, 5], ['-', 6, 3], ['-', 6, 6], ['-', 5, 5], ['-', 4, 1],
    ['-', 10, 1], ['-', 10, 8], ['-', 9, 3], ['-', 8, 8], ['-', 7, 4], ['-', 6, 2],
    ['-', 5, 1], ['-', 4, 4], ['-', 3, 2], ['-', 10, 4], ['-', 9, 5], ['-', 8, 2]
  ];
  var bank2 = [];
  seen = {};
  for (i = 0; i < mix.length; i++) {
    a = mix[i][1];
    b = mix[i][2];
    if (mix[i][0] === '+') {
      sum = a + b;
      if (sum > 10) continue;
      prompt = a + ' + ' + b + ' = ?';
      if (seen[prompt]) continue;
      seen[prompt] = 1;
      bank2.push(make('m2-' + pad(bank2.length + 1), 'mixAdd', prompt, sum, 0, 10, null));
    } else {
      sum = a - b;
      if (sum < 0 || a > 10) continue;
      prompt = a + ' - ' + b + ' = ?';
      if (seen[prompt]) continue;
      seen[prompt] = 1;
      bank2.push(make('m2-' + pad(bank2.length + 1), 'mixSub', prompt, sum, 0, 10, null));
    }
  }
  XT.banks['math-2'] = bank2;

  function carryWrong(sum) {
    return [sum - 10, sum - 1, sum + 1];
  }
  function borrowWrong(left, right, diff) {
    var tens = Math.floor(left / 10);
    var ones = left % 10;
    var mistake = tens * 10 + (right - ones);
    return [mistake, diff - 1, diff + 1];
  }

  var carries = [
    [9, 2], [9, 3], [9, 4], [9, 5], [9, 6], [9, 7], [9, 8], [9, 9],
    [8, 3], [8, 4], [8, 5], [8, 6], [8, 7], [8, 8], [8, 9],
    [7, 4], [7, 5], [7, 6], [7, 7], [7, 8], [7, 9],
    [6, 5], [6, 6], [6, 7], [6, 8], [6, 9],
    [5, 7], [5, 8], [5, 9], [4, 8], [4, 9], [3, 9]
  ];
  var borrows = [
    [11, 2], [11, 3], [11, 4], [11, 5], [11, 6], [11, 7], [11, 8], [11, 9],
    [12, 3], [12, 4], [12, 5], [12, 6], [12, 7], [12, 8], [12, 9],
    [13, 4], [13, 5], [13, 6], [13, 7], [13, 8], [13, 9],
    [14, 5], [14, 6], [14, 7], [14, 8], [14, 9],
    [15, 6], [15, 7], [15, 8], [15, 9],
    [16, 7], [16, 8], [16, 9],
    [17, 8], [17, 9],
    [18, 9]
  ];
  var bank3 = [];
  var wrong, diff;
  for (i = 0; i < carries.length; i++) {
    a = carries[i][0];
    b = carries[i][1];
    sum = a + b;
    wrong = carryWrong(sum);
    bank3.push({
      id: 'm3c-' + pad(i + 1),
      type: 'carry',
      prompt: a + ' + ' + b + ' = ?',
      answer: String(sum),
      options: [String(sum), String(wrong[0]), String(wrong[1]), String(wrong[2])],
      visual: null
    });
  }
  for (i = 0; i < borrows.length; i++) {
    a = borrows[i][0];
    b = borrows[i][1];
    diff = a - b;
    wrong = borrowWrong(a, b, diff);
    bank3.push({
      id: 'm3b-' + pad(i + 1),
      type: 'borrow',
      prompt: a + ' - ' + b + ' = ?',
      answer: String(diff),
      options: [String(diff), String(wrong[0]), String(wrong[1]), String(wrong[2])],
      visual: null
    });
  }
  XT.banks['math-3'] = bank3;
})(typeof GameGlobal !== 'undefined' ? GameGlobal : (typeof window !== 'undefined' ? window : this));