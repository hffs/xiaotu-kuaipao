(function (g) {
  'use strict';
  var XT = g.XT;

  function subjectIds() {
    var ids = [];
    var k;
    for (k in XT.catalog) {
      if (Object.prototype.hasOwnProperty.call(XT.catalog, k) && XT.catalog[k] && XT.catalog[k].name) {
        ids.push(k);
      }
    }
    return ids;
  }

  function clamp(v, a, b) {
    if (v < a) return a;
    if (v > b) return b;
    return v;
  }

  function badge(ctx, x, y, color, kind, name) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, 36, 0, Math.PI * 2);
    ctx.fill();
    if (kind === 'math') {
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 8;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(x - 14, y);
      ctx.lineTo(x + 14, y);
      ctx.moveTo(x, y - 14);
      ctx.lineTo(x, y + 14);
      ctx.stroke();
    } else if (kind === 'chinese') {
      XT.ui.text(ctx, '字', x, y + 2, { size: 36, color: '#FFFFFF', align: 'center', weight: '800' });
    } else if (kind === 'english') {
      XT.ui.text(ctx, 'A', x, y + 2, { size: 36, color: '#FFFFFF', align: 'center', weight: '800', font: XT.FONT_EN });
    } else if (kind === 'poem') {
      ctx.fillStyle = '#FFF6C8';
      ctx.beginPath();
      ctx.arc(x - 2, y + 2, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x + 6, y - 2, 12, 0, Math.PI * 2);
      ctx.fill();
    } else {
      XT.ui.text(ctx, name ? name.charAt(0) : '·', x, y + 2, {
        size: 36, color: '#FFFFFF', align: 'center', weight: '800'
      });
    }
  }

  XT.screens.home = {
    scroll: 0,
    maxScroll: 0,
    enter: function () {
      this.scroll = 0;
    },
    update: function () {},
    onDrag: function (dx, dy) {
      this.scroll = clamp(this.scroll - dy, 0, this.maxScroll);
    },
    onWheel: function (delta) {
      this.scroll = clamp(this.scroll + delta, 0, this.maxScroll);
    },
    render: function (ctx) {
      var time = XT.runtime.time;
      var ids = subjectIds();
      var cols = 2;
      var pad = 28;
      var gap = 18;
      var tileW = (XT.W - pad * 2 - gap) / cols;
      var tileH = 268;
      var rows = Math.ceil(ids.length / cols);
      var gridTop = 524;
      var gridBottom = 1196;
      var contentH = rows * tileH + (rows > 1 ? (rows - 1) * gap : 0);
      var viewH = gridBottom - gridTop;
      var i, id, sub, col, row, x, y, pressed, drawY, stars, done;
      this.maxScroll = Math.max(0, contentH - viewH);
      this.scroll = clamp(this.scroll, 0, this.maxScroll);

      ctx.fillStyle = XT.C.cream;
      ctx.fillRect(0, 0, XT.W, XT.H);
      var sky = ctx.createLinearGradient(0, 0, 0, 430);
      sky.addColorStop(0, '#8FD3FF');
      sky.addColorStop(0.62, '#E7F7FF');
      sky.addColorStop(1, '#FFF6E8');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, XT.W, 430);
      XT.draw.sun(ctx, 620, 92, 36, time);
      XT.draw.cloud(ctx, 70 + Math.sin(time * 0.4) * 14, 72, 0.9);
      XT.draw.cloud(ctx, 240, 118, 0.6);
      XT.draw.hill(ctx, -30, 190, 480, 160, '#C5EEB0');
      XT.draw.hill(ctx, 180, 220, 640, 150, '#8ED67A');
      XT.draw.hill(ctx, -40, 270, 860, 160, '#67C56A');
      XT.draw.flower(ctx, 86, 360, 0.85, '#FF8FB8', '#FFD15C');
      XT.draw.flower(ctx, 640, 372, 0.75, '#C4A1FF', '#FFFFFF');
      XT.draw.tree(ctx, 78, 340, 0.58, '#3FA96A');
      XT.draw.petals(ctx, XT.W, 340, time, ['#FFD0E0', '#FFF4C4', '#FFFFFF']);
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, XT.W, 400);
      ctx.clip();
      XT.draw.felt(ctx, XT.W, 400);
      ctx.restore();
      XT.draw.rabbit(ctx, 390, 368, { scale: 1.48, time: time, mood: 'wave' });
      XT.ui.text(ctx, '小兔快跑', XT.W / 2, 448, { size: 64, align: 'center', weight: '800' });
      XT.ui.text(ctx, '答对一题，兔兔就向前跑一步', XT.W / 2, 496, {
        size: 26, align: 'center', color: XT.C.soft, weight: '700'
      });

      ctx.save();
      ctx.beginPath();
      ctx.rect(0, gridTop, XT.W, viewH);
      ctx.clip();
      for (i = 0; i < ids.length; i++) {
        id = ids[i];
        sub = XT.catalog[id];
        col = i % cols;
        row = Math.floor(i / cols);
        x = pad + col * (tileW + gap);
        y = gridTop + row * (tileH + gap) - this.scroll;
        XT.ui.plate(ctx, {
          id: 'home-' + id,
          x: x,
          y: y,
          w: tileW,
          h: tileH,
          r: 36,
          fill: '#FFFDF8',
          edge: sub.edge,
          clipTop: gridTop,
          clipBottom: gridBottom,
          onTap: (function (sid) {
            return function () {
              if (sid === 'poem') XT.nav.go('poems');
              else XT.nav.go('levels', { subject: sid });
            };
          })(id)
        });
        pressed = XT.input.downId === 'home-' + id;
        drawY = y + (pressed ? 5 : 0);
        badge(ctx, x + tileW / 2, drawY + 78, sub.color, id, sub.name);
        XT.ui.text(ctx, sub.name, x + tileW / 2, drawY + 142, {
          size: 40, align: 'center', weight: '800'
        });
        XT.ui.text(ctx, sub.tag || '', x + tileW / 2, drawY + 184, {
          size: 24, align: 'center', color: XT.C.soft, weight: '700'
        });
        if (id === 'poem') {
          done = XT.poemDoneCount();
          XT.ui.text(ctx, done + '/3 首', x + tileW / 2, drawY + 226, {
            size: 26, align: 'center', color: sub.color, weight: '800'
          });
        } else if (sub.levels && sub.levels.length) {
          stars = XT.subjectStars(id);
          XT.ui.text(ctx, stars + '/' + XT.starMax(id) + ' 星', x + tileW / 2, drawY + 226, {
            size: 26, align: 'center', color: sub.color, weight: '800'
          });
        }
      }
      ctx.restore();

      if (this.maxScroll > 2 && this.scroll < this.maxScroll - 2) {
        var fade = ctx.createLinearGradient(0, gridBottom - 36, 0, gridBottom);
        fade.addColorStop(0, 'rgba(255,248,242,0)');
        fade.addColorStop(1, 'rgba(255,248,242,0.95)');
        ctx.fillStyle = fade;
        ctx.fillRect(0, gridBottom - 36, XT.W, 36);
      }

      XT.ui.button(ctx, {
        id: 'home-friends',
        x: 32,
        y: 1216,
        w: 686,
        h: 86,
        label: '好友进度',
        fill: '#FFFFFF',
        edge: '#E6D3BE',
        size: 34,
        onTap: function () { XT.nav.go('social'); }
      });
    }
  };
})(typeof GameGlobal !== 'undefined' ? GameGlobal : (typeof window !== 'undefined' ? window : this));