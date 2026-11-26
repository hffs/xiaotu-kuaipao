(function (g) {
  'use strict';
  var XT = g.XT;

  XT.screens.poem = {
    step: -1,
    phase: 'intro',
    light: 0,
    lightTo: 0.35,
    rx: 220,
    ry: 820,
    tx: 220,
    ty: 820,
    hop: 0,
    flash: -1,
    flashKind: '',
    shake: 0,
    cheer: '',
    options: [],
    saved: false,
    chimed: false,
    enter: function (params) {
      var id = params && params.id ? params.id : 'jingyesi';
      this.story = XT.poemById(id);
      this.step = -1;
      this.phase = 'intro';
      this.light = 0.35;
      this.lightTo = 0.35;
      this.rx = 250;
      this.ry = 820;
      this.tx = 250;
      this.ty = 820;
      this.hop = 0;
      this.flash = -1;
      this.flashKind = '';
      this.shake = 0;
      this.cheer = '';
      this.options = [];
      this.saved = false;
      this.chimed = false;
      if (XT.voice) XT.voice.stop();
      if (params && typeof params.debugStep === 'number') {
        if (params.debugStep >= 4) this.toRecap();
        else this.beginStop(params.debugStep, true);
      }
    },
    beginStop: function (index, instant) {
      var stop = this.story.stops[index];
      this.step = index;
      this.flash = -1;
      this.flashKind = '';
      this.cheer = '';
      this.lightTo = 0;
      this.options = XT.rand.shuffle(stop.options.map(function (text) {
        return { text: text, correct: text === stop.answer };
      }));
      this.tx = index % 2 === 0 ? 250 : 470;
      this.ty = 560;
      if (instant) {
        this.rx = this.tx;
        this.ry = this.ty;
        this.phase = 'ask';
        this.light = 0;
      } else {
        this.phase = 'walk';
      }
    },
    toRecap: function () {
      this.phase = 'recap';
      this.step = 4;
      this.lightTo = 1;
      this.tx = 640;
      this.ty = 1010;
      this.cheer = '';
      if (!this.saved) {
        XT.save.data.poem[this.story.id] = true;
        XT.save.persist();
        this.saved = true;
      }
      if (!this.chimed) {
        XT.sfx.chime();
        this.chimed = true;
      }
    },
    update: function (dt) {
      if (this.phase !== 'recap' && XT.voice && XT.voice.playing) XT.voice.stop();
      this.shake = Math.max(0, this.shake - dt * 2.2);
      this.light += (this.lightTo - this.light) * Math.min(1, dt * 2.4);
      var moving = Math.abs(this.tx - this.rx) > 2 || Math.abs(this.ty - this.ry) > 2;
      if (moving) this.hop += dt * 5;
      this.rx += (this.tx - this.rx) * Math.min(1, dt * 3);
      this.ry += (this.ty - this.ry) * Math.min(1, dt * 3);
      if (this.phase === 'walk' && !moving) this.phase = 'ask';
    },
    sceneName: function () {
      if (this.phase === 'intro' || this.phase === 'recap') return this.story.frame || 'court';
      var stop = this.story.stops[this.step];
      return stop ? stop.scene : 'court';
    },
    forward: function () {
      if (this.phase === 'intro') {
        this.beginStop(0, false);
        return;
      }
      if (this.phase === 'lit') {
        if (this.step >= this.story.stops.length - 1) this.toRecap();
        else this.beginStop(this.step + 1, false);
      }
    },
    answer: function (opt, index) {
      var stop;
      if (this.phase !== 'ask') return;
      this.flash = index;
      if (opt.correct) {
        stop = this.story.stops[this.step];
        this.phase = 'lit';
        this.flashKind = 'good';
        this.lightTo = 1;
        this.cheer = stop.line;
        this.ty = 820;
        XT.sfx.correct();
        XT.fx.burst(this.rx, this.ry - 100, '#FFF6C8', 10);
        XT.fx.burst(this.rx, this.ry - 120, '#FFB7D0', 5, 'heart');
      } else {
        this.flashKind = 'bad';
        this.shake = 1;
        this.cheer = '再试一次';
        XT.sfx.wrong();
      }
    },
    onSwipe: function (dx, dy) {
      if (dx < -80 || dy < -80) this.forward();
    },
    render: function (ctx) {
      var self = this;
      var stop = this.step >= 0 && this.step < this.story.stops.length ? this.story.stops[this.step] : null;
      var story = this.story;
      ctx.save();
      if (this.shake > 0) ctx.translate(Math.sin(XT.runtime.time * 55) * 8 * this.shake, 0);
      XT.draw.poemScene(ctx, this.sceneName(), XT.runtime.time, this.light);
      XT.draw.rabbit(ctx, this.rx, this.ry, {
        scale: this.phase === 'recap' ? 1.15 : 1.5,
        time: XT.runtime.time,
        hop: this.hop,
        mood: this.phase === 'lit' || this.phase === 'recap' ? 'cheer' : (this.phase === 'walk' ? 'run' : 'idle')
      });

      if (this.phase === 'intro') {
        XT.ui.text(ctx, story.title, 375, 300, { size: 72, align: 'center', weight: '800', color: '#3A3344' });
        XT.ui.text(ctx, story.dynasty + ' · ' + story.author, 375, 370, {
          size: 32, align: 'center', color: XT.C.soft, weight: '700'
        });
        XT.ui.text(ctx, '跟着兔兔走一走', 375, 450, { size: 36, align: 'center', weight: '800' });
        XT.ui.text(ctx, '把四句诗找齐', 375, 504, { size: 36, align: 'center', weight: '800' });
        XT.ui.button(ctx, {
          id: 'poem-start', x: 48, y: 1080, w: 654, h: 150,
          label: '出发', fill: '#FFE38A', edge: '#E6B423', size: 52,
          onTap: function () { self.forward(); }
        });
      } else if (this.phase === 'recap') {
        this.drawPoem(ctx, story, true);
        var clip = 'audio/poems/' + story.id + '.mp3';
        var playing = XT.voice && XT.voice.isPlaying(clip);
        if (playing) {
          ctx.fillStyle = 'rgba(255, 252, 246, 0.94)';
          XT.ui.roundRect(ctx, 250, 966, 250, 48, 24);
          ctx.fill();
          XT.ui.text(ctx, '正在读这首诗', XT.W / 2, 990, {
            size: 26, align: 'center', color: '#2E8FD6', weight: '800'
          });
        }
        XT.ui.button(ctx, {
          id: 'poem-chime', x: 48, y: 1040, w: 310, h: 110,
          label: playing ? '停一停' : '听一听',
          fill: playing ? '#C8F0FF' : '#FFFFFF',
          edge: playing ? '#6BB6E0' : '#E6D3BE',
          size: 36,
          onTap: function () { if (XT.voice) XT.voice.toggle(clip); }
        });
        XT.ui.button(ctx, {
          id: 'poem-home', x: 380, y: 1040, w: 322, h: 110,
          label: '我学会啦', fill: '#FFE38A', edge: '#E6B423', size: 36,
          onTap: function () {
            if (XT.voice) XT.voice.stop();
            XT.nav.reset('home');
          }
        });
      } else if (stop && (this.phase === 'ask' || this.phase === 'walk')) {
        this.drawAsk(ctx, stop);
      } else if (stop && this.phase === 'lit') {
        ctx.fillStyle = 'rgba(20, 28, 48, 0.42)';
        XT.ui.roundRect(ctx, 70, 108, 610, 160, 28);
        ctx.fill();
        XT.ui.text(ctx, stop.narration, XT.W / 2, 150, {
          size: 32, align: 'center', color: '#FFF6C8', weight: '800'
        });
        XT.ui.text(ctx, stop.line, XT.W / 2, 230, {
          size: 56, align: 'center', color: '#FFFFFF', weight: '800'
        });
        XT.ui.button(ctx, {
          id: 'poem-next', x: 48, y: 1080, w: 654, h: 150,
          label: this.step >= this.story.stops.length - 1 ? (this.story.doneLabel || '去院子里') : '往前走',
          fill: '#FFE38A', edge: '#E6B423', size: 48,
          onTap: function () { self.forward(); }
        });
      }

      XT.ui.backButton(ctx, 28, function () {
        if (self.phase === 'intro' || self.phase === 'recap') {
          if (XT.voice) XT.voice.stop();
          XT.nav.back();
        } else XT.overlay = { type: 'leave' };
      });
      ctx.restore();
    },
    drawAsk: function (ctx, stop) {
      var self = this;
      var blank = this.phase === 'ask' ? '？' : stop.answer;
      ctx.fillStyle = 'rgba(255, 246, 232, 0.94)';
      XT.ui.roundRect(ctx, 24, 620, 702, 680, 36);
      ctx.fill();
      var boxW = stop.answer.length > 1 ? 150 : 96;
      var lineW = stop.before.length * 52 + boxW + (stop.after ? stop.after.length * 52 + 16 : 0);
      var lineX = (XT.W - lineW) / 2;
      XT.ui.text(ctx, stop.narration, XT.W / 2, 680, { size: 30, align: 'center', color: XT.C.soft, weight: '800' });
      XT.ui.text(ctx, stop.before, lineX, 770, { size: 48, align: 'left', weight: '800' });
      ctx.fillStyle = this.phase === 'ask' ? '#FFF1C9' : '#D9F5D6';
      XT.ui.roundRect(ctx, lineX + stop.before.length * 52, 730, boxW, 80, 18);
      ctx.fill();
      XT.ui.text(ctx, blank, lineX + stop.before.length * 52 + boxW / 2, 770, {
        size: 44, align: 'center', weight: '800', color: '#C47A2A'
      });
      if (stop.after) {
        XT.ui.text(ctx, stop.after, lineX + stop.before.length * 52 + boxW + 16, 770, { size: 48, align: 'left', weight: '800' });
      }
      XT.ui.text(ctx, stop.hint, XT.W / 2, 850, { size: 26, align: 'center', color: XT.C.soft, weight: '700' });
      if (this.cheer && this.phase === 'ask') {
        XT.widgets.banner(ctx, this.cheer, XT.W / 2, 600);
      }
      XT.ui.optionGrid(ctx, {
        options: this.options,
        y: 900,
        bh: 160,
        flash: this.flash,
        flashKind: this.flashKind,
        onPick: function (opt, idx) { self.answer(opt, idx); }
      });
    },
    drawPoem: function (ctx, story) {
      var lines = [];
      var i;
      for (i = 0; i < story.stops.length; i++) lines.push(story.stops[i].line);
      XT.ui.text(ctx, story.title, 375, 300, { size: 64, align: 'center', weight: '800' });
      XT.ui.text(ctx, story.dynasty + ' · ' + story.author, 375, 370, {
        size: 30, align: 'center', color: XT.C.soft, weight: '700'
      });
      for (i = 0; i < lines.length; i++) {
        XT.ui.text(ctx, lines[i], 375, 470 + i * 90, { size: 48, align: 'center', weight: '800' });
      }
    },
    pub: function () {
      return { step: this.step, phase: this.phase, light: this.light };
    }
  };
})(typeof GameGlobal !== 'undefined' ? GameGlobal : (typeof window !== 'undefined' ? window : this));