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

  function badge(ctx, x, y, r, color, kind, name) {
    var arm = Math.round(r * 0.38);
    var moon = r * 0.39;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    if (kind === 'math') {
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = Math.max(6, Math.round(r * 0.22));
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(x - arm, y);
      ctx.lineTo(x + arm, y);
      ctx.moveTo(x, y - arm);
      ctx.lineTo(x, y + arm);
      ctx.stroke();
    } else if (kind === 'chinese') {
      XT.ui.text(ctx, '字', x, y + 2, { size: Math.round(r), color: '#FFFFFF', align: 'center', weight: '800' });
    } else if (kind === 'english') {
      XT.ui.text(ctx, 'A', x, y + 2, { size: Math.round(r), color: '#FFFFFF', align: 'center', weight: '800', font: XT.FONT_EN });
    } else if (kind === 'poem') {
      ctx.fillStyle = '#FFF6C8';
      ctx.beginPath();
      ctx.arc(x - r * 0.06, y + r * 0.06, moon, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x + r * 0.16, y - r * 0.06, moon * 0.86, 0, Math.PI * 2);
      ctx.fill();
    } else {
      XT.ui.text(ctx, name ? name.charAt(0) : '·', x, y + 2, {
        size: Math.round(r), color: '#FFFFFF', align: 'center', weight: '800'
      });
    }
  }

  function tileMetrics(h) {
    var badgeR = h >= 300 ? 40 : (h >= 270 ? 36 : 32);
    var nameSize = h >= 300 ? 42 : 40;
    var tagSize = 24;
    var statSize = h >= 300 ? 28 : 26;
    var g1 = h >= 300 ? 18 : 14;
    var g2 = 10;
    var g3 = 12;
    var block = badgeR * 2 + g1 + nameSize + g2 + tagSize + g3 + statSize;
    var top = (h - block) / 2;
    var badgeY;
    var nameY;
    var tagY;
    var statY;
    if (top < 18) top = 18;
    badgeY = top + badgeR;
    nameY = badgeY + badgeR + g1 + nameSize / 2;
    tagY = nameY + nameSize / 2 + g2 + tagSize / 2;
    statY = tagY + tagSize / 2 + g3 + statSize / 2;
    return {
      badgeR: badgeR,
      badgeY: badgeY,
      nameY: nameY,
      tagY: tagY,
      statY: statY,
      nameSize: nameSize,
      tagSize: tagSize,
      statSize: statSize
    };
  }

  function friendList() {
    return XT.demoFriends || [];
  }

  function friendSubtitle(list) {
    var lead, last, sub, subjectName;
    if (!list.length) return '还没有小朋友一起来跑';
    lead = list[0];
    if (lead.done && lead.done.length) {
      last = lead.done[lead.done.length - 1];
      sub = XT.catalog[last.subject];
      subjectName = sub && sub.name ? sub.name : '';
      if (list.length === 1) return (lead.name || '好友') + ' ' + subjectName + ' ' + last.stars + ' 星';
      return (lead.name || '好友') + ' ' + subjectName + ' ' + last.stars + ' 星 · 共 ' + list.length + ' 位';
    }
    if (list.length === 1) return (lead.name || '好友') + ' 在一起跑';
    return '共 ' + list.length + ' 位小朋友';
  }

  function plushDisc(ctx, x, y, r, fill, edge) {
    ctx.fillStyle = edge;
    ctx.beginPath();
    ctx.arc(x, y + 3, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    ctx.beginPath();
    ctx.ellipse(x - r * 0.28, y - r * 0.32, r * 0.28, r * 0.16, -0.6, 0, Math.PI * 2);
    ctx.fill();
  }

  function emptyFriendMark(ctx, cx, cy) {
    plushDisc(ctx, cx - 18, cy, 28, '#FFE4EE', '#F3C2D4');
    plushDisc(ctx, cx + 16, cy, 28, '#E3F4FF', '#C5E2F6');
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(cx + 34, cy + 18, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#FF8FB8';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx + 34 - 7, cy + 18);
    ctx.lineTo(cx + 34 + 7, cy + 18);
    ctx.moveTo(cx + 34, cy + 18 - 7);
    ctx.lineTo(cx + 34, cy + 18 + 7);
    ctx.stroke();
  }

  function friendCluster(ctx, list, slotX, slotW, cy) {
    var n, i, size, step, width, start, face;
    if (!list.length) {
      emptyFriendMark(ctx, slotX + slotW / 2 - 4, cy);
      return;
    }
    n = list.length > 3 ? 3 : list.length;
    size = 54;
    step = 32;
    width = size + (n - 1) * step;
    start = slotX + (slotW - width) / 2 + size / 2;
    for (i = n - 1; i >= 0; i--) {
      face = list[i].face || 'rabbit';
      XT.draw.icon(ctx, face, start + i * step, cy, size);
    }
  }

  function chevron(ctx, x, y) {
    ctx.fillStyle = '#FFF1E4';
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#C4A48A';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(x - 4, y - 8);
    ctx.lineTo(x + 6, y);
    ctx.lineTo(x - 4, y + 8);
    ctx.stroke();
  }

  function friendsBar(ctx, x, y, w, h) {
    var list = friendList();
    var drawY = XT.ui.plate(ctx, {
      id: 'home-friends',
      x: x,
      y: y,
      w: w,
      h: h,
      r: 32,
      fill: '#FFFFFF',
      edge: '#E6D3BE',
      drop: 8,
      onTap: function () { XT.nav.go('social'); }
    });
    var slotX = x + 16;
    var slotW = 132;
    var textX = x + 160;
    var mid = drawY + h / 2;
    ctx.save();
    ctx.beginPath();
    ctx.rect(slotX - 4, drawY + 8, slotW + 8, h - 12);
    ctx.clip();
    friendCluster(ctx, list, slotX, slotW, mid);
    ctx.restore();
    XT.ui.text(ctx, '好友进度', textX, mid - 16, { size: 32, weight: '800' });
    XT.ui.text(ctx, friendSubtitle(list), textX, mid + 18, {
      size: 22, weight: '700', color: XT.C.soft
    });
    chevron(ctx, x + w - 40, mid);
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
      var shadow = 10;
      var friendsH = 120;
      var friendsGap = 16;
      var bottom = 22;
      var gridTop = 524;
      var minTile = 240;
      var maxTile = 420;
      var friendsY = XT.H - bottom - friendsH;
      var gridBottom = friendsY - friendsGap;
      var viewH = gridBottom - gridTop;
      var rows = Math.ceil(ids.length / cols);
      var gaps = rows > 1 ? (rows - 1) * gap : 0;
      var usable = viewH - shadow;
      var fillTile = rows ? (usable - gaps) / rows : minTile;
      var tileH = minTile;
      var tileW = (XT.W - pad * 2 - gap) / cols;
      var contentH, slack, i, id, sub, col, row, x, y, pressed, drawY, stars, done, metrics;
      if (rows && fillTile >= minTile) tileH = fillTile;
      if (tileH > maxTile) tileH = maxTile;
      tileH = Math.floor(tileH);
      contentH = rows * tileH + gaps;
      this.maxScroll = Math.max(0, contentH - viewH);
      this.scroll = clamp(this.scroll, 0, this.maxScroll);
      slack = 0;
      if (this.maxScroll < 1 && usable - contentH > 24) {
        slack = Math.round((usable - contentH) / 2);
      }

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
        y = gridTop + slack + row * (tileH + gap) - this.scroll;
        metrics = tileMetrics(tileH);
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
        badge(ctx, x + tileW / 2, drawY + metrics.badgeY, metrics.badgeR, sub.color, id, sub.name);
        XT.ui.text(ctx, sub.name, x + tileW / 2, drawY + metrics.nameY, {
          size: metrics.nameSize, align: 'center', weight: '800'
        });
        XT.ui.text(ctx, sub.tag || '', x + tileW / 2, drawY + metrics.tagY, {
          size: metrics.tagSize, align: 'center', color: XT.C.soft, weight: '700'
        });
        if (id === 'poem') {
          done = XT.poemDoneCount();
          XT.ui.text(ctx, done + '/3 首', x + tileW / 2, drawY + metrics.statY, {
            size: metrics.statSize, align: 'center', color: sub.color, weight: '800'
          });
        } else if (sub.levels && sub.levels.length) {
          stars = XT.subjectStars(id);
          XT.ui.text(ctx, stars + '/' + XT.starMax(id) + ' 星', x + tileW / 2, drawY + metrics.statY, {
            size: metrics.statSize, align: 'center', color: sub.color, weight: '800'
          });
        }
      }
      ctx.restore();

      if (this.scroll > 2) {
        var topFade = ctx.createLinearGradient(0, gridTop, 0, gridTop + 36);
        topFade.addColorStop(0, 'rgba(255,248,242,0.96)');
        topFade.addColorStop(1, 'rgba(255,248,242,0)');
        ctx.fillStyle = topFade;
        ctx.fillRect(0, gridTop, XT.W, 36);
      }
      if (this.maxScroll > 2 && this.scroll < this.maxScroll - 2) {
        var fade = ctx.createLinearGradient(0, gridBottom - 36, 0, gridBottom);
        fade.addColorStop(0, 'rgba(255,248,242,0)');
        fade.addColorStop(1, 'rgba(255,248,242,0.95)');
        ctx.fillStyle = fade;
        ctx.fillRect(0, gridBottom - 36, XT.W, 36);
      }

      friendsBar(ctx, pad, friendsY, XT.W - pad * 2, friendsH);
    }
  };
})(typeof GameGlobal !== 'undefined' ? GameGlobal : (typeof window !== 'undefined' ? window : this));
