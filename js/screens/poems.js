(function (g) {
  'use strict';
  var XT = g.XT;

  XT.screens.poems = {
    enter: function () {},
    update: function () {},
    render: function (ctx) {
      var poems = XT.poems;
      var i, poem, y, pressed, drawY, done;
      ctx.fillStyle = '#EEE9FF';
      ctx.fillRect(0, 0, XT.W, XT.H);
      ctx.fillStyle = '#5C4DB5';
      ctx.fillRect(0, 0, XT.W, 16);
      XT.ui.backButton(ctx, 36, function () { XT.nav.back(); });
      XT.ui.text(ctx, '古诗词', XT.W / 2, 70, { size: 48, align: 'center', weight: '800' });
      XT.ui.text(ctx, '选一首，跟着兔兔走进诗里', XT.W / 2, 124, {
        size: 26, align: 'center', color: XT.C.soft, weight: '700'
      });
      for (i = 0; i < poems.length; i++) {
        poem = poems[i];
        y = 180 + i * 240;
        done = !!(XT.save.data.poem && XT.save.data.poem[poem.id]);
        XT.ui.plate(ctx, {
          id: 'poem-' + poem.id,
          x: 36,
          y: y,
          w: 678,
          h: 200,
          r: 36,
          fill: '#FFFFFF',
          edge: '#4638A0',
          onTap: (function (item) {
            return function () {
              XT.nav.go('poem', { id: item.id });
            };
          })(poem)
        });
        pressed = XT.input.downId === 'poem-' + poem.id;
        drawY = y + (pressed ? 5 : 0);
        XT.ui.text(ctx, poem.title, 80, drawY + 64, { size: 48, weight: '800' });
        XT.ui.text(ctx, poem.dynasty + ' · ' + poem.author, 80, drawY + 116, {
          size: 28, color: XT.C.soft, weight: '700'
        });
        if (done) {
          XT.ui.text(ctx, '已学完', 560, drawY + 88, {
            size: 28, align: 'center', color: '#5C4DB5', weight: '800'
          });
        }
      }
    }
  };
})(typeof GameGlobal !== 'undefined' ? GameGlobal : (typeof window !== 'undefined' ? window : this));
