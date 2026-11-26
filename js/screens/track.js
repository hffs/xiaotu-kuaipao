(function (g) {
  'use strict';
  var XT = g.XT;

  function layoutOf(run) {
    var kind = run.q && run.q.visual ? run.q.visual.kind : '';
    var sceneH = 420;
    var cardH = 200;
    var cardY = 608;
    var btnY = 836;
    if (kind === 'icon' || kind === 'char' || kind === 'color' || kind === 'count' || kind === 'compare' || kind === 'pinyin') {
      sceneH = 348;
      cardH = 300;
      cardY = 528;
      btnY = 852;
    } else if (kind === 'story') {
      sceneH = 360;
      cardH = 280;
      cardY = 540;
      btnY = 848;
    } else if (kind === 'dots') {
      sceneH = 390;
      cardH = 246;
      cardY = 568;
      btnY = 840;
    }
    return {
      scene: { x: 28, y: 150, w: 694, h: sceneH },
      card: { x: 28, y: cardY, w: 694, h: cardH },
      btnY: btnY,
      btnH: 176
    };
  }

  XT.screens.track = {
    run: null,
    enter: function (params) {
      var level = XT.levelById(params.subject, params.level);
      var bank = level && XT.banks[level.bank];
      this.run = {
        subject: params.subject,
        level: level,
        bank: bank || [],
        used: [],
        q: null,
        options: [],
        correct: 0,
        lives: 3,
        phase: 'ask',
        phaseT: 0,
        show: 0,
        to: 0,
        hop: 0,
        shake: 0,
        cheer: '',
        flash: -1,
        flashKind: '',
        lastQ: null,
        mistakes: 0,
        missing: !bank
      };
      if (bank) this.deal(null);
    },
    deal: function (type) {
      var run = this.run;
      var q = XT.pickQuestion(run.bank, run.used, type, run.q);
      run.used.push(q.id);
      run.q = q;
      run.lastQ = q;
      run.options = XT.rand.shuffle(q.options.map(function (text) {
        return { text: text, correct: text === q.answer };
      }));
      run.flash = -1;
      run.cheer = '';
    },
    update: function (dt) {
      var run = this.run;
      var moving;
      if (!run || run.missing) return;
      run.shake = Math.max(0, run.shake - dt * 2.4);
      moving = Math.abs(run.to - run.show) > 0.006;
      if (moving || run.phase === 'good') run.hop += dt * 5;
      run.show += (run.to - run.show) * Math.min(1, dt * 3.4);
      if (run.phase === 'good' || run.phase === 'bad' || run.phase === 'out') run.phaseT += dt;
      if (run.phase === 'good' && run.phaseT > (run.correct >= 10 ? 1.15 : 0.92)) {
        if (run.correct >= 10) this.finish(true);
        else {
          run.phase = 'ask';
          this.deal(null);
        }
      }
      if (run.phase === 'bad' && run.phaseT > 0.86) {
        run.phase = 'ask';
        this.deal(run.q.type);
      }
      if (run.phase === 'out' && run.phaseT > 0.95) this.finish(false);
    },
    finish: function (won) {
      var run = this.run;
      XT.nav.replace('result', {
        subject: run.subject,
        levelId: run.level.id,
        won: won,
        stars: XT.starsFor(won, run.lives),
        lives: run.lives,
        mistakes: run.mistakes,
        question: run.lastQ
      });
    },
    answer: function (opt, index) {
      var run = this.run;
      var pos;
      if (!run || run.phase !== 'ask') return;
      run.flash = index;
      if (opt.correct) {
        run.phase = 'good';
        run.phaseT = 0;
        run.flashKind = 'good';
        run.correct += 1;
        run.to = run.correct / 10;
        run.cheer = XT.rand.pick(['真棒！', '答对啦！', '兔兔出发！']);
        XT.sfx.correct();
        pos = this.rabbitPos();
        XT.fx.burst(pos.x, pos.y - 80, '#FFD15C', 8);
        XT.fx.burst(pos.x, pos.y - 90, '#FF8FB8', 6, 'heart');
      } else {
        run.lives -= 1;
        run.mistakes += 1;
        run.flashKind = 'bad';
        run.shake = 1;
        run.phaseT = 0;
        run.phase = run.lives <= 0 ? 'out' : 'bad';
        run.cheer = run.lives <= 0 ? '小心心用完啦' : '再试一次';
        XT.sfx.wrong();
        XT.util.vibrate();
      }
    },
    rabbitPos: function () {
      var run = this.run;
      var L = layoutOf(run);
      return {
        x: L.scene.x + XT.draw.trackX(L.scene.w, run.show),
        y: L.scene.y + L.scene.h * 0.8
      };
    },
    render: function (ctx) {
      var run = this.run;
      var sub = XT.catalog[run.subject];
      var L, S, i, mood;
      ctx.fillStyle = XT.C.cream;
      ctx.fillRect(0, 0, XT.W, XT.H);
      XT.ui.backButton(ctx, 28, function () {
        XT.overlay = { type: 'leave' };
      });
      XT.ui.text(ctx, run.level.title, XT.W / 2, 58, { size: 40, align: 'center', weight: '800' });
      XT.ui.text(ctx, '已跑 ' + run.correct + ' / 10 步', XT.W / 2, 104, {
        size: 26, align: 'center', color: XT.C.soft, weight: '700'
      });
      for (i = 0; i < 3; i++) XT.draw.heart(ctx, 560 + i * 56, 78, 42, i < run.lives);

      if (run.missing) {
        XT.ui.text(ctx, '这一关还没有题目', XT.W / 2, 640, { size: 36, align: 'center', weight: '800' });
        return;
      }

      L = layoutOf(run);
      S = L.scene;
      ctx.save();
      XT.ui.roundRect(ctx, S.x, S.y, S.w, S.h, 36);
      ctx.clip();
      ctx.translate(S.x, S.y);
      if (run.shake > 0) ctx.translate(Math.sin(XT.runtime.time * 58) * 8 * run.shake, 0);
      XT.draw.trackScene(ctx, run.level.scene, S.w, S.h, XT.runtime.time, run.show, run.level.variant || 1);
      mood = 'idle';
      if (Math.abs(run.to - run.show) > 0.008 || run.phase === 'good') mood = 'run';
      if (run.phase === 'out') mood = 'sad';
      XT.draw.rabbit(ctx, XT.draw.trackX(S.w, run.show), S.h * 0.8, {
        scale: 1.36,
        time: XT.runtime.time,
        hop: run.hop,
        mood: mood
      });
      if (run.cheer) XT.widgets.banner(ctx, run.cheer, S.w / 2, 48);
      ctx.restore();

      XT.widgets.questionCard(ctx, run.q, L.card);
      XT.ui.optionGrid(ctx, {
        options: run.options,
        y: L.btnY,
        bh: L.btnH,
        flash: run.flash,
        flashKind: run.flashKind,
        onPick: function (opt, idx) { XT.screens.track.answer(opt, idx); }
      });
      if (run.phase === 'ask') {
        XT.ui.text(ctx, '点一个答案', XT.W / 2, L.btnY - 22, {
          size: 22, align: 'center', color: sub.color, weight: '700'
        });
      }
    },
    pub: function () {
      var run = this.run;
      return {
        phase: run.phase,
        correct: run.correct,
        lives: run.lives,
        qid: run.q && run.q.id
      };
    }
  };
})(typeof GameGlobal !== 'undefined' ? GameGlobal : (typeof window !== 'undefined' ? window : this));