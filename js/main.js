(function (g) {
  'use strict';
  var XT = g.XT;

  XT.openHash = function (hash) {
    var h = (hash || '').replace(/^#/, '');
    var bits;
    if (!h || h === 'home') {
      XT.nav.reset('home');
      return;
    }
    if (h === 'math' || h === 'chinese' || h === 'english') {
      XT.nav.reset('home');
      XT.nav.go('levels', { subject: h });
      return;
    }
    if (h.indexOf('play-') === 0) {
      bits = h.split('-');
      XT.nav.reset('home');
      XT.nav.go('levels', { subject: bits[1] });
      XT.nav.go('track', { subject: bits[1], level: Number(bits[2] || 1) });
      return;
    }
    if (h === 'poems') {
      XT.nav.reset('home');
      XT.nav.go('poems');
      return;
    }
    if (h === 'poem' || h.indexOf('poem-') === 0) {
      XT.nav.reset('home');
      XT.nav.go('poems');
      if (h === 'poem-room') XT.nav.go('poem', { id: 'jingyesi', debugStep: 0 });
      else if (h === 'poem-moon') XT.nav.go('poem', { id: 'jingyesi', debugStep: 2 });
      else if (h === 'poem-end') XT.nav.go('poem', { id: 'jingyesi', debugStep: 4 });
      else if (h === 'poem-chunxiao') XT.nav.go('poem', { id: 'chunxiao', debugStep: 0 });
      else if (h === 'poem-guanque') XT.nav.go('poem', { id: 'guanque', debugStep: 0 });
      else if (h === 'poem-chunxiao-end') XT.nav.go('poem', { id: 'chunxiao', debugStep: 4 });
      else if (h === 'poem-guanque-end') XT.nav.go('poem', { id: 'guanque', debugStep: 4 });
      else XT.nav.go('poem', { id: 'jingyesi' });
      return;
    }
    if (h === 'social') {
      XT.nav.reset('home');
      XT.nav.go('social');
      return;
    }
    if (h === 'levels') {
      XT.nav.reset('home');
      XT.nav.go('levels', { subject: 'math' });
    }
  };

  XT.start = function () {
    var last = 0;
    XT.save.load();
    XT.view.mount();
    XT.input.install();
    XT.nav.reset('home');
    if (typeof location !== 'undefined' && location.hash) XT.openHash(location.hash);
    if (typeof wx !== 'undefined' && wx.getLaunchOptionsSync) {
      try {
        var launch = wx.getLaunchOptionsSync() || {};
        var q = launch.query || {};
        if (q.subject && (typeof location === 'undefined' || !location.hash)) {
          XT.toast.show('好友分享了' + (XT.catalog[q.subject] ? XT.catalog[q.subject].name : '一关'));
        }
      } catch (e) {}
    }
    XT.raf = function (fn) {
      var c = XT.view.canvas;
      if (c && c.requestAnimationFrame) return c.requestAnimationFrame(fn);
      if (typeof requestAnimationFrame !== 'undefined') return requestAnimationFrame(fn);
      return setTimeout(function () { fn(Date.now()); }, 16);
    };
    function frame(t) {
      var now = t || Date.now();
      var dt = last ? Math.min(0.034, (now - last) / 1000) : 0.016;
      var info, page, screen, ctx;
      last = now;
      if (dt < 0) dt = 0.016;
      XT.runtime.time += dt;
      try {
        info = wx.getSystemInfoSync();
        if (info.windowWidth !== XT.view.sw || info.windowHeight !== XT.view.sh) XT.view.resize();
      } catch (e2) {}
      XT.runtime.sync();
      page = XT.nav.current();
      screen = page && XT.screens[page.screen];
      if (screen && screen.update) screen.update(dt, page);
      XT.fx.update(dt);
      if (XT.toast.t > 0) XT.toast.t -= dt;
      XT.ui.begin();
      ctx = XT.view.ctx;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = '#E7C79A';
      ctx.fillRect(0, 0, XT.view.canvas.width, XT.view.canvas.height);
      XT.view.apply();
      ctx.save();
      try {
        if (screen && screen.render) screen.render(ctx, page);
      } catch (err) {
        if (XT.runtime.lastErr !== String(err)) {
          XT.runtime.lastErr = String(err);
          if (typeof console !== 'undefined') console.error(err);
        }
      }
      ctx.restore();
      XT.fx.draw(ctx);
      if (XT.overlayRender) XT.overlayRender(ctx);
      XT.toast.draw(ctx);
      XT.raf(frame);
    }
    XT.raf(frame);
  };

  XT.start();
})(typeof GameGlobal !== 'undefined' ? GameGlobal : (typeof window !== 'undefined' ? window : this));