(function (g) {
  'use strict';
  var XT = g.XT;

  XT.screens.levels = {
    enter: function (params) {
      this.subject = XT.catalog[params.subject];
    },
    update: function () {},
    render: function (ctx) {
      var sub = this.subject;
      var levels = sub.levels;
      var i, lv, y, pressed, drawY, stars, soon;
      ctx.fillStyle = sub.soft;
      ctx.fillRect(0, 0, XT.W, XT.H);
      ctx.fillStyle = sub.color;
      ctx.fillRect(0, 0, XT.W, 16);
      XT.ui.backButton(ctx, 36, function () { XT.nav.back(); });
      XT.ui.text(ctx, sub.name, XT.W / 2, 70, { size: 48, align: 'center', weight: '800' });
      XT.ui.text(ctx, sub.blurb, XT.W / 2, 156, {
        size: 24, align: 'center', color: XT.C.soft, weight: '700'
      });

      for (i = 0; i < levels.length; i++) {
        lv = levels[i];
        y = 190 + i * 132;
        stars = XT.save.stars(sub.id, lv.id);
        soon = !lv.bank;
        XT.ui.plate(ctx, {
          id: 'level-' + lv.id,
          x: 32,
          y: y,
          w: 686,
          h: 114,
          r: 28,
          fill: '#FFFFFF',
          edge: soon ? '#E6D3BE' : sub.edge,
          onTap: (function (level) {
            return function () {
              if (!level.bank) {
                XT.toast.show('这一关马上就到');
                return;
              }
              XT.nav.go('track', { subject: sub.id, level: level.id });
            };
          })(lv)
        });
        pressed = XT.input.downId === 'level-' + lv.id;
        drawY = y + (pressed ? 5 : 0);
        ctx.fillStyle = soon ? '#F3EBE1' : sub.soft;
        ctx.beginPath();
        ctx.arc(96, drawY + 57, 32, 0, Math.PI * 2);
        ctx.fill();
        XT.ui.text(ctx, String(lv.id), 96, drawY + 58, {
          size: 32, align: 'center', weight: '800', color: soon ? '#A89888' : sub.color
        });
        XT.ui.text(ctx, lv.title, 150, drawY + 40, { size: 34, weight: '800', color: soon ? '#8A7B70' : XT.C.ink });
        XT.ui.text(ctx, lv.subtitle, 150, drawY + 80, {
          size: 24, color: XT.C.soft, weight: '700'
        });
        if (soon) {
          XT.ui.text(ctx, '即将更新', 560, drawY + 58, { size: 24, align: 'center', color: sub.color, weight: '800' });
        } else XT.draw.stars(ctx, 548, drawY + 58, stars, 22, 8);
      }
    }
  };
})(typeof GameGlobal !== 'undefined' ? GameGlobal : (typeof window !== 'undefined' ? window : this));
