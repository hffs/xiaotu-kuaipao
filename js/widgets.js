(function (g) {
  'use strict';
  var XT = g.XT;

  function drawCluster(ctx, icon, n, cx, cy, size) {
    var cols = n > 12 ? 6 : (n > 6 ? 5 : n);
    var gap = size + 6;
    var rows = Math.ceil(n / cols);
    var i, col, row;
    var startX = cx - (Math.min(n, cols) - 1) * gap / 2;
    var startY = cy - (rows - 1) * gap / 2;
    for (i = 0; i < n; i++) {
      col = i % cols;
      row = Math.floor(i / cols);
      XT.draw.icon(ctx, icon, startX + col * gap, startY + row * gap, size);
    }
  }

  function wrapCenter(ctx, text, cx, midY, maxW, size) {
    var lines = [];
    var line = '';
    var i;
    var ch;
    ctx.font = '800 ' + size + 'px ' + XT.FONT;
    for (i = 0; i < text.length; i++) {
      ch = line + text.charAt(i);
      if (ctx.measureText(ch).width > maxW && line) {
        lines.push(line);
        line = text.charAt(i);
      } else {
        line = ch;
      }
    }
    if (line) lines.push(line);
    var start = midY - ((lines.length - 1) * (size + 14)) / 2;
    for (i = 0; i < lines.length; i++) {
      XT.ui.text(ctx, lines[i], cx, start + i * (size + 14), {
        size: size, align: 'center', weight: '800'
      });
    }
  }

  XT.widgets = {
    questionCard: function (ctx, q, rect) {
      var cx = rect.x + rect.w / 2;
      ctx.fillStyle = 'rgba(160, 110, 70, 0.1)';
      XT.ui.roundRect(ctx, rect.x, rect.y + 8, rect.w, rect.h, 44);
      ctx.fill();
      ctx.fillStyle = '#FFFDF8';
      XT.ui.roundRect(ctx, rect.x, rect.y, rect.w, rect.h, 44);
      ctx.fill();
      ctx.save();
      XT.ui.roundRect(ctx, rect.x, rect.y, rect.w, rect.h, 44);
      ctx.clip();
      ctx.translate(rect.x, rect.y);
      if (XT.draw.felt) XT.draw.felt(ctx, rect.w, rect.h);
      ctx.restore();
      ctx.strokeStyle = '#F4E2CC';
      ctx.lineWidth = 6;
      XT.ui.roundRect(ctx, rect.x + 8, rect.y + 8, rect.w - 16, rect.h - 16, 36);
      ctx.stroke();
      if (!q) return;
      if (q.visual && q.visual.kind === 'icon') {
        XT.draw.icon(ctx, q.visual.name, cx, rect.y + 112, 156);
        XT.ui.text(ctx, q.prompt, cx, rect.y + rect.h - 40, {
          size: 34, align: 'center', color: XT.C.soft, weight: '700'
        });
      } else if (q.visual && q.visual.kind === 'char') {
        XT.ui.text(ctx, q.visual.char, cx, rect.y + 112, {
          size: 128, align: 'center', weight: '800', color: XT.C.ink
        });
        XT.ui.text(ctx, q.prompt, cx, rect.y + rect.h - 40, {
          size: 32, align: 'center', color: XT.C.soft, weight: '700'
        });
      } else if (q.visual && q.visual.kind === 'color') {
        ctx.fillStyle = '#F3F0EA';
        ctx.beginPath();
        ctx.arc(cx, rect.y + 112, 78, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = q.visual.color;
        ctx.beginPath();
        ctx.arc(cx, rect.y + 112, 64, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(58,51,68,0.18)';
        ctx.lineWidth = 4;
        ctx.stroke();
        XT.ui.text(ctx, q.prompt, cx, rect.y + rect.h - 40, {
          size: 34, align: 'center', color: XT.C.soft, weight: '700'
        });
      } else if (q.visual && q.visual.kind === 'dots') {
        XT.ui.text(ctx, q.prompt, cx, rect.y + 70, {
          size: 64, align: 'center', weight: '800'
        });
        XT.draw.dotSum(ctx, cx, rect.y + 160, q.visual);
      } else if (q.visual && q.visual.kind === 'count') {
        drawCluster(ctx, q.visual.icon, q.visual.n, cx, rect.y + 118, q.visual.n > 12 ? 40 : 52);
        XT.ui.text(ctx, q.prompt, cx, rect.y + rect.h - 36, {
          size: 32, align: 'center', color: XT.C.soft, weight: '700'
        });
      } else if (q.visual && q.visual.kind === 'compare') {
        drawCluster(ctx, q.visual.leftIcon, q.visual.leftN, rect.x + 170, rect.y + 100, 40);
        drawCluster(ctx, q.visual.rightIcon, q.visual.rightN, rect.x + rect.w - 170, rect.y + 100, 40);
        XT.ui.text(ctx, '左边', rect.x + 170, rect.y + 176, { size: 26, align: 'center', color: XT.C.soft, weight: '800' });
        XT.ui.text(ctx, '右边', rect.x + rect.w - 170, rect.y + 176, { size: 26, align: 'center', color: XT.C.soft, weight: '800' });
        XT.ui.text(ctx, q.prompt, cx, rect.y + rect.h - 36, {
          size: 32, align: 'center', color: XT.C.ink, weight: '800'
        });
      } else if (q.visual && q.visual.kind === 'pinyin') {
        XT.ui.text(ctx, q.visual.text, cx, rect.y + 118, {
          size: 84, align: 'center', weight: '800', color: '#1F8F86', font: XT.FONT
        });
        XT.ui.text(ctx, q.prompt, cx, rect.y + rect.h - 40, {
          size: 32, align: 'center', color: XT.C.soft, weight: '700'
        });
      } else if (q.visual && q.visual.kind === 'story') {
        wrapCenter(ctx, q.prompt, cx, rect.y + rect.h / 2, rect.w - 80, 40);
      } else {
        XT.ui.text(ctx, q.prompt, cx, rect.y + rect.h / 2 + 2, {
          size: 68, align: 'center', weight: '800'
        });
      }
    },
    banner: function (ctx, text, cx, cy) {
      var w, gentle;
      if (!text) return;
      gentle = text.indexOf('再试') >= 0 || text.indexOf('小心') >= 0;
      w = Math.min(460, text.length * 36 + 80);
      ctx.fillStyle = gentle ? 'rgba(255, 244, 238, 0.96)' : 'rgba(255, 252, 246, 0.97)';
      XT.ui.roundRect(ctx, cx - w / 2, cy - 32, w, 64, 32);
      ctx.fill();
      if (!gentle && XT.draw && XT.draw.heart) {
        XT.draw.heart(ctx, cx - w / 2 + 28, cy, 22, true);
        XT.draw.heart(ctx, cx + w / 2 - 28, cy, 22, true);
      }
      XT.ui.text(ctx, text, cx, cy + 1, {
        size: 32, align: 'center', weight: '800', color: gentle ? '#B18478' : '#E07A4A'
      });
    }
  };
})(typeof GameGlobal !== 'undefined' ? GameGlobal : (typeof window !== 'undefined' ? window : this));