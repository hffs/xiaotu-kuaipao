(function () {
  var canvas = document.getElementById('game');
  var start = [];
  var move = [];
  var end = [];
  var wheel = [];

  function point(e) {
    var rect = canvas.getBoundingClientRect();
    var src = e.changedTouches ? e.changedTouches[0] : e;
    return {
      clientX: src.clientX - rect.left,
      clientY: src.clientY - rect.top,
      identifier: 0
    };
  }

  function emit(list, e) {
    var touch = point(e);
    var i;
    for (i = 0; i < list.length; i++) {
      list[i]({ touches: [touch], changedTouches: [touch] });
    }
  }

  canvas.addEventListener('pointerdown', function (e) {
    canvas.setPointerCapture && canvas.setPointerCapture(e.pointerId);
    emit(start, e);
  });
  canvas.addEventListener('pointermove', function (e) {
    if (e.buttons) emit(move, e);
  });
  canvas.addEventListener('pointerup', function (e) { emit(end, e); });
  canvas.addEventListener('pointercancel', function (e) { emit(end, e); });
  canvas.addEventListener('wheel', function (e) {
    e.preventDefault();
    var i;
    for (i = 0; i < wheel.length; i++) wheel[i]({ deltaY: e.deltaY });
  }, { passive: false });

  window.wx = {
    createCanvas: function () { return canvas; },
    getSystemInfoSync: function () {
      var rect = canvas.getBoundingClientRect();
      return {
        screenWidth: rect.width || 390,
        screenHeight: rect.height || 780,
        windowWidth: rect.width || 390,
        windowHeight: rect.height || 780,
        pixelRatio: window.devicePixelRatio || 1,
        platform: 'browser',
        safeArea: { top: 0, bottom: rect.height || 780 }
      };
    },
    onTouchStart: function (fn) { start.push(fn); },
    onTouchMove: function (fn) { move.push(fn); },
    onTouchEnd: function (fn) { end.push(fn); },
    onWheel: function (fn) { wheel.push(fn); },
    onWindowResize: function () {},
    getLaunchOptionsSync: function () {
      var query = {};
      var search = window.location.search.replace(/^\?/, '');
      var parts, i, pair;
      if (search) {
        parts = search.split('&');
        for (i = 0; i < parts.length; i++) {
          pair = parts[i].split('=');
          query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
        }
      }
      return { query: query, scene: 1001 };
    },
    setStorageSync: function (key, data) {
      localStorage.setItem(key, typeof data === 'string' ? data : JSON.stringify(data));
    },
    getStorageSync: function (key) {
      return localStorage.getItem(key) || '';
    },
    setClipboardData: function (opt) {
      var text = opt.data || '';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () {
          if (opt.success) opt.success();
        }, function () {
          fallbackCopy(text, opt);
        });
      } else {
        fallbackCopy(text, opt);
      }
    },
    createInnerAudioContext: function () {
      var audio = new Audio();
      var ended = [];
      var errored = [];
      var api = {
        src: '',
        autoplay: false,
        loop: false,
        volume: 1,
        obeyMuteSwitch: true,
        play: function () {
          var src = resolveAudioSrc(api.src);
          if (!src) return;
          if (audio.getAttribute('data-raw') !== api.src) {
            audio.src = src;
            audio.setAttribute('data-raw', api.src);
          }
          audio.volume = api.volume == null ? 1 : api.volume;
          audio.loop = !!api.loop;
          if (audio.ended) {
            try { audio.currentTime = 0; } catch (e) {}
          }
          var p = audio.play();
          if (p && p.catch) {
            p.catch(function () {
              var i;
              for (i = 0; i < errored.length; i++) errored[i]({ errMsg: 'play fail' });
            });
          }
        },
        stop: function () {
          audio.pause();
          try { audio.currentTime = 0; } catch (e) {}
        },
        pause: function () { audio.pause(); },
        onEnded: function (fn) { if (fn) ended.push(fn); },
        onError: function (fn) { if (fn) errored.push(fn); },
        onStop: function () {},
        onCanplay: function () {},
        destroy: function () {
          audio.pause();
          audio.removeAttribute('src');
          try { audio.load(); } catch (e2) {}
        },
        _node: audio
      };
      audio.preload = 'auto';
      audio.addEventListener('ended', function () {
        var i;
        for (i = 0; i < ended.length; i++) ended[i]();
      });
      audio.addEventListener('error', function () {
        var i;
        for (i = 0; i < errored.length; i++) errored[i]({ errMsg: 'audio error' });
      });
      return api;
    },
    shareAppMessage: function (opt) {
      window.__XT_SHARES = window.__XT_SHARES || [];
      window.__XT_SHARES.push(opt || {});
    },
    vibrateShort: function () {},
    showToast: function (opt) {
      if (window.XT && XT.toast) XT.toast.show(opt.title || '');
    }
  };

  function resolveAudioSrc(src) {
    if (!src) return '';
    if (/^https?:/i.test(src) || src.indexOf('data:') === 0 || src.charAt(0) === '/') return src;
    return new URL('../' + src, window.location.href).href;
  }

  function fallbackCopy(text, opt) {
    var area = document.createElement('textarea');
    area.value = text;
    document.body.appendChild(area);
    area.select();
    try {
      document.execCommand('copy');
      if (opt.success) opt.success();
    } catch (err) {
      if (opt.fail) opt.fail(err);
    }
    document.body.removeChild(area);
  }

  window.addEventListener('resize', function () {
    if (window.XT && XT.view && XT.view.canvas) XT.view.resize();
  });
})();