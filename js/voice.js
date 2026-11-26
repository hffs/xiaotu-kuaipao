(function (g) {
  'use strict';
  var XT = g.XT;

  XT.voice = {
    ctx: null,
    src: '',
    playing: false,
    playId: 0,
    endedFor: 0,
    ensure: function () {
      var ctx, self;
      if (this.ctx) return this.ctx;
      if (typeof wx === 'undefined' || !wx.createInnerAudioContext) return null;
      ctx = wx.createInnerAudioContext();
      self = this;
      try { ctx.obeyMuteSwitch = false; } catch (e) {}
      if (ctx.onEnded) {
        ctx.onEnded(function () {
          if (self.endedFor !== self.playId) return;
          self.playing = false;
          self.src = '';
        });
      }
      if (ctx.onError) {
        ctx.onError(function () {
          if (self.endedFor !== self.playId) return;
          self.playing = false;
          self.src = '';
          if (XT.toast) XT.toast.show('没听清，再点一次');
        });
      }
      this.ctx = ctx;
      return ctx;
    },
    stop: function () {
      this.playId += 1;
      this.playing = false;
      this.src = '';
      if (!this.ctx) return;
      try { this.ctx.stop(); } catch (e2) {}
    },
    toggle: function (src) {
      var ctx;
      if (!src) return false;
      if (this.playing && this.src === src) {
        this.stop();
        return false;
      }
      ctx = this.ensure();
      if (!ctx) {
        if (XT.toast) XT.toast.show('没听清，再点一次');
        return false;
      }
      if (this.ctx && this.playing) this.stop();
      this.playId += 1;
      this.endedFor = this.playId;
      this.src = src;
      this.playing = true;
      try {
        ctx.src = src;
        ctx.play();
      } catch (e3) {
        this.playing = false;
        this.src = '';
        if (XT.toast) XT.toast.show('没听清，再点一次');
        return false;
      }
      return true;
    },
    isPlaying: function (src) {
      return !!(this.playing && this.src === src);
    }
  };
})(typeof GameGlobal !== 'undefined' ? GameGlobal : (typeof window !== 'undefined' ? window : this));
