(function (g) {
  'use strict';
  var XT = g.XT;

  XT.screens.unlock = {
    enter: function (params) {
      this.subjectId = params.subject || 'math';
    },
    update: function () {},
    render: function (ctx) {
      var sub = XT.catalog[this.subjectId];
      var self = this;
      var mathOn = XT.save.unlocked('math');
      var zhOn = XT.save.unlocked('chinese');
      var enOn = XT.save.unlocked('english');
      var thisOn = XT.save.unlocked(this.subjectId);
      ctx.fillStyle = '#FFF6E8';
      ctx.fillRect(0, 0, XT.W, XT.H);
      XT.ui.backButton(ctx, 36, function () { XT.nav.back(); });
      XT.ui.text(ctx, '解锁更多关卡', XT.W / 2, 78, { size: 44, align: 'center', weight: '800' });
      XT.draw.rabbit(ctx, 375, 280, { scale: 1.5, time: XT.runtime.time, mood: 'idle' });
      XT.ui.text(ctx, '前 3 关免费。', XT.W / 2, 360, { size: 32, align: 'center', weight: '800' });
      XT.ui.text(ctx, '解锁后，这个科目以后的新关卡都能玩。', XT.W / 2, 410, {
        size: 26, align: 'center', color: XT.C.soft, weight: '700'
      });
      XT.ui.text(ctx, '没有倒计时，也不会弹出广告。', XT.W / 2, 452, {
        size: 26, align: 'center', color: XT.C.soft, weight: '700'
      });

      XT.ui.plate(ctx, {
        id: 'buy-subject',
        x: 40, y: 520, w: 670, h: 180, r: 32,
        fill: thisOn ? '#F4F1EA' : '#FFFFFF',
        edge: thisOn ? '#E6D3BE' : sub.edge,
        onTap: thisOn ? null : function () {
          XT.overlay = {
            type: 'pay',
            product: {
              id: self.subjectId,
              subject: self.subjectId,
              name: '永久解锁「' + sub.name + '」',
              price: XT.PRICE.subject
            }
          };
        }
      });
      var py = 520 + (XT.input.downId === 'buy-subject' && !thisOn ? 5 : 0);
      XT.ui.text(ctx, '只解锁' + sub.name, 80, py + 60, { size: 36, weight: '800' });
      XT.ui.text(ctx, thisOn ? '已经解锁' : ('永久 · ' + XT.PRICE.subject + ' 元'), 80, py + 116, {
        size: 28, color: thisOn ? sub.color : XT.C.soft, weight: '700'
      });

      var allOn = mathOn && zhOn && enOn;
      XT.ui.plate(ctx, {
        id: 'buy-bundle',
        x: 40, y: 730, w: 670, h: 200, r: 32,
        fill: allOn ? '#F4F1EA' : '#FFF8E0',
        edge: allOn ? '#E6D3BE' : '#E6B423',
        onTap: allOn ? null : function () {
          XT.overlay = {
            type: 'pay',
            product: {
              id: 'bundle',
              name: '数学、语文、英语一起解锁',
              price: XT.PRICE.bundle
            }
          };
        }
      });
      var by = 730 + (XT.input.downId === 'buy-bundle' && !allOn ? 5 : 0);
      XT.ui.text(ctx, '三科一起', 80, by + 58, { size: 36, weight: '800' });
      XT.ui.text(ctx, '数学 + 语文 + 英语', 80, by + 108, { size: 26, color: XT.C.soft, weight: '700' });
      XT.ui.text(ctx, allOn ? '已经全部解锁' : ('永久 · ' + XT.PRICE.bundle + ' 元'), 80, by + 152, {
        size: 28, color: '#C47A2A', weight: '800'
      });

      XT.ui.text(ctx, '古诗词不单独收费。支付尚未接入，预览里只做模拟。', XT.W / 2, 1000, {
        size: 24, align: 'center', color: XT.C.soft, weight: '700'
      });
      XT.ui.button(ctx, {
        id: 'unlock-back', x: 40, y: 1080, w: 670, h: 110,
        label: '返回', fill: '#FFFFFF', edge: '#E6D3BE', size: 36,
        onTap: function () { XT.nav.back(); }
      });
    }
  };
})(typeof GameGlobal !== 'undefined' ? GameGlobal : (typeof window !== 'undefined' ? window : this));