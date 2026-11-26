(function () {
  function find(id) {
    var i, h;
    for (i = 0; i < XT.ui.hits.length; i++) {
      h = XT.ui.hits[i];
      if (h.id === id) return h;
    }
    return null;
  }

  window.__XT = {
    tap: function (id) { return XT.ui.invoke(id); },
    ids: function () {
      return XT.ui.hits.map(function (h) { return h.id; });
    },
    rect: function (id) {
      var h = find(id);
      if (!h) return null;
      return { x: h.x, y: h.y, w: h.w, h: h.h, correct: !!h.correct };
    },
    correctId: function () {
      var i;
      for (i = 0; i < XT.ui.hits.length; i++) {
        if (XT.ui.hits[i].correct) return XT.ui.hits[i].id;
      }
      return null;
    },
    screen: function () { return XT.nav.current().screen; },
    track: function () { return XT.screens.track.pub && XT.screens.track.run ? XT.screens.track.pub() : null; },
    poem: function () { return XT.screens.poem.pub(); },
    save: function () { return JSON.parse(JSON.stringify(XT.save.data)); },
    overlay: function () { return XT.overlay && XT.overlay.type; }
  };

  window.addEventListener('keydown', function (e) {
    if (e.key >= '1' && e.key <= '4') XT.ui.invoke('opt-' + (Number(e.key) - 1));
    if (e.key === 'Escape') XT.overlay = null;
  });
})();