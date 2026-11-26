(function (g) {
  'use strict';
  var XT = g.XT;
  var D = XT.draw = XT.draw || {};

  function fluff(ctx, x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  function ear(ctx, x, y, rot, droop) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot + droop);
    ctx.fillStyle = '#E7D0C4';
    ctx.beginPath();
    ctx.ellipse(1, -30, 16, 34, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFDFC';
    ctx.beginPath();
    ctx.ellipse(0, -32, 14, 32, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FF9BB5';
    ctx.beginPath();
    ctx.ellipse(0, -30, 7, 22, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFD0DE';
    ctx.beginPath();
    ctx.ellipse(-2, -36, 3, 10, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    ctx.beginPath();
    ctx.ellipse(-4, -42, 3, 8, -0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function paw(ctx, x, y, swing) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(swing * 0.35);
    ctx.fillStyle = '#E4CFC2';
    ctx.beginPath();
    ctx.ellipse(2, 3, 16, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFDFC';
    ctx.beginPath();
    ctx.ellipse(0, 0, 15, 8.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFB3C6';
    ctx.beginPath();
    ctx.ellipse(-5, 1, 2.4, 3, -0.2, 0, Math.PI * 2);
    ctx.ellipse(1, 2, 2.6, 3.1, 0.1, 0, Math.PI * 2);
    ctx.ellipse(6.5, 0.5, 2, 2.6, 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function eyeOpen(t, mood) {
    var cycle;
    if (mood === 'cheer') return 0.35;
    if (mood === 'sad') return 0.72;
    cycle = t % 3.6;
    if (cycle > 3.28 && cycle < 3.48) {
      return 0.12 + Math.abs((cycle - 3.28) / 0.2 - 0.5) * 1.6;
    }
    return 1;
  }

  D.rabbit = function (ctx, x, y, opt) {
    opt = opt || {};
    var sc = opt.scale || 1;
    var mood = opt.mood || 'idle';
    var t = opt.time || 0;
    var hop = opt.hop || 0;
    var breathe = Math.sin(t * 1.7);
    var bob = breathe * (mood === 'idle' || mood === 'wave' ? 3.5 : 2);
    var leg = Math.sin(t * 2.1) * 0.35;
    var twitch = Math.sin(t * 1.7) * 0.08;
    var burst = t % 5.2;
    var open = eyeOpen(t, mood);
    var earDroop = mood === 'sad' ? 0.62 : 0;
    var lift = 0;
    if (burst > 4.82 && burst < 5.16 && mood !== 'sad') twitch += Math.sin((burst - 4.82) * 21) * 0.2;
    if (mood === 'run') {
      lift = Math.abs(Math.sin(hop * Math.PI));
      bob = -lift * 34;
      leg = Math.sin(hop * Math.PI * 2);
      twitch -= 0.18;
    } else if (mood === 'cheer' || mood === 'wave') {
      bob = -Math.abs(Math.sin(t * 6.2)) * (mood === 'cheer' ? 20 : 8);
      leg = Math.sin(t * 6.2) * 0.6;
    } else if (mood === 'sad') {
      bob = 6;
      leg = 0;
    }
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(sc, sc);
    if (opt.flip) ctx.scale(-1, 1);
    ctx.fillStyle = 'rgba(90, 60, 40, 0.16)';
    ctx.beginPath();
    ctx.ellipse(8, 8, 54, 13, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.translate(0, bob);
    ctx.translate(8, -60);
    ctx.scale(1 + lift * 0.05, (1 - lift * 0.07) * (1 + breathe * 0.018));
    ctx.translate(-8, 60);
    fluff(ctx, -58, -52, 18, '#F3C9D4');
    fluff(ctx, -56, -56, 14, '#FFFDFC');
    fluff(ctx, -50, -48, 8, 'rgba(255,255,255,0.85)');
    ctx.fillStyle = '#E8D5C8';
    ctx.beginPath();
    ctx.ellipse(-2, -46, 50, 36, -0.08, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFDFC';
    ctx.beginPath();
    ctx.ellipse(-4, -52, 48, 34, -0.12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFF4F1';
    ctx.beginPath();
    ctx.ellipse(8, -42, 28, 20, 0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.beginPath();
    ctx.ellipse(-16, -64, 16, 9, -0.5, 0, Math.PI * 2);
    ctx.fill();
    paw(ctx, -16, -2, -leg);
    paw(ctx, 18, -2, leg);
    ctx.fillStyle = '#E7D4C8';
    ctx.beginPath();
    ctx.arc(36, -90, 36, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFDFC';
    ctx.beginPath();
    ctx.arc(34, -94, 34, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.beginPath();
    ctx.ellipse(18, -112, 14, 8, -0.6, 0, Math.PI * 2);
    ctx.fill();
    ear(ctx, 14, -118, -0.46 + twitch, earDroop);
    ear(ctx, 42, -124, 0.18 - twitch * 0.55, earDroop * 0.3);
    ctx.fillStyle = '#FFC6D6';
    ctx.beginPath();
    ctx.ellipse(20, -84, 11, 7, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFD5E2';
    ctx.beginPath();
    ctx.ellipse(48, -78, 7, 5, 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#4A3942';
    ctx.beginPath();
    ctx.ellipse(48, -96, 6.2, 6.6 * open, 0, 0, Math.PI * 2);
    ctx.fill();
    if (open > 0.4) {
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(50.2, -98.2, 2.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(46.2, -94.6, 1.1, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#FF8AA8';
    ctx.beginPath();
    ctx.arc(62, -86, 4.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFD0DC';
    ctx.beginPath();
    ctx.arc(61, -87.2, 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = mood === 'sad' ? '#E7A8B6' : '#E57B93';
    ctx.lineWidth = 2.4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    if (mood === 'sad') ctx.arc(56, -78, 7, Math.PI + 0.3, -0.3);
    else if (mood === 'cheer') ctx.arc(56, -80, 8, 0.1, Math.PI - 0.1);
    else ctx.arc(56, -80, 7, 0.2, Math.PI - 0.25);
    ctx.stroke();
    if (mood === 'wave' || mood === 'cheer') {
      var ang = -1.2 + Math.sin(t * 6) * 0.55;
      var hx = 10 + Math.cos(ang) * 32;
      var hy = -64 + Math.sin(ang) * 32;
      ctx.strokeStyle = '#FFFDFC';
      ctx.lineWidth = 12;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(12, -62);
      ctx.lineTo(hx, hy);
      ctx.stroke();
      paw(ctx, hx - 6, hy, 0);
    }
    ctx.restore();
  };

  D.heart = function (ctx, x, y, s, on) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(s / 32, s / 32);
    ctx.beginPath();
    ctx.moveTo(0, 12);
    ctx.bezierCurveTo(-26, -8, -16, -24, 0, -10);
    ctx.bezierCurveTo(16, -24, 26, -8, 0, 12);
    ctx.closePath();
    ctx.fillStyle = on ? '#FF5D6C' : '#E6D9D0';
    ctx.fill();
    ctx.restore();
  };

  D.star = function (ctx, x, y, r, on) {
    var i, a, rr;
    ctx.beginPath();
    for (i = 0; i < 10; i++) {
      a = -Math.PI / 2 + i * Math.PI / 5;
      rr = i % 2 === 0 ? r : r * 0.46;
      if (i === 0) ctx.moveTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
      else ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
    }
    ctx.closePath();
    ctx.fillStyle = on ? '#FFC107' : '#E7D9CC';
    ctx.fill();
  };

  D.stars = function (ctx, x, y, count, size, gap) {
    var i;
    for (i = 0; i < 3; i++) D.star(ctx, x + i * (size + gap), y, size * 0.5, i < count);
  };

  D.lock = function (ctx, x, y, s) {
    ctx.strokeStyle = '#A68462';
    ctx.lineWidth = 6 * s;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(x, y - 4 * s, 14 * s, Math.PI, 0);
    ctx.stroke();
    ctx.fillStyle = '#E7B56A';
    XT.ui.roundRect(ctx, x - 18 * s, y - 2 * s, 36 * s, 28 * s, 8 * s);
    ctx.fill();
    ctx.fillStyle = '#FFF6E8';
    ctx.beginPath();
    ctx.arc(x, y + 10 * s, 3.5 * s, 0, Math.PI * 2);
    ctx.fill();
  };

  D.cloud = function (ctx, x, y, s, color) {
    ctx.fillStyle = color || 'rgba(255,255,255,0.95)';
    ctx.beginPath();
    ctx.arc(x, y, 22 * s, 0, Math.PI * 2);
    ctx.arc(x + 28 * s, y - 12 * s, 28 * s, 0, Math.PI * 2);
    ctx.arc(x + 58 * s, y, 20 * s, 0, Math.PI * 2);
    ctx.arc(x + 30 * s, y + 10 * s, 18 * s, 0, Math.PI * 2);
    ctx.fill();
  };

  D.sun = function (ctx, x, y, r, time) {
    var i, a;
    ctx.strokeStyle = '#FFD56A';
    ctx.lineWidth = Math.max(4, r * 0.12);
    ctx.lineCap = 'round';
    for (i = 0; i < 8; i++) {
      a = (time || 0) * 0.2 + i * Math.PI / 4;
      ctx.beginPath();
      ctx.moveTo(x + Math.cos(a) * (r + r * 0.18), y + Math.sin(a) * (r + r * 0.18));
      ctx.lineTo(x + Math.cos(a) * (r + r * 0.48), y + Math.sin(a) * (r + r * 0.48));
      ctx.stroke();
    }
    ctx.fillStyle = '#FFD56A';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.45)';
    ctx.beginPath();
    ctx.arc(x - r * 0.28, y - r * 0.28, r * 0.28, 0, Math.PI * 2);
    ctx.fill();
  };

  D.moon = function (ctx, x, y, r, glow) {
    if (glow) {
      var g = ctx.createRadialGradient(x, y, r * 0.2, x, y, r * 2.4);
      g.addColorStop(0, 'rgba(255, 244, 200, ' + (0.35 + glow * 0.4) + ')');
      g.addColorStop(1, 'rgba(255, 244, 200, 0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r * 2.4, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#FFF6C8';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.45)';
    ctx.beginPath();
    ctx.arc(x - r * 0.3, y - r * 0.28, r * 0.22, 0, Math.PI * 2);
    ctx.fill();
  };

  function hillPath(ctx, x, y, w, h) {
    ctx.beginPath();
    ctx.moveTo(x, y + h);
    ctx.lineTo(x, y + h * 0.55);
    ctx.quadraticCurveTo(x + w * 0.28, y, x + w * 0.55, y + h * 0.32);
    ctx.quadraticCurveTo(x + w * 0.82, y + h * 0.62, x + w, y + h * 0.18);
    ctx.lineTo(x + w, y + h);
    ctx.closePath();
  }

  D.hill = function (ctx, x, y, w, h, color) {
    ctx.fillStyle = color;
    hillPath(ctx, x, y + 8, w, h);
    ctx.fill();
    ctx.save();
    ctx.globalAlpha = 0.22;
    ctx.fillStyle = '#000000';
    hillPath(ctx, x, y + 8, w, h);
    ctx.fill();
    ctx.restore();
    ctx.fillStyle = color;
    hillPath(ctx, x, y, w, h);
    ctx.fill();
    ctx.save();
    hillPath(ctx, x, y, w, h);
    ctx.clip();
    ctx.fillStyle = 'rgba(255,255,255,0.22)';
    ctx.fillRect(x, y, w, h * 0.42);
    ctx.restore();
  };

  D.flower = function (ctx, x, y, s, petal, center) {
    var i, a;
    ctx.fillStyle = 'rgba(120, 60, 40, 0.12)';
    ctx.beginPath();
    ctx.ellipse(x + 2, y + 4 * s, 10 * s, 4 * s, 0, 0, Math.PI * 2);
    ctx.fill();
    for (i = 0; i < 5; i++) {
      a = i * Math.PI * 2 / 5 - Math.PI / 2;
      ctx.fillStyle = 'rgba(0,0,0,0.12)';
      ctx.beginPath();
      ctx.ellipse(x + Math.cos(a) * 7 * s + 1, y + Math.sin(a) * 7 * s + 2, 6 * s, 9 * s, a, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = petal || '#FF8FB8';
      ctx.beginPath();
      ctx.ellipse(x + Math.cos(a) * 7 * s, y + Math.sin(a) * 7 * s, 5.5 * s, 8 * s, a, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = center || '#FFD15C';
    ctx.beginPath();
    ctx.arc(x, y, 4.5 * s, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.beginPath();
    ctx.arc(x - 1.5 * s, y - 1.5 * s, 1.8 * s, 0, Math.PI * 2);
    ctx.fill();
  };

  D.felt = function (ctx, w, h) {
    var i, x, y;
    ctx.save();
    ctx.globalAlpha = 0.07;
    ctx.fillStyle = '#8A6248';
    for (i = 0; i < 90; i++) {
      x = (i * 89) % Math.max(w, 1);
      y = (i * 47) % Math.max(h, 1);
      ctx.fillRect(x, y, i % 3 === 0 ? 3 : 2, 2);
    }
    ctx.globalAlpha = 0.045;
    ctx.strokeStyle = '#C4A07A';
    ctx.lineWidth = 1;
    for (i = 0; i < 7; i++) {
      ctx.beginPath();
      ctx.moveTo((i * 110) % Math.max(w, 1), 0);
      ctx.quadraticCurveTo(w * 0.4, h * (0.2 + (i % 3) * 0.2), (i * 70) % Math.max(w, 1), h);
      ctx.stroke();
    }
    ctx.restore();
  };

  D.tree = function (ctx, x, y, s, leaf) {
    ctx.fillStyle = '#A9784A';
    ctx.fillRect(x - 7 * s, y - 36 * s, 14 * s, 40 * s);
    ctx.fillStyle = leaf || '#3FA96A';
    ctx.beginPath();
    ctx.arc(x, y - 52 * s, 28 * s, 0, Math.PI * 2);
    ctx.arc(x - 22 * s, y - 38 * s, 20 * s, 0, Math.PI * 2);
    ctx.arc(x + 22 * s, y - 36 * s, 18 * s, 0, Math.PI * 2);
    ctx.fill();
  };

  D.grass = function (ctx, x, y, s, color) {
    ctx.strokeStyle = color || '#3FA96A';
    ctx.lineWidth = 3 * s;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x - 6 * s, y - 14 * s, x - 8 * s, y - 22 * s);
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + 2 * s, y - 16 * s, x + 4 * s, y - 26 * s);
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + 10 * s, y - 12 * s, x + 14 * s, y - 20 * s);
    ctx.stroke();
  };

  D.swayGrass = function (ctx, x, y, time, color, h) {
    var lean = Math.sin(time * 1.8 + x * 0.05) * 5;
    var tall = h || 22;
    ctx.strokeStyle = color || '#3FA96A';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + lean * 0.4, y - tall * 0.55, x + lean, y - tall);
    ctx.moveTo(x + 6, y);
    ctx.quadraticCurveTo(x + 8 + lean * 0.3, y - tall * 0.4, x + 10 + lean * 0.7, y - tall * 0.85);
    ctx.stroke();
  };

  D.petals = function (ctx, w, h, time, colors) {
    var palette = colors || ['#FFB7D0', '#FFE08A', '#FFFFFF'];
    var i, x, y;
    for (i = 0; i < 8; i++) {
      x = (i * 83 + Math.sin(time * 0.6 + i) * 18) % w;
      y = ((time * 16 + i * 48) % (h + 30)) - 16;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(time * 0.8 + i);
      ctx.globalAlpha = 0.72;
      ctx.fillStyle = palette[i % palette.length];
      ctx.beginPath();
      ctx.ellipse(0, 0, 6, 3.2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    ctx.globalAlpha = 1;
  };

  D.sparkles = function (ctx, w, h, time, n) {
    var i, x, y, tw;
    for (i = 0; i < (n || 10); i++) {
      x = (i * 67 + 20) % w;
      y = (i * 41 + Math.sin(time + i) * 8) % h;
      tw = 0.25 + Math.abs(Math.sin(time * 2.4 + i)) * 0.75;
      ctx.globalAlpha = tw;
      ctx.fillStyle = '#FFF8D0';
      ctx.fillRect(x - 4, y, 8, 1.6);
      ctx.fillRect(x, y - 4, 1.6, 8);
    }
    ctx.globalAlpha = 1;
  };

  D.trackX = function (w, progress) {
    return 96 + progress * (w - 230);
  };

  function stones(ctx, w, y, progress) {
    var i, x, done;
    for (i = 0; i < 10; i++) {
      x = D.trackX(w, (i + 1) / 10);
      done = progress + 0.001 >= (i + 1) / 10;
      ctx.fillStyle = done ? '#FFC107' : 'rgba(255,255,255,0.9)';
      ctx.beginPath();
      ctx.arc(x, y, done ? 8 : 6.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function carrotFlag(ctx, x, y) {
    ctx.strokeStyle = '#8A5A3A';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y - 86);
    ctx.stroke();
    ctx.fillStyle = '#FF8A3D';
    ctx.beginPath();
    ctx.moveTo(x + 4, y - 86);
    ctx.lineTo(x + 42, y - 70);
    ctx.lineTo(x + 4, y - 52);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#3FA96A';
    ctx.beginPath();
    ctx.ellipse(x + 8, y - 96, 8, 14, -0.7, 0, Math.PI * 2);
    ctx.ellipse(x + 18, y - 100, 8, 14, 0.5, 0, Math.PI * 2);
    ctx.fill();
  }

  function house(ctx, x, y, s) {
    ctx.fillStyle = '#F0B429';
    ctx.beginPath();
    ctx.moveTo(x - 54 * s, y - 36 * s);
    ctx.lineTo(x, y - 86 * s);
    ctx.lineTo(x + 54 * s, y - 36 * s);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#FFF8EE';
    ctx.fillRect(x - 42 * s, y - 36 * s, 84 * s, 36 * s);
    ctx.fillStyle = '#E07A4A';
    ctx.fillRect(x - 12 * s, y - 22 * s, 20 * s, 22 * s);
    ctx.fillStyle = '#FFE08A';
    ctx.fillRect(x - 30 * s, y - 28 * s, 12 * s, 10 * s);
    ctx.fillStyle = '#9AD7FF';
    ctx.fillRect(x + 16 * s, y - 28 * s, 14 * s, 12 * s);
  }

  function academy(ctx, x, y, s) {
    ctx.fillStyle = '#9AA3AB';
    ctx.beginPath();
    ctx.moveTo(x - 78 * s, y - 64 * s);
    ctx.lineTo(x, y - 112 * s);
    ctx.lineTo(x + 78 * s, y - 64 * s);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#F7F1E4';
    ctx.fillRect(x - 58 * s, y - 64 * s, 116 * s, 64 * s);
    ctx.fillStyle = '#D24B45';
    ctx.fillRect(x - 54 * s, y - 64 * s, 8 * s, 64 * s);
    ctx.fillRect(x + 46 * s, y - 64 * s, 8 * s, 64 * s);
    ctx.fillStyle = '#8C3A36';
    ctx.fillRect(x - 14 * s, y - 36 * s, 28 * s, 36 * s);
  }

  function gate(ctx, x, y) {
    var colors = ['#FF6B6B', '#FFD15C', '#7BC67E', '#4DA3FF', '#C4A1FF'];
    var i;
    ctx.fillStyle = '#FF8A3D';
    ctx.fillRect(x - 8, y - 108, 14, 108);
    ctx.fillStyle = '#4DA3FF';
    ctx.fillRect(x + 62, y - 108, 14, 108);
    ctx.fillStyle = '#FFD15C';
    XT.ui.roundRect(ctx, x - 16, y - 124, 100, 22, 10);
    ctx.fill();
    for (i = 0; i < 5; i++) {
      ctx.fillStyle = colors[i];
      ctx.beginPath();
      ctx.moveTo(x + i * 16, y - 102);
      ctx.lineTo(x + i * 16 + 14, y - 102);
      ctx.lineTo(x + i * 16 + 7, y - 84);
      ctx.closePath();
      ctx.fill();
    }
  }

  function bridge(ctx, x, y, w) {
    var i;
    ctx.fillStyle = '#8EC8E8';
    XT.ui.roundRect(ctx, x + 8, y + 6, w - 16, 16, 8);
    ctx.fill();
    ctx.fillStyle = '#C4925A';
    ctx.fillRect(x, y - 10, w, 16);
    ctx.strokeStyle = '#8A6238';
    ctx.lineWidth = 3;
    for (i = 0; i <= 5; i++) {
      ctx.beginPath();
      ctx.moveTo(x + (w / 5) * i, y - 10);
      ctx.lineTo(x + (w / 5) * i, y + 6);
      ctx.stroke();
    }
    ctx.strokeStyle = '#A9784A';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x + 4, y - 8);
    ctx.lineTo(x + 4, y - 26);
    ctx.lineTo(x + w - 4, y - 26);
    ctx.lineTo(x + w - 4, y - 8);
    ctx.stroke();
  }

  function squirrel(ctx, x, y, time) {
    ctx.fillStyle = '#D0894A';
    ctx.beginPath();
    ctx.ellipse(x, y, 18, 11, 0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + 16, y - 12, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x - 18, y - 14 + Math.sin(time * 3) * 4, 9, 16, -0.9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#3A3344';
    ctx.beginPath();
    ctx.arc(x + 19, y - 14, 1.7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFB7C8';
    ctx.beginPath();
    ctx.arc(x + 22, y - 8, 2.2, 0, Math.PI * 2);
    ctx.fill();
  }

  function bamboo(ctx, x, ground, h, time, phase) {
    var lean = Math.sin(time * 1.1 + phase) * 8;
    var i, yy;
    ctx.strokeStyle = '#2E9A62';
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x, ground);
    ctx.quadraticCurveTo(x + lean, ground - h * 0.55, x + lean * 1.3, ground - h);
    ctx.stroke();
    ctx.strokeStyle = '#1B6B42';
    ctx.lineWidth = 3;
    for (i = 1; i <= 4; i++) {
      yy = ground - h * (i / 5.2);
      ctx.beginPath();
      ctx.moveTo(x - 9 + lean * 0.5, yy);
      ctx.lineTo(x + 9 + lean * 0.7, yy);
      ctx.stroke();
    }
    ctx.fillStyle = '#67C98A';
    ctx.beginPath();
    ctx.ellipse(x + lean + 20, ground - h + 16, 18, 7, 0.7, 0, Math.PI * 2);
    ctx.ellipse(x + lean - 18, ground - h + 34, 16, 6, -0.8, 0, Math.PI * 2);
    ctx.fill();
  }

  function lantern(ctx, x, y, s, time) {
    var swing = Math.sin(time * 1.5 + x * 0.01) * 0.14;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(swing);
    ctx.strokeStyle = '#8A5A3A';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -20 * s);
    ctx.lineTo(0, 0);
    ctx.stroke();
    ctx.fillStyle = '#E25B4A';
    ctx.beginPath();
    ctx.ellipse(0, 18 * s, 14 * s, 18 * s, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFE08A';
    ctx.beginPath();
    ctx.ellipse(0, 18 * s, 5 * s, 8 * s, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#C9A27A';
    ctx.fillRect(-10 * s, -1 * s, 20 * s, 5 * s);
    ctx.fillRect(-8 * s, 34 * s, 16 * s, 4 * s);
    ctx.restore();
  }

  function bunting(ctx, y, w) {
    var colors = ['#FF6B6B', '#FFD15C', '#7BC67E', '#4DA3FF', '#C4A1FF', '#FF8FB8', '#FF9F43', '#7AD0E2'];
    var i, x, sag;
    ctx.strokeStyle = '#8A5A3A';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(16, y);
    ctx.quadraticCurveTo(w / 2, y + 26, w - 16, y);
    ctx.stroke();
    for (i = 0; i < 8; i++) {
      x = 48 + i * ((w - 96) / 7);
      sag = Math.sin((i / 7) * Math.PI) * 14;
      ctx.fillStyle = colors[i];
      ctx.beginPath();
      ctx.moveTo(x - 14, y + sag);
      ctx.lineTo(x + 14, y + sag);
      ctx.lineTo(x, y + sag + 24);
      ctx.closePath();
      ctx.fill();
    }
  }

  function paintMorning(ctx, w, h, time, progress) {
    var g = ctx.createLinearGradient(0, 0, 0, h);
    var y;
    g.addColorStop(0, '#8FD3FF');
    g.addColorStop(0.55, '#E5F7FF');
    g.addColorStop(1, '#C9F0B0');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    D.sun(ctx, w * 0.8, h * 0.22, 36, time);
    D.cloud(ctx, 40 + Math.sin(time * 0.35) * 10, 54, 0.85);
    D.cloud(ctx, w * 0.35, 88, 0.6);
    D.hill(ctx, -30, h * 0.42, w * 0.72, h * 0.28, '#B6E7A0');
    D.hill(ctx, w * 0.2, h * 0.48, w * 0.9, h * 0.3, '#8ED67A');
    D.hill(ctx, -20, h * 0.58, w + 40, h * 0.48, '#67C56A');
    y = h * 0.8;
    var gi;
    for (gi = 0; gi < 9; gi++) D.swayGrass(ctx, 24 + gi * 74, y - 8, time, gi % 2 ? '#4EAF62' : '#7ED98A', 16 + (gi % 3) * 4);
    D.flower(ctx, 70, y - 34, 1, '#FF8FB8', '#FFD15C');
    D.flower(ctx, 150, y - 22, 0.75, '#FFD15C', '#FF8A3D');
    D.flower(ctx, w * 0.42, y - 32, 0.85, '#C4A1FF', '#FFF');
    D.flower(ctx, w * 0.62, y - 20, 0.8, '#FF8A3D', '#FFD15C');
    D.flower(ctx, w * 0.78, y - 30, 0.65, '#FF8FB8', '#FFF');
    D.petals(ctx, w, h * 0.7, time, ['#FFD0E0', '#FFF4C4', '#FFFFFF']);
    ctx.fillStyle = '#E7C98A';
    XT.ui.roundRect(ctx, 48, y - 6, w - 150, 36, 18);
    ctx.fill();
    ctx.fillStyle = '#F8E2B4';
    XT.ui.roundRect(ctx, 48, y - 14, w - 150, 30, 16);
    ctx.fill();
    stones(ctx, w, y, progress);
    carrotFlag(ctx, D.trackX(w, 1) + 34, y + 8);
  }

  function paintForest(ctx, w, h, time, progress) {
    var g = ctx.createLinearGradient(0, 0, 0, h);
    var y, i;
    g.addColorStop(0, '#D7E7B0');
    g.addColorStop(0.4, '#A9CF8A');
    g.addColorStop(1, '#6FA86A');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(255, 236, 170, 0.28)';
    for (i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.arc(80 + i * 130, 70 + (i % 2) * 30, 28, 0, Math.PI * 2);
      ctx.fill();
    }
    D.tree(ctx, 70, h * 0.62, 1.15, '#2F8F4E');
    D.tree(ctx, 150, h * 0.66, 0.8, '#3FA96A');
    D.tree(ctx, w - 80, h * 0.6, 1.05, '#267A40');
    D.tree(ctx, w - 170, h * 0.68, 0.7, '#49A85A');
    squirrel(ctx, 168, h * 0.48, time);
    y = h * 0.8;
    for (i = 0; i < 6; i++) D.swayGrass(ctx, 30 + i * 110, y + 4, time + i, '#2F7A45', 18);
    D.petals(ctx, w, h * 0.75, time, ['#A9D48A', '#F2E2A0', '#7BC48A']);
    D.flower(ctx, 40, y - 16, 0.6, '#F2D07A', '#FFF');
    D.flower(ctx, w - 120, y - 18, 0.55, '#E7A0C4', '#FFD15C');
    ctx.fillStyle = '#3E8F52';
    ctx.fillRect(0, y + 10, w, h - y);
    bridge(ctx, w * 0.38, y - 2, 150);
    ctx.fillStyle = '#C4A06A';
    XT.ui.roundRect(ctx, 40, y - 8, w - 130, 28, 14);
    ctx.fill();
    stones(ctx, w, y, progress);
    ctx.fillStyle = '#8A5A3A';
    ctx.fillRect(D.trackX(w, 1) + 28, y - 54, 14, 62);
    ctx.fillStyle = '#F2D07A';
    ctx.beginPath();
    ctx.moveTo(D.trackX(w, 1) + 42, y - 50);
    ctx.lineTo(D.trackX(w, 1) + 78, y - 38);
    ctx.lineTo(D.trackX(w, 1) + 42, y - 26);
    ctx.closePath();
    ctx.fill();
  }

  function paintSunset(ctx, w, h, time, progress) {
    var g = ctx.createLinearGradient(0, 0, 0, h);
    var y, i, bx;
    g.addColorStop(0, '#FFB067');
    g.addColorStop(0.45, '#FF8B7A');
    g.addColorStop(1, '#F2C98A');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    D.sun(ctx, w * 0.28, h * 0.62, 48, time);
    ctx.fillStyle = '#E07A5F';
    D.hill(ctx, -40, h * 0.48, w * 0.7, h * 0.28, '#E07A5F');
    D.hill(ctx, w * 0.3, h * 0.42, w * 0.8, h * 0.26, '#C45B6A');
    ctx.fillStyle = '#E7A15A';
    ctx.fillRect(0, h * 0.7, w, h);
    y = h * 0.8;
    for (i = 0; i < 7; i++) D.swayGrass(ctx, 20 + i * 96, y - 2, time, '#C46B45', 14);
    D.flower(ctx, 90, y - 22, 0.7, '#FF8A7A', '#FFD15C');
    D.flower(ctx, 220, y - 16, 0.55, '#FFD08A', '#FFF');
    D.sparkles(ctx, w, h * 0.45, time, 8);
    ctx.fillStyle = '#F0C48A';
    XT.ui.roundRect(ctx, 40, y - 10, w - 120, 30, 14);
    ctx.fill();
    for (i = 0; i < 3; i++) {
      bx = 180 + i * 90 + Math.sin(time + i) * 6;
      ctx.strokeStyle = 'rgba(90, 40, 50, 0.45)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(bx, 80);
      ctx.lineTo(bx + 16, 96);
      ctx.moveTo(bx, 80);
      ctx.lineTo(bx - 16, 96);
      ctx.stroke();
    }
    house(ctx, D.trackX(w, 1) + 10, y + 8, 1);
    carrotFlag(ctx, D.trackX(w, 1) - 20, y + 8);
    stones(ctx, w, y, progress);
  }

  function paintInk(ctx, w, h, time, progress, variant) {
    var g = ctx.createLinearGradient(0, 0, 0, h);
    var y, i, x;
    g.addColorStop(0, variant === 3 ? '#F6E2C4' : '#E7F4EF');
    g.addColorStop(1, '#F7F0DE');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    bamboo(ctx, 36, h * 0.86, h * (variant === 2 ? 0.78 : 0.62), time, 0.2);
    bamboo(ctx, 78, h * 0.86, h * 0.5, time, 1.4);
    bamboo(ctx, w - 40, h * 0.86, h * (variant === 2 ? 0.8 : 0.66), time, 2.2);
    if (variant === 2) bamboo(ctx, w - 90, h * 0.86, h * 0.48, time, 2.8);
    lantern(ctx, w * 0.3, 8, 1, time);
    lantern(ctx, w * 0.55, 18, 0.85, time);
    if (variant !== 2) lantern(ctx, w * 0.72, 6, 0.75, time);
    y = h * 0.8;
    D.petals(ctx, w, h * 0.72, time, ['#F8E2C4', '#E7F6F2', '#F4C7D4']);
    D.sparkles(ctx, w, h * 0.35, time * 0.8, 6);
    ctx.strokeStyle = 'rgba(180, 150, 110, 0.18)';
    ctx.lineWidth = 1;
    for (i = 0; i < 12; i++) {
      ctx.beginPath();
      ctx.moveTo((i * 53) % w, (i * 29) % (h * 0.5));
      ctx.lineTo((i * 53) % w + 10, (i * 29) % (h * 0.5) + 2);
      ctx.stroke();
    }
    ctx.fillStyle = '#D9D0C2';
    for (i = 0; i < 8; i++) {
      x = 70 + i * ((w - 180) / 7);
      ctx.beginPath();
      ctx.ellipse(x, y + 4, 22, 12, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = i % 2 ? '#E7E0D4' : '#D0C6B6';
    }
    stones(ctx, w, y, progress);
    if (variant === 3) academy(ctx, D.trackX(w, 1) + 8, y + 10, 0.85);
    else {
      ctx.fillStyle = '#F4E2B0';
      XT.ui.roundRect(ctx, D.trackX(w, 1) + 8, y - 70, 54, 64, 6);
      ctx.fill();
      ctx.strokeStyle = '#C4A46A';
      ctx.lineWidth = 3;
      ctx.stroke();
      XT.ui.text(ctx, '学', D.trackX(w, 1) + 35, y - 38, { size: 28, align: 'center', weight: '800', color: '#8A5A3A' });
    }
  }

  function paintGarden(ctx, w, h, time, progress, variant) {
    var g = ctx.createLinearGradient(0, 0, 0, h);
    var y, i;
    g.addColorStop(0, '#79D2FF');
    g.addColorStop(0.55, '#D9F4FF');
    g.addColorStop(1, '#B6E88A');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    D.cloud(ctx, 60 + Math.sin(time * 0.3) * 8, 48, 0.8);
    D.cloud(ctx, w * 0.55, 80, 0.55);
    bunting(ctx, 18, w);
    D.hill(ctx, -20, h * 0.58, w + 40, h * 0.48, '#8ED67A');
    y = h * 0.8;
    for (i = 0; i < 8; i++) D.swayGrass(ctx, 16 + i * 86, y + 6, time, '#3FA96A', 16);
    D.petals(ctx, w, h * 0.65, time, ['#FFB7D5', '#C4A1FF', '#FFF4C4', '#FFFFFF']);
    if (variant === 1) {
      ctx.fillStyle = '#FFF8EE';
      ctx.fillRect(46, y - 70, 90, 50);
      ctx.fillStyle = '#E25B4A';
      ctx.fillRect(40, y - 84, 102, 16);
      ctx.fillStyle = '#3A3344';
      ctx.beginPath();
      ctx.arc(90, y - 48, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(90, y - 48, 6, 0, Math.PI * 2);
      ctx.fill();
    }
    for (i = 0; i < (variant === 2 ? 7 : 4); i++) {
      D.flower(ctx, 40 + i * 70, y - 24 - (i % 2) * 10, 0.85, ['#FF8FB8', '#FFD15C', '#C4A1FF', '#FF8A3D', '#7AD0E2'][i % 5], '#FFF');
    }
    ctx.strokeStyle = '#8A5A3A';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(w * 0.48, y);
    ctx.lineTo(w * 0.48, y - 48);
    ctx.stroke();
    ctx.fillStyle = '#FFFFFF';
    XT.ui.roundRect(ctx, w * 0.48 - 28, y - 78, 70, 32, 8);
    ctx.fill();
    ctx.strokeStyle = '#4DA3FF';
    ctx.stroke();
    XT.ui.text(ctx, 'GO', w * 0.48 + 8, y - 62, { size: 18, align: 'center', weight: '800', color: '#2E8FD6', font: XT.FONT_EN });
    ctx.fillStyle = '#F3D48A';
    XT.ui.roundRect(ctx, 36, y - 8, w - 150, 26, 12);
    ctx.fill();
    stones(ctx, w, y, progress);
    gate(ctx, D.trackX(w, 1) + 6, y + 6);
  }

  D.trackScene = function (ctx, scene, w, h, time, progress, variant) {
    if (scene === 'forest') paintForest(ctx, w, h, time, progress);
    else if (scene === 'sunset') paintSunset(ctx, w, h, time, progress);
    else if (scene === 'ink') paintInk(ctx, w, h, time, progress, variant || 1);
    else if (scene === 'garden') paintGarden(ctx, w, h, time, progress, variant || 1);
    else paintMorning(ctx, w, h, time, progress);
    D.felt(ctx, w, h);
  };

  function nightSky(ctx, top, bottom) {
    var g = ctx.createLinearGradient(0, 0, 0, XT.H);
    g.addColorStop(0, top);
    g.addColorStop(1, bottom);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, XT.W, XT.H);
  }

  function stars(ctx, time, n) {
    var i, x, y, tw;
    for (i = 0; i < n; i++) {
      x = (i * 97) % 700 + 20;
      y = (i * 53) % 280 + 30;
      tw = 0.4 + Math.abs(Math.sin(time * 2 + i)) * 0.6;
      ctx.globalAlpha = tw;
      ctx.fillStyle = '#FFF6C8';
      ctx.beginPath();
      ctx.arc(x, y, i % 4 === 0 ? 2.4 : 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function frost(ctx, time, light) {
    var i, x, y;
    for (i = 0; i < 28; i++) {
      x = 80 + (i * 47) % 560;
      y = 430 + (i * 29) % 120;
      ctx.globalAlpha = 0.25 + light * 0.6;
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(x, y, 2 + (i % 3), 0, Math.PI * 2);
      ctx.fill();
      if (light > 0.4) {
        ctx.globalAlpha = light * (0.3 + Math.abs(Math.sin(time * 3 + i)));
        ctx.fillStyle = '#FFF6C8';
        ctx.fillRect(x - 5, y, 10, 1.4);
        ctx.fillRect(x, y - 5, 1.4, 10);
      }
    }
    ctx.globalAlpha = 1;
  }

  function paintExtraPoem(ctx, name, time, light) {
    var i;
    if (name === 'spring') {
      var sky = ctx.createLinearGradient(0, 0, 0, XT.H);
      sky.addColorStop(0, '#B7E6FF');
      sky.addColorStop(0.45, '#FFF6E4');
      sky.addColorStop(1, '#C9E8A4');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, XT.W, XT.H);
      D.sun(ctx, 120, 120, 40, time);
      D.flower(ctx, 80, 780, 1.2, '#FF8FB8', '#FFD15C');
      D.flower(ctx, 660, 760, 1, '#C4A1FF', '#FFF');
      D.petals(ctx, XT.W, 700, time, ['#FFD0E0', '#FFF4C4', '#FFFFFF']);
    } else if (name === 'tower') {
      nightSky(ctx, '#F2A36B', '#6E4C7A');
      D.sun(ctx, 180, 220, 54, time);
      D.hill(ctx, -40, 620, 860, 280, '#C46B4A');
      ctx.fillStyle = '#E7B15A';
      ctx.fillRect(0, 860, XT.W, XT.H);
    } else if (name === 'dawn') {
      var dawn = ctx.createLinearGradient(0, 0, 0, 560);
      dawn.addColorStop(0, '#F7C6D8');
      dawn.addColorStop(1, '#FFE9C4');
      ctx.fillStyle = dawn;
      ctx.fillRect(0, 0, XT.W, 560);
      D.sun(ctx, 560, 180, 48, time);
      ctx.fillStyle = '#C48A5C';
      ctx.fillRect(0, 560, XT.W, XT.H);
      ctx.fillStyle = '#8B5A3A';
      XT.ui.roundRect(ctx, 70, 400, 250, 140, 16);
      ctx.fill();
      ctx.fillStyle = '#FFF8EE';
      XT.ui.roundRect(ctx, 86, 378, 220, 56, 16);
      ctx.fill();
    } else if (name === 'birds') {
      var morn = ctx.createLinearGradient(0, 0, 0, XT.H);
      morn.addColorStop(0, '#8FD3FF');
      morn.addColorStop(1, '#D7F3C4');
      ctx.fillStyle = morn;
      ctx.fillRect(0, 0, XT.W, XT.H);
      D.tree(ctx, 120, 520, 1.4, '#3FA96A');
      D.tree(ctx, 560, 540, 1.2, '#2F9E4F');
      for (i = 0; i < 4; i++) {
        ctx.strokeStyle = '#3A3344';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(200 + i * 90, 160 + (i % 2) * 30);
        ctx.quadraticCurveTo(220 + i * 90, 140, 246 + i * 90, 164);
        ctx.stroke();
      }
      ctx.fillStyle = '#8ED67A';
      ctx.fillRect(0, 560, XT.W, XT.H);
    } else if (name === 'springrain') {
      nightSky(ctx, '#6E88A8', '#A9C0C8');
      D.cloud(ctx, 80, 120, 1.1, 'rgba(255,255,255,0.8)');
      D.cloud(ctx, 360, 80, 0.9, 'rgba(255,255,255,0.75)');
      ctx.strokeStyle = '#D5E6F2';
      ctx.lineWidth = 2;
      for (i = 0; i < 18; i++) {
        ctx.beginPath();
        ctx.moveTo(40 + (i * 40) % 680, 40 + (i * 23) % 200);
        ctx.lineTo(32 + (i * 40) % 680, 70 + (i * 23) % 200);
        ctx.stroke();
      }
      D.flower(ctx, 160, 500, 1, '#FF8FB8', '#FFD15C');
      D.flower(ctx, 520, 520, 0.9, '#C4A1FF', '#FFF');
      ctx.fillStyle = '#7D9A72';
      ctx.fillRect(0, 560, XT.W, XT.H);
    } else if (name === 'petals') {
      var garden = ctx.createLinearGradient(0, 0, 0, XT.H);
      garden.addColorStop(0, '#D7F3FF');
      garden.addColorStop(1, '#E7F6C8');
      ctx.fillStyle = garden;
      ctx.fillRect(0, 0, XT.W, XT.H);
      D.tree(ctx, 140, 500, 1.5, '#67C56A');
      D.petals(ctx, XT.W, 640, time, ['#FFB7D0', '#FFD0E0', '#FFF']);
      for (i = 0; i < 6; i++) D.flower(ctx, 80 + i * 110, 520 + (i % 2) * 16, 0.8, i % 2 ? '#FF8FB8' : '#C4A1FF', '#FFD15C');
      ctx.fillStyle = '#8ED67A';
      ctx.fillRect(0, 600, XT.W, XT.H);
    } else if (name === 'mountsun') {
      var dusk = ctx.createLinearGradient(0, 0, 0, 560);
      dusk.addColorStop(0, '#FFB067');
      dusk.addColorStop(1, '#FF8B7A');
      ctx.fillStyle = dusk;
      ctx.fillRect(0, 0, XT.W, 560);
      D.sun(ctx, 420, 300, 64, time);
      D.hill(ctx, -20, 340, 820, 260, '#C45B6A');
      ctx.fillStyle = '#E7A15A';
      ctx.fillRect(0, 560, XT.W, XT.H);
    } else if (name === 'yellowriver') {
      nightSky(ctx, '#F6D7A2', '#7EB6D8');
      D.hill(ctx, -40, 280, 500, 200, '#E0B07A');
      D.hill(ctx, 300, 320, 520, 180, '#C9845A');
      ctx.fillStyle = '#E7B15A';
      ctx.fillRect(0, 430, XT.W, 180);
      ctx.fillStyle = 'rgba(255,255,255,0.25)';
      ctx.beginPath();
      ctx.moveTo(0, 480);
      ctx.quadraticCurveTo(200, 450, 400, 500);
      ctx.quadraticCurveTo(560, 540, 750, 470);
      ctx.lineTo(750, 610);
      ctx.lineTo(0, 610);
      ctx.fill();
      ctx.fillStyle = '#6FA86A';
      ctx.fillRect(0, 600, XT.W, XT.H);
    } else if (name === 'farlook') {
      var far = ctx.createLinearGradient(0, 0, 0, XT.H);
      far.addColorStop(0, '#B9E2FF');
      far.addColorStop(1, '#F7E2C4');
      ctx.fillStyle = far;
      ctx.fillRect(0, 0, XT.W, XT.H);
      D.hill(ctx, -80, 260, 500, 180, '#D7E7F2');
      D.hill(ctx, 180, 320, 620, 200, '#B7C9A4');
      D.hill(ctx, -20, 430, 860, 220, '#8EAF6A');
      ctx.fillStyle = '#C9A36A';
      XT.ui.roundRect(ctx, 280, 560, 200, 16, 8);
      ctx.fill();
    } else if (name === 'upstairs') {
      var up = ctx.createLinearGradient(0, 0, 0, XT.H);
      up.addColorStop(0, '#F2C14E');
      up.addColorStop(1, '#F6E2C4');
      ctx.fillStyle = up;
      ctx.fillRect(0, 0, XT.W, XT.H);
      ctx.fillStyle = '#C45B4A';
      ctx.fillRect(460, 180, 160, 380);
      ctx.fillStyle = '#F7F1E4';
      ctx.fillRect(500, 240, 36, 40);
      ctx.fillRect(560, 320, 36, 40);
      ctx.fillStyle = '#E7C98A';
      ctx.beginPath();
      ctx.moveTo(80, 560);
      ctx.lineTo(430, 560);
      ctx.lineTo(430, 500);
      ctx.lineTo(330, 500);
      ctx.lineTo(330, 440);
      ctx.lineTo(230, 440);
      ctx.lineTo(230, 380);
      ctx.lineTo(140, 380);
      ctx.lineTo(140, 560);
      ctx.fill();
      ctx.fillStyle = '#8B5A3A';
      ctx.fillRect(0, 560, XT.W, XT.H);
    }
    if (name === 'spring' || name === 'tower') {
      ctx.fillStyle = 'rgba(90, 70, 40, 0.16)';
      XT.ui.roundRect(ctx, 150, 230, 470, 620, 28);
      ctx.fill();
      ctx.fillStyle = '#FFF6E4';
      XT.ui.roundRect(ctx, 140, 214, 470, 620, 28);
      ctx.fill();
      ctx.fillStyle = name === 'tower' ? '#C45B4A' : '#E25B4A';
      XT.ui.roundRect(ctx, 300, 196, 150, 28, 12);
      ctx.fill();
      ctx.fillStyle = '#FFD56A';
      ctx.beginPath();
      ctx.arc(375, 210, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#E7D3B0';
      ctx.lineWidth = 3;
      XT.ui.roundRect(ctx, 164, 246, 422, 560, 18);
      ctx.stroke();
    }
  }

  D.poemScene = function (ctx, name, time, light) {
    var y;
    if (name === 'room') {
      nightSky(ctx, '#1B2C4E', '#31466F');
      stars(ctx, time, 14);
      ctx.fillStyle = '#9A6844';
      var grd = ctx.createLinearGradient(0, 540, 0, XT.H);
      grd.addColorStop(0, '#C48A5C');
      grd.addColorStop(1, '#8B5A3A');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 560, XT.W, XT.H);
      ctx.strokeStyle = 'rgba(80,40,20,0.18)';
      ctx.lineWidth = 2;
      for (y = 590; y < XT.H; y += 28) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(XT.W, y);
        ctx.stroke();
      }
      ctx.fillStyle = '#6B4226';
      XT.ui.roundRect(ctx, 48, 400, 280, 150, 16);
      ctx.fill();
      ctx.fillStyle = '#FFF8EE';
      XT.ui.roundRect(ctx, 64, 378, 248, 64, 18);
      ctx.fill();
      ctx.fillStyle = '#FFD0DE';
      ctx.beginPath();
      ctx.ellipse(110, 408, 34, 20, -0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#1A2744';
      XT.ui.roundRect(ctx, 430, 150, 230, 250, 18);
      ctx.fill();
      ctx.fillStyle = '#24385F';
      ctx.fillRect(448, 168, 194, 214);
      D.moon(ctx, 560, 250, 36, light);
      ctx.save();
      ctx.globalAlpha = 0.12 + light * 0.38;
      ctx.fillStyle = '#FFF4C8';
      ctx.beginPath();
      ctx.moveTo(470, 370);
      ctx.lineTo(640, 370);
      ctx.lineTo(430, 575);
      ctx.lineTo(250, 575);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
      ctx.strokeStyle = '#E7C9A2';
      ctx.lineWidth = 10;
      XT.ui.roundRect(ctx, 430, 150, 230, 250, 18);
      ctx.stroke();
      ctx.fillStyle = 'rgba(255, 214, 170, 0.55)';
      ctx.fillRect(438, 158, 18, 230);
      ctx.fillRect(634, 158, 18, 230);
      ctx.fillStyle = '#E7B7C4';
      ctx.beginPath();
      ctx.ellipse(360, 548, 90, 22, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#D7E8C8';
      ctx.fillRect(70, 500, 8, 48);
      ctx.beginPath();
      ctx.ellipse(74, 492, 16, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      D.sparkles(ctx, XT.W, 200, time, 5);
    } else if (name === 'window') {
      nightSky(ctx, '#16243F', '#243656');
      stars(ctx, time, 18);
      D.moon(ctx, 560, 180, 54, 0.4 + light);
      ctx.fillStyle = '#1E3348';
      ctx.fillRect(0, 470, XT.W, 140);
      frost(ctx, time, light);
      ctx.fillStyle = '#6B4226';
      ctx.fillRect(0, 590, XT.W, 28);
      ctx.fillStyle = '#8B5A3A';
      ctx.fillRect(0, 618, XT.W, XT.H);
      ctx.strokeStyle = '#E7D3B0';
      ctx.lineWidth = 16;
      XT.ui.roundRect(ctx, 70, 70, 610, 540, 24);
      ctx.stroke();
      ctx.fillStyle = 'rgba(255, 228, 214, 0.35)';
      ctx.fillRect(86, 86, 28, 500);
      ctx.fillRect(636, 86, 28, 500);
      D.sparkles(ctx, XT.W, 360, time, 8);
    } else if (name === 'moon') {
      nightSky(ctx, '#121C36', '#24385C');
      stars(ctx, time, 24);
      D.moon(ctx, 375, 250, 92, 0.55 + light * 0.9);
      D.cloud(ctx, 120, 180, 0.8, 'rgba(255,255,255,0.14)');
      D.cloud(ctx, 520, 120, 0.6, 'rgba(255,255,255,0.12)');
      D.hill(ctx, -40, 500, 860, 220, '#1C3148');
      ctx.fillStyle = '#27445E';
      ctx.fillRect(0, 620, XT.W, XT.H);
    } else if (name === 'home') {
      nightSky(ctx, '#1A2744', '#2A4060');
      stars(ctx, time, 16);
      D.moon(ctx, 140, 140, 40, 0.3 + light * 0.4);
      D.hill(ctx, -20, 360, 800, 180, '#24344A');
      ctx.fillStyle = '#1B2838';
      ctx.fillRect(80, 430, 70, 50);
      ctx.fillRect(170, 410, 90, 70);
      ctx.fillRect(280, 440, 60, 40);
      ctx.fillStyle = 'rgba(255, 208, 120, ' + (0.25 + light * 0.65) + ')';
      ctx.fillRect(98, 446, 16, 14);
      ctx.fillRect(196, 428, 18, 16);
      ctx.fillRect(230, 428, 14, 12);
      ctx.fillRect(296, 454, 14, 12);
      ctx.fillStyle = '#3E5A3A';
      ctx.fillRect(0, 560, XT.W, XT.H);
      ctx.fillStyle = '#D9C7A2';
      XT.ui.roundRect(ctx, 300, 600, 180, 22, 10);
      ctx.fill();
    } else if (name === 'dawn' || name === 'birds' || name === 'springrain' || name === 'petals' || name === 'mountsun' || name === 'yellowriver' || name === 'farlook' || name === 'upstairs' || name === 'spring' || name === 'tower') {
      paintExtraPoem(ctx, name, time, light);
    } else {
      nightSky(ctx, '#1A2748', '#243656');
      stars(ctx, time, 20);
      D.moon(ctx, 600, 120, 46, 0.45 + (light || 0.4));
      bamboo(ctx, 40, 980, 420, time, 0.4);
      bamboo(ctx, 700, 1000, 460, time, 1.6);
      ctx.fillStyle = '#314A62';
      ctx.beginPath();
      ctx.arc(120, 520, 70, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#1A2748';
      ctx.beginPath();
      ctx.arc(120, 520, 48, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(90, 70, 40, 0.18)';
      XT.ui.roundRect(ctx, 150, 230, 470, 620, 28);
      ctx.fill();
      ctx.fillStyle = '#FFF6E4';
      XT.ui.roundRect(ctx, 140, 214, 470, 620, 28);
      ctx.fill();
      ctx.fillStyle = '#E25B4A';
      XT.ui.roundRect(ctx, 300, 196, 150, 28, 12);
      ctx.fill();
      ctx.fillStyle = '#FFD56A';
      ctx.beginPath();
      ctx.arc(375, 210, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#E7D3B0';
      ctx.lineWidth = 3;
      XT.ui.roundRect(ctx, 164, 246, 422, 560, 18);
      ctx.stroke();
      D.sparkles(ctx, XT.W, 220, time, 8);
      ctx.fillStyle = '#3C5344';
      ctx.fillRect(0, 860, XT.W, XT.H);
      ctx.fillStyle = '#6E8A72';
      var i;
      for (i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.ellipse(120 + i * 130, 980, 40, 16, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    D.felt(ctx, XT.W, XT.H);
  };

  D.dotSum = function (ctx, cx, cy, vis) {
    var a = vis.a;
    var b = vis.b;
    var gap = 20;
    var total = (a + b) * gap + 36;
    var start = cx - total / 2 + 8;
    var i, x;
    for (i = 0; i < a; i++) {
      x = start + i * gap;
      ctx.fillStyle = '#FF8A3D';
      ctx.beginPath();
      ctx.arc(x, cy, 8, 0, Math.PI * 2);
      ctx.fill();
    }
    XT.ui.text(ctx, '+', start + a * gap + 6, cy + 1, { size: 28, align: 'center', weight: '800', color: '#8A7568' });
    for (i = 0; i < b; i++) {
      x = start + a * gap + 28 + i * gap;
      ctx.fillStyle = '#3D9BE0';
      ctx.beginPath();
      ctx.arc(x, cy, 8, 0, Math.PI * 2);
      ctx.fill();
    }
  };
})(typeof GameGlobal !== 'undefined' ? GameGlobal : (typeof window !== 'undefined' ? window : this));