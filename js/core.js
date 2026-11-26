(function (g) {
  'use strict';
  var XT = g.XT = g.XT || {};

  XT.W = 750;
  XT.H = 1334;
  XT.FONT = '"WenQuanYi Micro Hei","Droid Sans Fallback","PingFang SC","Noto Sans CJK SC","Microsoft YaHei",sans-serif';
  XT.FONT_EN = '"Trebuchet MS","Verdana","WenQuanYi Micro Hei",sans-serif';

  XT.C = {
    ink: '#3A3344',
    soft: '#6E6578',
    cream: '#FFF8F2',
    white: '#FFFFFF',
    line: '#F0E2D0',
    coral: '#FF6B6B',
    grass: '#3FA96A',
    sky: '#2E8FD6',
    teal: '#1F8F86',
    purple: '#5C4DB5',
    sun: '#FFD15C',
    orange: '#FF9F43'
  };

  XT.env = {
    isWeChat: typeof GameGlobal !== 'undefined' && !g.__XT_PREVIEW
  };

  XT.runtime = { time: 0, page: null };
  XT.overlay = null;
  XT.banks = {};
  XT.screens = {};

  XT.rand = {
    shuffle: function (arr) {
      var a = arr.slice();
      var i, j, t;
      for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        t = a[i];
        a[i] = a[j];
        a[j] = t;
      }
      return a;
    },
    pick: function (arr) {
      return arr[Math.floor(Math.random() * arr.length)];
    }
  };

  XT.pickQuestion = function (bank, used, type, current) {
    function pool(respectUsed, respectType) {
      var out = [];
      var i, q;
      for (i = 0; i < bank.length; i++) {
        q = bank[i];
        if (respectType && type && q.type !== type) continue;
        if (respectUsed && used.indexOf(q.id) !== -1) continue;
        if (current && q.id === current.id) continue;
        out.push(q);
      }
      return out;
    }
    var p = pool(true, true);
    if (!p.length) p = pool(false, true);
    if (!p.length) p = pool(false, false);
    if (!p.length) p = bank.slice();
    return XT.rand.pick(p);
  };

  XT.levelById = function (subject, id) {
    var list = XT.catalog[subject].levels;
    var i;
    for (i = 0; i < list.length; i++) {
      if (list[i].id === id) return list[i];
    }
    return null;
  };

  XT.nextLevel = function (subject, id) {
    var list = XT.catalog[subject].levels;
    var i;
    for (i = 0; i < list.length; i++) {
      if (list[i].id === id) return list[i + 1] || null;
    }
    return null;
  };

  XT.save = {
    key: 'xiaotu-kuaipao-v1',
    data: null,
    fresh: function () {
      return {
        version: 1,
        levels: {},
        poem: {},
        sent: []
      };
    },
    load: function () {
      var raw = '';
      try {
        raw = wx.getStorageSync(this.key);
      } catch (e) {
        raw = '';
      }
      if (raw && typeof raw === 'object') {
        this.data = raw;
      } else if (typeof raw === 'string' && raw) {
        try {
          this.data = JSON.parse(raw);
        } catch (e2) {
          this.data = this.fresh();
        }
      } else {
        this.data = this.fresh();
      }
      if (!this.data || this.data.version !== 1) this.data = this.fresh();
      if (!this.data.levels) this.data.levels = {};
      if (!this.data.poem) this.data.poem = {};
      if (!this.data.sent) this.data.sent = [];
      return this.data;
    },
    persist: function () {
      try {
        wx.setStorageSync(this.key, JSON.stringify(this.data));
      } catch (e) {}
    },
    stars: function (subject, level) {
      var row = this.data.levels[subject + '-' + level];
      return row ? row.stars : 0;
    },
    record: function (subject, level, stars) {
      var k = subject + '-' + level;
      var prev = this.data.levels[k] || { stars: 0, clears: 0 };
      var improved = stars > prev.stars;
      this.data.levels[k] = {
        stars: Math.max(prev.stars, stars),
        clears: (prev.clears || 0) + 1
      };
      this.persist();
      return { best: this.data.levels[k].stars, improved: improved };
    },
    reset: function () {
      this.data = this.fresh();
      this.persist();
    }
  };

  XT.view = {
    canvas: null,
    ctx: null,
    dpr: 1,
    sw: 0,
    sh: 0,
    scale: 1,
    ox: 0,
    oy: 0,
    mount: function () {
      this.canvas = wx.createCanvas();
      this.ctx = this.canvas.getContext('2d');
      this.resize();
    },
    resize: function () {
      var info = wx.getSystemInfoSync();
      this.dpr = info.pixelRatio || 1;
      this.sw = info.windowWidth || info.screenWidth || 390;
      this.sh = info.windowHeight || info.screenHeight || 780;
      if (this.sw < 10 || this.sh < 10) return;
      this.canvas.width = Math.max(2, Math.round(this.sw * this.dpr));
      this.canvas.height = Math.max(2, Math.round(this.sh * this.dpr));
      this.scale = Math.min(this.sw / XT.W, this.sh / XT.H);
      this.ox = (this.sw - XT.W * this.scale) / 2;
      this.oy = (this.sh - XT.H * this.scale) / 2;
    },
    apply: function () {
      var d = this.dpr;
      this.ctx.setTransform(this.scale * d, 0, 0, this.scale * d, this.ox * d, this.oy * d);
    },
    toDesign: function (clientX, clientY) {
      return {
        x: (clientX - this.ox) / this.scale,
        y: (clientY - this.oy) / this.scale
      };
    }
  };

  XT.touchPoint = function (e) {
    var t = (e.changedTouches && e.changedTouches[0]) || (e.touches && e.touches[0]);
    if (!t) return null;
    return XT.view.toDesign(t.clientX, t.clientY);
  };

  XT.ui = {
    hits: [],
    begin: function () { this.hits = []; },
    add: function (h) { this.hits.push(h); },
    test: function (x, y) {
      var i, h;
      for (i = this.hits.length - 1; i >= 0; i--) {
        h = this.hits[i];
        if (x >= h.x && y >= h.y && x <= h.x + h.w && y <= h.y + h.h) return h;
      }
      return null;
    },
    invoke: function (id) {
      var i, h;
      for (i = this.hits.length - 1; i >= 0; i--) {
        h = this.hits[i];
        if (h.id === id && h.onTap) {
          h.onTap();
          return true;
        }
      }
      return false;
    },
    fontFor: function (text) {
      if (text && /^[\x00-\x7F]+$/.test(text)) return XT.FONT_EN;
      return XT.FONT;
    },
    roundRect: function (ctx, x, y, w, h, r) {
      var rr = Math.min(r, w / 2, h / 2);
      ctx.beginPath();
      ctx.moveTo(x + rr, y);
      ctx.arcTo(x + w, y, x + w, y + h, rr);
      ctx.arcTo(x + w, y + h, x, y + h, rr);
      ctx.arcTo(x, y + h, x, y, rr);
      ctx.arcTo(x, y, x + w, y, rr);
      ctx.closePath();
    },
    text: function (ctx, str, x, y, opt) {
      opt = opt || {};
      ctx.fillStyle = opt.color || XT.C.ink;
      ctx.font = (opt.weight || '700') + ' ' + (opt.size || 32) + 'px ' + (opt.font || XT.ui.fontFor(str));
      ctx.textAlign = opt.align || 'left';
      ctx.textBaseline = opt.baseline || 'middle';
      ctx.fillText(str, x, y);
    },
    fit: function (ctx, text, maxW, start, font) {
      var size = start;
      var face = font || XT.ui.fontFor(text);
      while (size > 22) {
        ctx.font = '800 ' + size + 'px ' + face;
        if (ctx.measureText(text).width <= maxW) return size;
        size -= 2;
      }
      return size;
    },
    plate: function (ctx, o) {
      var pressed = XT.input.downId === o.id;
      var drop = pressed ? 3 : (o.drop == null ? 10 : o.drop);
      var y = o.y + (pressed ? 5 : 0);
      var r = o.r == null ? 46 : o.r;
      ctx.fillStyle = o.edge || '#E8CDB4';
      XT.ui.roundRect(ctx, o.x, y + drop, o.w, o.h, r);
      ctx.fill();
      ctx.fillStyle = o.fill || '#FFFDF8';
      XT.ui.roundRect(ctx, o.x, y, o.w, o.h, r);
      ctx.fill();
      ctx.save();
      XT.ui.roundRect(ctx, o.x, y, o.w, o.h, r);
      ctx.clip();
      ctx.fillStyle = 'rgba(120, 70, 40, 0.1)';
      ctx.fillRect(o.x, y + o.h * 0.62, o.w, o.h * 0.4);
      ctx.fillStyle = 'rgba(255,255,255,0.62)';
      ctx.beginPath();
      ctx.ellipse(o.x + o.w * 0.5, y + o.h * 0.3, o.w * 0.34, Math.max(10, o.h * 0.16), 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      if (o.onTap) {
        var hx = o.x;
        var hy = o.y;
        var hw = o.w;
        var hh = o.h + drop;
        var top = hy;
        var bot = hy + hh;
        if (o.clipTop != null && o.clipBottom != null) {
          if (bot < o.clipTop || hy > o.clipBottom) {
            hx = -1;
          } else {
            top = hy < o.clipTop ? o.clipTop : hy;
            bot = bot > o.clipBottom ? o.clipBottom : bot;
          }
        }
        if (hx >= 0 && bot > top) {
          XT.ui.add({
            id: o.id,
            x: hx,
            y: top,
            w: hw,
            h: bot - top,
            onTap: o.onTap,
            correct: !!o.correct
          });
        }
      }
      return y;
    },
    button: function (ctx, o) {
      var y = XT.ui.plate(ctx, o);
      var size = XT.ui.fit(ctx, o.label, o.w - 36, o.size || 48);
      XT.ui.text(ctx, o.label, o.x + o.w / 2, y + o.h / 2 + 1, {
        size: size,
        color: o.textColor || XT.C.ink,
        align: 'center',
        weight: '800'
      });
    },
    backButton: function (ctx, y, onBack) {
      var x = 28;
      var s = 92;
      var pressed = XT.input.downId === 'back';
      var cy = y + s / 2 + (pressed ? 4 : 0);
      ctx.fillStyle = '#E6D3BE';
      ctx.beginPath();
      ctx.arc(x + s / 2, y + s / 2 + (pressed ? 3 : 7), s / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(x + s / 2, cy, s / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = XT.C.ink;
      ctx.lineWidth = 8;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(x + s / 2 + 14, cy - 18);
      ctx.lineTo(x + s / 2 - 12, cy);
      ctx.lineTo(x + s / 2 + 14, cy + 18);
      ctx.stroke();
      XT.ui.add({ id: 'back', x: x, y: y, w: s, h: s + 8, onTap: onBack });
    },
    optionGrid: function (ctx, spec) {
      var colors = [
        { fill: '#FFE7A0', edge: '#E6B84A' },
        { fill: '#FFC6DC', edge: '#E89BB8' },
        { fill: '#B7E6FF', edge: '#7EC0E4' },
        { fill: '#C6F3C0', edge: '#86D098' }
      ];
      var pad = 32;
      var gap = 18;
      var bw = (XT.W - pad * 2 - gap) / 2;
      var bh = spec.bh || 188;
      var i, col, row, x, y, opt, fill, edge;
      for (i = 0; i < spec.options.length && i < 4; i++) {
        col = i % 2;
        row = Math.floor(i / 2);
        x = pad + col * (bw + gap);
        y = spec.y + row * (bh + gap);
        opt = spec.options[i];
        fill = colors[i].fill;
        edge = colors[i].edge;
        if (spec.flash === i && spec.flashKind === 'good') {
          fill = '#B6F3C4';
          edge = '#6FCB88';
        }
        if (spec.flash === i && spec.flashKind === 'bad') {
          fill = '#FFD5D0';
          edge = '#E7B0A8';
        }
        XT.ui.button(ctx, {
          id: 'opt-' + i,
          x: x,
          y: y,
          w: bw,
          h: bh,
          r: 54,
          label: opt.text,
          fill: fill,
          edge: edge,
          size: opt.text.length <= 1 ? 76 : (opt.text.length <= 2 ? 62 : 48),
          correct: opt.correct,
          onTap: (function (chosen, idx) {
            return function () { spec.onPick(chosen, idx); };
          })(opt, i)
        });
      }
    }
  };

  XT.input = {
    down: null,
    downId: null,
    sx: 0,
    sy: 0,
    moved: false,
    install: function () {
      var self = this;
      wx.onTouchStart(function (e) {
        var p = XT.touchPoint(e);
        var h;
        if (!p) return;
        self.sx = p.x;
        self.sy = p.y;
        self.lastX = p.x;
        self.lastY = p.y;
        self.moved = false;
        h = XT.ui.test(p.x, p.y);
        self.down = h;
        self.downId = h ? h.id : null;
      });
      wx.onTouchMove(function (e) {
        var p = XT.touchPoint(e);
        var page, screen, dx, dy;
        if (!p) return;
        if (Math.abs(p.x - self.sx) > 14 || Math.abs(p.y - self.sy) > 14) self.moved = true;
        dx = p.x - self.lastX;
        dy = p.y - self.lastY;
        self.lastX = p.x;
        self.lastY = p.y;
        if (!self.moved) return;
        page = XT.nav.current();
        screen = page && XT.screens[page.screen];
        if (screen && screen.onDrag) screen.onDrag(dx, dy);
      });
      wx.onTouchEnd(function (e) {
        var p = XT.touchPoint(e);
        var h = p ? XT.ui.test(p.x, p.y) : null;
        var down = self.down;
        var dx = p ? p.x - self.sx : 0;
        var dy = p ? p.y - self.sy : 0;
        var page, screen;
        self.down = null;
        self.downId = null;
        if (down && h && down.id === h.id && !self.moved && down.onTap) {
          if (down.id !== 'scrim') XT.sfx.tap();
          down.onTap();
          return;
        }
        if (p && (Math.abs(dx) > 70 || Math.abs(dy) > 70)) {
          page = XT.nav.current();
          screen = page && XT.screens[page.screen];
          if (screen && screen.onSwipe) screen.onSwipe(dx, dy);
        }
      });
      if (wx.onWheel) {
        wx.onWheel(function (e) {
          var page = XT.nav.current();
          var screen = page && XT.screens[page.screen];
          var delta = e && e.deltaY ? e.deltaY : 0;
          if (!XT.view.scale) return;
          if (screen && screen.onWheel) screen.onWheel(delta / XT.view.scale);
        });
      }
    }
  };

  XT.nav = {
    stack: [],
    fresh: function () {
      XT.overlay = null;
      XT.fx.parts = [];
      XT.toast.t = 0;
      XT.toast.text = '';
    },
    reset: function (screen, params) {
      this.fresh();
      this.stack = [{ screen: screen || 'home', params: params || {} }];
    },
    go: function (screen, params) {
      this.fresh();
      this.stack.push({ screen: screen, params: params || {} });
    },
    back: function () {
      this.fresh();
      if (this.stack.length > 1) this.stack.pop();
    },
    replace: function (screen, params) {
      this.fresh();
      if (this.stack.length) this.stack.pop();
      this.stack.push({ screen: screen, params: params || {} });
    },
    current: function () {
      return this.stack[this.stack.length - 1];
    }
  };

  XT.runtime.sync = function () {
    var cur = XT.nav.current();
    var screen;
    if (!cur) return;
    if (cur !== XT.runtime.page) {
      XT.runtime.page = cur;
      screen = XT.screens[cur.screen];
      if (screen && screen.enter) screen.enter(cur.params, cur);
    }
  };

  XT.fx = {
    parts: [],
    burst: function (x, y, color, n) {
      var i, a, s;
      for (i = 0; i < n; i++) {
        a = Math.random() * Math.PI * 2;
        s = 90 + Math.random() * 240;
        this.parts.push({
          x: x,
          y: y,
          vx: Math.cos(a) * s,
          vy: Math.sin(a) * s - 60,
          life: 0.55 + Math.random() * 0.4,
          age: 0,
          color: color,
          r: 5 + Math.random() * 7,
          shape: arguments[4] || 'dot'
        });
      }
    },
    update: function (dt) {
      var i, p;
      for (i = this.parts.length - 1; i >= 0; i--) {
        p = this.parts[i];
        p.age += dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += 320 * dt;
        if (p.age >= p.life) this.parts.splice(i, 1);
      }
    },
    draw: function (ctx) {
      var i, p, k;
      for (i = 0; i < this.parts.length; i++) {
        p = this.parts[i];
        k = 1 - p.age / p.life;
        ctx.globalAlpha = Math.max(0, k);
        ctx.fillStyle = p.color;
        if (p.shape === 'heart' && XT.draw && XT.draw.heart) {
          XT.draw.heart(ctx, p.x, p.y, p.r * (1.6 + k), true);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * (0.4 + k), 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    }
  };

  XT.toast = {
    text: '',
    t: 0,
    show: function (text) {
      this.text = text;
      this.t = 1.7;
    },
    draw: function (ctx) {
      var a, tw, y;
      if (this.t <= 0 || !this.text) return;
      a = Math.min(1, this.t * 3);
      if (this.t < 0.25) a = this.t / 0.25;
      y = 150;
      tw = Math.min(660, 34 * this.text.length + 72);
      ctx.save();
      ctx.globalAlpha = Math.max(0, a);
      ctx.fillStyle = 'rgba(58, 51, 68, 0.92)';
      XT.ui.roundRect(ctx, (XT.W - tw) / 2, y, tw, 78, 24);
      ctx.fill();
      XT.ui.text(ctx, this.text, XT.W / 2, y + 39, {
        size: 30,
        color: '#FFFFFF',
        align: 'center',
        weight: '700'
      });
      ctx.restore();
    }
  };

  XT.sfx = {
    ctx: null,
    ensure: function () {
      var AC, Ctor;
      if (this.ctx) return this.ctx;
      try {
        if (XT.env.isWeChat && typeof wx !== 'undefined' && wx.createWebAudioContext) {
          AC = wx.createWebAudioContext();
        }
      } catch (e) {
        AC = null;
      }
      if (!AC && typeof window !== 'undefined') {
        Ctor = window.AudioContext || window.webkitAudioContext;
        if (Ctor) {
          try { AC = new Ctor(); } catch (e2) { AC = null; }
        }
      }
      this.ctx = AC;
      return AC;
    },
    tone: function (freq, t0, dur, type, gain) {
      var ac = this.ensure();
      var o, g, t;
      if (!ac) return;
      if (ac.state === 'suspended' && ac.resume) {
        try { ac.resume(); } catch (e) {}
      }
      t = ac.currentTime + t0;
      o = ac.createOscillator();
      g = ac.createGain();
      o.type = type || 'sine';
      o.frequency.setValueAtTime(freq, t);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(gain || 0.07, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g);
      g.connect(ac.destination);
      o.start(t);
      o.stop(t + dur + 0.03);
    },
    tap: function () { this.tone(740, 0, 0.04, 'sine', 0.025); },
    correct: function () {
      this.tone(523, 0, 0.12, 'sine', 0.07);
      this.tone(659, 0.09, 0.14, 'sine', 0.07);
      this.tone(784, 0.18, 0.2, 'sine', 0.06);
    },
    wrong: function () {
      this.tone(311, 0, 0.12, 'triangle', 0.045);
      this.tone(233, 0.1, 0.18, 'triangle', 0.04);
    },
    win: function () {
      this.tone(523, 0, 0.12, 'sine', 0.07);
      this.tone(659, 0.12, 0.12, 'sine', 0.07);
      this.tone(784, 0.24, 0.12, 'sine', 0.07);
      this.tone(1046, 0.36, 0.3, 'sine', 0.06);
    },
    chime: function () {
      var notes = [392, 494, 587, 784];
      var i;
      for (i = 0; i < notes.length; i++) this.tone(notes[i], i * 0.24, 0.34, 'sine', 0.06);
    }
  };

  XT.util = {
    copy: function (text, done) {
      if (typeof wx !== 'undefined' && wx.setClipboardData) {
        wx.setClipboardData({
          data: text,
          success: function () { done(true); },
          fail: function () { done(false); }
        });
        return;
      }
      done(false);
    },
    vibrate: function () {
      try {
        if (typeof wx !== 'undefined' && wx.vibrateShort) wx.vibrateShort({ type: 'light' });
      } catch (e) {}
    }
  };

  XT.share = {
    send: function (payload) {
      if (typeof wx !== 'undefined' && wx.shareAppMessage) {
        try {
          wx.shareAppMessage({
            title: payload.title,
            query: payload.query || ''
          });
        } catch (e) {}
      }
    },
    textFor: function (payload) {
      return payload.text || payload.title;
    }
  };

  XT.starsFor = function (won, lives) {
    if (!won) return 0;
    if (lives >= 3) return 3;
    if (lives === 2) return 2;
    return 1;
  };

  XT.subjectStars = function (subject) {
    var levels = XT.catalog[subject].levels;
    var sum = 0;
    var i;
    for (i = 0; i < levels.length; i++) sum += XT.save.stars(subject, levels[i].id);
    return sum;
  };

  XT.starMax = function (subject) {
    return XT.catalog[subject].levels.length * 3;
  };
})(typeof GameGlobal !== 'undefined' ? GameGlobal : (typeof window !== 'undefined' ? window : this));