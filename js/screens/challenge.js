(function (g) {
  'use strict';
  var XT = g.XT;

  XT.screens.challenge = {
    enter: function (params) {
      var q = params.challenge;
      this.q = q;
      this.options = XT.rand.shuffle(q.options.map(function (text) {
        return { text: text, correct: text === q.answer };
      }));
      this.phase = 'ask';
      this.flash = -1;
      this.flashKind = '';
      this.shake = 0;
      this.cheer = '';
    },
    update: function (dt) {
      this.shake = Math.max(0, this.shake - dt * 2.2);
    },
    render: function (ctx) {
      var self = this;
      var sub = XT.catalog[this.q.subject];
      ctx.fillStyle = sub.soft;
      ctx.fillRect(0, 0, XT.W, XT.H);
      if (this.shake > 0) ctx.translate(Math.sin(XT.runtime.time * 55) * 8 * this.shake, 0);
      XT.ui.backButton(ctx, 28, function () { XT.nav.back(); });
      XT.ui.text(ctx, this.q.from + '的挑战', XT.W / 2, 64, { size: 40, align: 'center', weight: '800' });
      XT.ui.text(ctx, '在你自己的手机上答这一题', XT.W / 2, 114, {
        size: 26, align: 'center', color: XT.C.soft, weight: '700'
      });
      XT.draw.rabbit(ctx, 180, 300, {
        scale: 1.2,
        time: XT.runtime.time,
        mood: this.phase === 'done' ? 'cheer' : 'idle'
      });
      XT.widgets.questionCard(ctx, this.q, { x: 28, y: 340, w: 694, h: this.q.visual ? 300 : 200 });
      if (this.cheer) XT.widgets.banner(ctx, this.cheer, 480, 320);
      if (this.phase === 'done') {
        XT.ui.text(ctx, '你答对了，和小伙伴一样棒', XT.W / 2, 700, {
          size: 32, align: 'center', weight: '800'
        });
        XT.ui.button(ctx, {
          id: 'ch-back', x: 40, y: 800, w: 670, h: 120,
          label: '返回好友', fill: '#B6F0B4', edge: '#73C98A', size: 40,
          onTap: function () { XT.nav.back(); }
        });
        return;
      }
      XT.ui.optionGrid(ctx, {
        options: this.options,
        y: this.q.visual ? 680 : 580,
        bh: this.q.visual ? 200 : 220,
        flash: this.flash,
        flashKind: this.flashKind,
        onPick: function (opt, idx) {
          if (self.phase !== 'ask') return;
          self.flash = idx;
          if (opt.correct) {
            self.phase = 'done';
            self.flashKind = 'good';
            self.cheer = '你答对了！';
            XT.sfx.correct();
            XT.fx.burst(375, 500, '#FFD15C', 14);
          } else {
            self.flashKind = 'bad';
            self.shake = 1;
            self.cheer = '再试一次';
            XT.sfx.wrong();
          }
        }
      });
    }
  };
})(typeof GameGlobal !== 'undefined' ? GameGlobal : (typeof window !== 'undefined' ? window : this));