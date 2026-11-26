(function (g) {
  'use strict';
  var XT = g.XT;

  function subjectName(id) {
    return XT.catalog[id] ? XT.catalog[id].name : id;
  }

  XT.screens.social = {
    enter: function () {},
    update: function () {},
    render: function (ctx) {
      var y = 168;
      var friends = XT.demoFriends;
      var i, f, j, rowH, yy, ch, sent;
      ctx.fillStyle = '#FFF6E8';
      ctx.fillRect(0, 0, XT.W, XT.H);
      XT.ui.backButton(ctx, 28, function () { XT.nav.back(); });
      XT.ui.text(ctx, '好友进度', XT.W / 2, 62, { size: 44, align: 'center', weight: '800' });
      XT.ui.text(ctx, '预览里是示例好友，正式版只看微信好友', XT.W / 2, 112, {
        size: 22, align: 'center', color: XT.C.soft, weight: '700'
      });

      XT.ui.text(ctx, '我的进度', 40, y, { size: 28, weight: '800', color: XT.C.soft });
      y += 24;
      XT.ui.plate(ctx, {
        id: 'me-card', x: 32, y: y, w: 686, h: 132, r: 28,
        fill: '#FFFFFF', edge: '#E6D3BE', drop: 6
      });
      XT.ui.text(ctx, '数学 ' + XT.subjectStars('math') + '/' + XT.starMax('math') + ' 星', 64, y + 40, { size: 26, weight: '800' });
      XT.ui.text(ctx, '语文 ' + XT.subjectStars('chinese') + '/' + XT.starMax('chinese') + ' 星', 380, y + 40, { size: 26, weight: '800' });
      XT.ui.text(ctx, '英语 ' + XT.subjectStars('english') + '/' + XT.starMax('english') + ' 星', 64, y + 92, { size: 26, weight: '800' });
      XT.ui.text(ctx, '古诗词 ' + XT.poemDoneCount() + '/3 首', 380, y + 92, { size: 26, weight: '800' });
      y += 150;

      XT.ui.text(ctx, '微信好友', 40, y, { size: 28, weight: '800', color: XT.C.soft });
      y += 16;
      for (i = 0; i < friends.length; i++) {
        f = friends[i];
        rowH = 52 + f.done.length * 28;
        yy = y;
        XT.ui.plate(ctx, {
          id: 'friend-' + i, x: 32, y: yy, w: 686, h: rowH, r: 24,
          fill: '#FFFFFF', edge: '#E6D3BE', drop: 5
        });
        XT.draw.icon(ctx, f.face, 92, yy + 48, 64);
        XT.ui.text(ctx, f.name, 150, yy + 36, { size: 32, weight: '800' });
        for (j = 0; j < f.done.length; j++) {
          XT.ui.text(ctx, subjectName(f.done[j].subject) + ' 第' + f.done[j].level + '关', 150, yy + 68 + j * 28, {
            size: 24, color: XT.C.soft, weight: '700'
          });
          XT.draw.stars(ctx, 430, yy + 68 + j * 28, f.done[j].stars, 14, 6);
        }
        y += rowH + 14;
      }

      XT.ui.text(ctx, '收到的挑战', 40, y + 8, { size: 28, weight: '800', color: XT.C.soft });
      y += 44;
      for (i = 0; i < XT.demoChallenges.length; i++) {
        ch = XT.demoChallenges[i];
        XT.ui.plate(ctx, {
          id: 'ch-' + i, x: 32, y: y, w: 686, h: 104, r: 24,
          fill: '#FFFFFF', edge: '#6BB6E0',
          onTap: (function (item) {
            return function () { XT.nav.go('challenge', { challenge: item }); };
          })(ch)
        });
        var pressed = XT.input.downId === 'ch-' + i;
        var dy = y + (pressed ? 5 : 0);
        XT.ui.text(ctx, ch.from + ' 向你挑战', 60, dy + 40, { size: 30, weight: '800' });
        XT.ui.text(ctx, subjectName(ch.subject) + ' · ' + ch.prompt, 60, dy + 82, {
          size: 24, color: XT.C.soft, weight: '700'
        });
        XT.ui.text(ctx, '接受', 620, dy + 58, { size: 28, align: 'center', color: '#2E8FD6', weight: '800' });
        y += 116;
      }

      sent = XT.save.data.sent || [];
      if (sent.length) {
        XT.ui.text(ctx, '我发出的挑战：' + sent[0].prompt, 40, y + 10, {
          size: 24, color: XT.C.soft, weight: '700'
        });
        y += 40;
      }

      if (y < 1220) y = 1220;
      XT.ui.button(ctx, {
        id: 'reset-progress', x: 180, y: Math.min(y, 1236), w: 390, h: 64,
        label: '清除本机进度', fill: '#FFFFFF', edge: '#E6D3BE', size: 26, drop: 4,
        onTap: function () { XT.overlay = { type: 'reset' }; }
      });
    }
  };
})(typeof GameGlobal !== 'undefined' ? GameGlobal : (typeof window !== 'undefined' ? window : this));
