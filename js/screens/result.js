(function (g) {
  'use strict';
  var XT = g.XT;

  XT.screens.result = {
    t: 0,
    enter: function (params) {
      this.t = 0;
      if (params.won && !params.saved) {
        var rec = XT.save.record(params.subject, params.levelId, params.stars);
        params.best = rec.best;
        params.improved = rec.improved;
        params.saved = true;
        XT.sfx.win();
        XT.fx.burst(375, 430, '#FFD15C', 16);
        XT.fx.burst(375, 430, '#FF8FB8', 12);
        XT.fx.burst(375, 430, '#7EC8F0', 12);
      }
    },
    update: function (dt) { this.t += dt; },
    render: function (ctx, page) {
      var p = page.params;
      var sub = XT.catalog[p.subject];
      var level = XT.levelById(p.subject, p.levelId);
      var self = this;
      ctx.fillStyle = sub.soft;
      ctx.fillRect(0, 0, XT.W, XT.H);
      XT.draw.rabbit(ctx, 375, 430, {
        scale: 2.15,
        time: XT.runtime.time,
        mood: p.won ? 'cheer' : 'sad'
      });
      XT.ui.text(ctx, p.won ? '兔兔到达终点啦' : '再陪兔兔跑一次', XT.W / 2, 500, {
        size: 48, align: 'center', weight: '800'
      });
      XT.ui.text(ctx, sub.name + ' · ' + level.title, XT.W / 2, 560, {
        size: 28, align: 'center', color: XT.C.soft, weight: '700'
      });
      if (p.won) {
        var i, appear;
        for (i = 0; i < 3; i++) {
          appear = Math.min(1, Math.max(0, (self.t - i * 0.12) / 0.22));
          XT.draw.star(ctx, 300 + i * 76, 640, 16 + appear * 14, i < p.stars);
        }
        XT.ui.text(ctx, p.mistakes === 0 ? '一次都没答错' : ('答错 ' + p.mistakes + ' 次，还剩 ' + p.lives + ' 颗心'), XT.W / 2, 710, {
          size: 28, align: 'center', color: XT.C.soft, weight: '700'
        });
      } else {
        XT.ui.text(ctx, '小心心用完了，兔兔还在半路', XT.W / 2, 640, {
          size: 30, align: 'center', color: XT.C.soft, weight: '700'
        });
      }

      XT.ui.button(ctx, {
        id: 'replay', x: 40, y: p.won ? 780 : 760, w: p.won ? 320 : 670, h: 110,
        label: '再玩一次', fill: '#FFFFFF', edge: sub.edge, size: 36,
        onTap: function () {
          XT.nav.replace('track', { subject: p.subject, level: p.levelId });
        }
      });
      if (p.won) {
        XT.ui.button(ctx, {
          id: 'next', x: 390, y: 780, w: 320, h: 110,
          label: '下一关', fill: sub.color, edge: sub.edge, textColor: '#FFFFFF', size: 36,
          onTap: function () {
            var next = XT.nextLevel(p.subject, p.levelId);
            if (!next) {
              XT.toast.show('这一科的关卡玩完啦');
              return;
            }
            if (!next.bank) {
              XT.toast.show('下一关马上就到');
              return;
            }
            XT.nav.replace('track', { subject: p.subject, level: next.id });
          }
        });
        XT.ui.button(ctx, {
          id: 'share', x: 40, y: 916, w: 320, h: 100,
          label: '分享成绩', fill: '#FFE38A', edge: '#E6B423', size: 32,
          onTap: function () { XT.openShare(p, sub, level); }
        });
      }
      XT.ui.button(ctx, {
        id: 'challenge', x: p.won ? 390 : 40, y: p.won ? 916 : 896, w: p.won ? 320 : 670, h: 100,
        label: '向好友挑战', fill: '#A9E2FF', edge: '#6BB6E0', size: 32,
        onTap: function () {
          if (!p.question) return;
          XT.overlay = {
            type: 'challenge',
            subject: p.subject,
            levelTitle: sub.name + ' · ' + level.title,
            prompt: p.question.prompt
          };
        }
      });
      XT.ui.button(ctx, {
        id: 'back-levels', x: 40, y: 1160, w: 670, h: 110,
        label: '返回关卡', fill: '#FFFFFF', edge: '#E6D3BE', size: 36,
        onTap: function () { XT.nav.back(); }
      });
    }
  };

  XT.openShare = function (p, sub, level) {
    var text = '我在「小兔快跑」完成了' + sub.name + '「' + level.title + '」，得到 ' + p.stars + ' 颗星。一起来跑吧！';
    XT.overlay = {
      type: 'share',
      step: 'card',
      payload: {
        title: '我在小兔快跑得到了' + p.stars + '颗星',
        text: text,
        query: 'subject=' + p.subject + '&level=' + p.levelId + '&stars=' + p.stars,
        stars: p.stars,
        levelTitle: sub.name + ' · ' + level.title
      }
    };
  };
})(typeof GameGlobal !== 'undefined' ? GameGlobal : (typeof window !== 'undefined' ? window : this));