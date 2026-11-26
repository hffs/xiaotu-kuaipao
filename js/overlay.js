(function (g) {
  'use strict';
  var XT = g.XT;

  function scrim(ctx) {
    ctx.fillStyle = 'rgba(40, 28, 22, 0.46)';
    ctx.fillRect(0, 0, XT.W, XT.H);
    XT.ui.add({ id: 'scrim', x: 0, y: 0, w: XT.W, h: XT.H, onTap: function () {} });
  }

  function card(ctx, x, y, w, h) {
    ctx.fillStyle = '#FFF8EE';
    XT.ui.roundRect(ctx, x, y, w, h, 36);
    ctx.fill();
  }

  XT.overlayRender = function (ctx) {
    var o = XT.overlay;
    var x, y, w;
    if (!o) return;
    scrim(ctx);
    x = 48;
    w = XT.W - 96;
    if (o.type === 'leave') {
      y = 420;
      card(ctx, x, y, w, 420);
      XT.ui.text(ctx, '先离开吗？', XT.W / 2, y + 90, { size: 48, align: 'center', weight: '800' });
      XT.ui.text(ctx, '这一关要重新开始', XT.W / 2, y + 160, { size: 32, align: 'center', color: XT.C.soft, weight: '700' });
      XT.ui.button(ctx, {
        id: 'stay', x: x + 36, y: y + 230, w: w - 72, h: 96, label: '继续玩',
        fill: '#B6F0B4', edge: '#73C98A', size: 40,
        onTap: function () { XT.overlay = null; }
      });
      XT.ui.button(ctx, {
        id: 'leave', x: x + 36, y: y + 340, w: w - 72, h: 64, label: '离开', drop: 4,
        fill: '#FFFFFF', edge: '#E6D3BE', size: 32,
        onTap: function () { XT.nav.back(); }
      });
    } else if (o.type === 'reset') {
      y = 430;
      card(ctx, x, y, w, 400);
      XT.ui.text(ctx, '清除本机进度？', XT.W / 2, y + 90, { size: 44, align: 'center', weight: '800' });
      XT.ui.text(ctx, '星星记录会一起清掉', XT.W / 2, y + 160, { size: 30, align: 'center', color: XT.C.soft, weight: '700' });
      XT.ui.button(ctx, {
        id: 'reset-yes', x: x + 36, y: y + 220, w: w - 72, h: 90, label: '清除',
        fill: '#FFB7D5', edge: '#E48AB0', size: 36,
        onTap: function () {
          XT.save.reset();
          XT.overlay = null;
          XT.toast.show('进度已清除');
        }
      });
      XT.ui.button(ctx, {
        id: 'reset-no', x: x + 36, y: y + 326, w: w - 72, h: 56, label: '取消', drop: 4,
        fill: '#FFFFFF', edge: '#E6D3BE', size: 28,
        onTap: function () { XT.overlay = null; }
      });
    } else if (o.type === 'share') {
      XT.renderShare(ctx, o, x, w);
    } else if (o.type === 'challenge') {
      y = 360;
      card(ctx, x, y, w, 560);
      XT.ui.text(ctx, '向好友挑战', XT.W / 2, y + 70, { size: 40, align: 'center', weight: '800' });
      XT.ui.text(ctx, o.levelTitle, XT.W / 2, y + 130, { size: 28, align: 'center', color: XT.C.soft, weight: '700' });
      XT.ui.text(ctx, o.prompt, XT.W / 2, y + 220, { size: 48, align: 'center', weight: '800' });
      XT.ui.text(ctx, '好友在自己的手机上作答', XT.W / 2, y + 300, {
        size: 28, align: 'center', color: XT.C.soft, weight: '700'
      });
      XT.ui.button(ctx, {
        id: 'send-ch', x: x + 36, y: y + 360, w: w - 72, h: 96, label: '模拟发送',
        fill: '#A9E2FF', edge: '#6BB6E0', size: 36,
        onTap: function () {
          XT.save.data.sent.unshift({
            id: 'sent-' + Date.now(),
            subject: o.subject,
            levelTitle: o.levelTitle,
            prompt: o.prompt
          });
          if (XT.save.data.sent.length > 8) XT.save.data.sent.length = 8;
          XT.save.persist();
          XT.share.send({
            title: '小兔快跑挑战：' + o.prompt,
            query: 'challenge=1&subject=' + o.subject,
            text: '我在小兔快跑向你挑战：' + o.prompt
          });
          XT.overlay = null;
          XT.toast.show('已模拟发送挑战');
        }
      });
      XT.ui.button(ctx, {
        id: 'send-no', x: x + 36, y: y + 472, w: w - 72, h: 64, label: '返回', drop: 4,
        fill: '#FFFFFF', edge: '#E6D3BE', size: 30,
        onTap: function () { XT.overlay = null; }
      });
    }
  };

  XT.renderShare = function (ctx, o, x, w) {
    var y = 180;
    var payload = o.payload;
    card(ctx, x, y, w, 980);
    XT.draw.rabbit(ctx, 200, y + 250, { scale: 1.15, time: XT.runtime.time, mood: 'cheer' });
    XT.ui.text(ctx, '小兔快跑', XT.W / 2 + 40, y + 150, { size: 28, align: 'center', color: XT.C.soft, weight: '700' });
    XT.ui.text(ctx, payload.levelTitle || '', XT.W / 2 + 40, y + 210, { size: 40, align: 'center', weight: '800' });
    if (payload.stars) XT.draw.stars(ctx, XT.W / 2 - 10, y + 280, payload.stars, 36, 16);
    wrapText(ctx, payload.text, XT.W / 2, y + 360, w - 80, {
      size: 28, align: 'center', color: XT.C.ink, weight: '700', lineH: 42
    });
    if (o.step === 'groups') {
      XT.ui.text(ctx, '选择一个群', XT.W / 2, y + 470, { size: 30, align: 'center', weight: '800' });
      XT.ui.button(ctx, {
        id: 'grp-1', x: x + 36, y: y + 520, w: w - 72, h: 90, label: '家庭群',
        fill: '#FFE38A', edge: '#E6B423', size: 36,
        onTap: function () { XT.finishShare(payload, '家庭群'); }
      });
      XT.ui.button(ctx, {
        id: 'grp-2', x: x + 36, y: y + 630, w: w - 72, h: 90, label: '一年级小队',
        fill: '#B6F0B4', edge: '#73C98A', size: 36,
        onTap: function () { XT.finishShare(payload, '一年级小队'); }
      });
    } else {
      XT.ui.button(ctx, {
        id: 'copy-share', x: x + 36, y: y + 500, w: w - 72, h: 96, label: '复制分享文案',
        fill: '#FFFFFF', edge: '#E6D3BE', size: 36,
        onTap: function () {
          XT.util.copy(payload.text, function (ok) {
            XT.toast.show(ok ? '已复制，可以贴到微信' : '没能复制');
          });
        }
      });
      XT.ui.button(ctx, {
        id: 'do-share', x: x + 36, y: y + 620, w: w - 72, h: 96, label: XT.env.isWeChat ? '发给微信群' : '发到微信群',
        fill: '#A9E2FF', edge: '#6BB6E0', size: 36,
        onTap: function () {
          if (XT.env.isWeChat) {
            XT.share.send(payload);
            XT.toast.show('请选择要分享的群');
            XT.overlay = null;
          } else {
            o.step = 'groups';
          }
        }
      });
    }
    XT.ui.button(ctx, {
      id: 'share-close', x: x + 36, y: y + 860, w: w - 72, h: 80, label: '关闭', drop: 4,
      fill: '#FFF6E8', edge: '#E6D3BE', size: 32,
      onTap: function () { XT.overlay = null; }
    });
  };

  function wrapText(ctx, text, x, y, maxW, opt) {
  var size = opt.size || 28;
  var lineH = opt.lineH || size + 12;
  var line = '';
  var yy = y;
  var i, ch;
  ctx.font = (opt.weight || '700') + ' ' + size + 'px ' + XT.FONT;
  for (i = 0; i < text.length; i++) {
    ch = line + text.charAt(i);
    if (ctx.measureText(ch).width > maxW && line) {
      XT.ui.text(ctx, line, x, yy, opt);
      line = text.charAt(i);
      yy += lineH;
    } else {
      line = ch;
    }
  }
  if (line) XT.ui.text(ctx, line, x, yy, opt);
}

XT.finishShare = function (payload, group) {
    XT.share.send(payload);
    XT.overlay = null;
    XT.toast.show('已模拟分享到「' + group + '」');
  };
})(typeof GameGlobal !== 'undefined' ? GameGlobal : (typeof window !== 'undefined' ? window : this));