(function (g) {
  'use strict';
  var XT = g.XT;
  var icons = {};

  function c(ctx, x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  function eye(ctx, x, y) {
    c(ctx, x, y, 3.2, '#3A3344');
    c(ctx, x + 1.1, y - 1.1, 1.1, '#FFFFFF');
  }
  function poly(ctx, pts, color) {
    var i;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    ctx.closePath();
    ctx.fill();
  }

  icons.sun = function (ctx) {
    var i, a;
    ctx.strokeStyle = '#F0B429';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    for (i = 0; i < 8; i++) {
      a = i * Math.PI / 4;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * 22, Math.sin(a) * 22);
      ctx.lineTo(Math.cos(a) * 34, Math.sin(a) * 34);
      ctx.stroke();
    }
    c(ctx, 0, 0, 18, '#FFD15C');
  };
  icons.moon = function (ctx) {
    c(ctx, 0, 0, 34, '#24385C');
    c(ctx, -4, 2, 22, '#FFF3B0');
    c(ctx, 10, -4, 18, '#24385C');
    c(ctx, -10, -4, 3, '#F0C14A');
  };
  icons.water = function (ctx) {
    ctx.strokeStyle = '#3D9BE0';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-30, -8);
    ctx.quadraticCurveTo(-15, -22, 0, -8);
    ctx.quadraticCurveTo(15, 6, 30, -8);
    ctx.moveTo(-30, 10);
    ctx.quadraticCurveTo(-15, -4, 0, 10);
    ctx.quadraticCurveTo(15, 24, 30, 10);
    ctx.stroke();
  };
  icons.fire = function (ctx) {
    poly(ctx, [[0, -36], [16, -8], [10, -8], [22, 18], [0, 8], [-22, 18], [-10, -8], [-16, -8]], '#FF8A3D');
    poly(ctx, [[0, -16], [8, 4], [0, 16], [-8, 4]], '#FFD15C');
  };
  icons.mountain = function (ctx) {
    poly(ctx, [[-34, 28], [-8, -28], [10, 8], [18, -8], [38, 28]], '#6FBF73');
    poly(ctx, [[-8, -28], [2, -10], [-4, -6]], '#FFF');
  };
  icons.tree = function (ctx) {
    ctx.fillStyle = '#A9784A';
    ctx.fillRect(-6, 4, 12, 28);
    c(ctx, 0, -10, 22, '#3FA96A');
    c(ctx, -16, 0, 14, '#2F9E4F');
    c(ctx, 16, 2, 13, '#49B56A');
  };
  icons.person = function (ctx) {
    c(ctx, 0, -22, 12, '#FFD0B0');
    poly(ctx, [[-18, 30], [-10, -6], [10, -6], [18, 30]], '#4DA3FF');
  };
  icons.mouth = function (ctx) {
    ctx.fillStyle = '#FFB7C8';
    XT.ui.roundRect(ctx, -28, -18, 56, 36, 16);
    ctx.fill();
    ctx.strokeStyle = '#E07A92';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 2, 12, 0.2, Math.PI - 0.2);
    ctx.stroke();
  };
  icons.cloud = function (ctx) {
    ctx.fillStyle = '#7EC8F0';
    XT.ui.roundRect(ctx, -36, -28, 72, 56, 18);
    ctx.fill();
    c(ctx, -10, 2, 16, '#FFFFFF');
    c(ctx, 10, -4, 18, '#FFFFFF');
    c(ctx, 24, 6, 12, '#FFFFFF');
  };
  icons.rain = function (ctx) {
    icons.cloud(ctx);
    ctx.strokeStyle = '#3D9BE0';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-12, 22);
    ctx.lineTo(-18, 34);
    ctx.moveTo(4, 22);
    ctx.lineTo(-2, 34);
    ctx.moveTo(18, 20);
    ctx.lineTo(12, 32);
    ctx.stroke();
  };
  icons.flower = function (ctx) {
    var i, a;
    for (i = 0; i < 5; i++) {
      a = i * Math.PI * 2 / 5;
      ctx.fillStyle = '#FF8FB8';
      ctx.beginPath();
      ctx.ellipse(Math.cos(a) * 14, Math.sin(a) * 14, 10, 14, a, 0, Math.PI * 2);
      ctx.fill();
    }
    c(ctx, 0, 0, 8, '#FFD15C');
  };
  icons.grass = function (ctx) {
    ctx.strokeStyle = '#3FA96A';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-16, 24);
    ctx.quadraticCurveTo(-24, 0, -20, -24);
    ctx.moveTo(0, 26);
    ctx.quadraticCurveTo(2, -4, 6, -30);
    ctx.moveTo(16, 24);
    ctx.quadraticCurveTo(26, 0, 22, -20);
    ctx.stroke();
  };
  icons.star = function (ctx) {
    XT.draw.star(ctx, 0, 2, 28, true);
  };
  icons.bird = function (ctx) {
    ctx.fillStyle = '#5BBEFF';
    ctx.beginPath();
    ctx.ellipse(-4, 4, 24, 16, 0.2, 0, Math.PI * 2);
    ctx.fill();
    c(ctx, 16, -6, 12, '#5BBEFF');
    poly(ctx, [[24, -4], [36, 2], [24, 6]], '#FF9F43');
    eye(ctx, 20, -8);
    ctx.fillStyle = '#3D8FD0';
    ctx.beginPath();
    ctx.ellipse(-8, 0, 12, 8, -0.6, 0, Math.PI * 2);
    ctx.fill();
  };
  icons.fish = function (ctx) {
    ctx.fillStyle = '#3D9BE0';
    ctx.beginPath();
    ctx.ellipse(4, 0, 26, 16, 0, 0, Math.PI * 2);
    ctx.fill();
    poly(ctx, [[-22, 0], [-38, -14], [-38, 14]], '#7EC8F0');
    eye(ctx, 16, -4);
  };
  icons.horse = function (ctx) {
    ctx.fillStyle = '#C68642';
    ctx.fillRect(-18, 6, 8, 22);
    ctx.fillRect(8, 6, 8, 22);
    ctx.beginPath();
    ctx.ellipse(0, 2, 24, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(12, -22, 8, 24);
    c(ctx, 18, -26, 10, '#C68642');
    ctx.fillStyle = '#8A5A32';
    ctx.beginPath();
    ctx.ellipse(10, -30, 6, 10, -0.4, 0, Math.PI * 2);
    ctx.fill();
    eye(ctx, 22, -28);
  };
  icons.sheep = function (ctx) {
    c(ctx, -8, 4, 16, '#FFFFFF');
    c(ctx, 8, 6, 16, '#FFFFFF');
    c(ctx, 0, -2, 16, '#FFFFFF');
    c(ctx, 22, -2, 12, '#F3D2B8');
    eye(ctx, 26, -4);
    ctx.fillStyle = '#E7B899';
    ctx.fillRect(-10, 16, 6, 12);
    ctx.fillRect(6, 16, 6, 12);
  };
  icons.bug = function (ctx) {
    c(ctx, 0, 6, 18, '#7BC67E');
    c(ctx, 0, -16, 10, '#3FA96A');
    ctx.strokeStyle = '#2F6B3A';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-6, -22);
    ctx.lineTo(-12, -32);
    ctx.moveTo(6, -22);
    ctx.lineTo(12, -32);
    ctx.stroke();
    eye(ctx, -4, -16);
    eye(ctx, 4, -16);
  };
  icons.fruit = function (ctx) {
    c(ctx, 0, 4, 24, '#FF5A5A');
    ctx.fillStyle = '#3FA96A';
    ctx.beginPath();
    ctx.ellipse(8, -18, 10, 6, 0.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#6B4226';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, -16);
    ctx.lineTo(2, -28);
    ctx.stroke();
  };
  icons.car = function (ctx) {
    ctx.fillStyle = '#FF6B6B';
    XT.ui.roundRect(ctx, -32, -8, 64, 26, 8);
    ctx.fill();
    ctx.fillStyle = '#9AD7FF';
    XT.ui.roundRect(ctx, -16, -24, 36, 18, 6);
    ctx.fill();
    c(ctx, -16, 20, 8, '#3A3344');
    c(ctx, 16, 20, 8, '#3A3344');
    c(ctx, -16, 20, 3, '#FFFFFF');
    c(ctx, 16, 20, 3, '#FFFFFF');
  };
  icons.book = function (ctx) {
    ctx.fillStyle = '#4DA3FF';
    XT.ui.roundRect(ctx, -30, -22, 28, 44, 4);
    ctx.fill();
    ctx.fillStyle = '#FF8A3D';
    XT.ui.roundRect(ctx, 2, -22, 28, 44, 4);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(-22, -8, 14, 3);
    ctx.fillRect(10, -8, 14, 3);
  };
  icons.door = function (ctx) {
    ctx.fillStyle = '#C68642';
    XT.ui.roundRect(ctx, -22, -32, 44, 64, 6);
    ctx.fill();
    ctx.fillStyle = '#F6E2C4';
    XT.ui.roundRect(ctx, -16, -26, 32, 52, 4);
    ctx.fill();
    c(ctx, 8, 2, 3, '#C68642');
  };
  icons.eye = function (ctx) {
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.ellipse(0, 0, 32, 20, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#3A3344';
    ctx.lineWidth = 3;
    ctx.stroke();
    c(ctx, 0, 0, 10, '#3D9BE0');
    c(ctx, 0, 0, 5, '#3A3344');
    c(ctx, -3, -3, 2, '#FFFFFF');
  };
  icons.hand = function (ctx) {
    ctx.fillStyle = '#FFD0B0';
    XT.ui.roundRect(ctx, -16, 0, 32, 28, 10);
    ctx.fill();
    ctx.fillRect(-14, -8, 8, 24);
    ctx.fillRect(-4, -22, 8, 36);
    ctx.fillRect(6, -16, 8, 30);
    ctx.fillRect(16, -6, 8, 22);
  };
  icons.field = function (ctx) {
    ctx.fillStyle = '#E7C56A';
    XT.ui.roundRect(ctx, -28, -28, 56, 56, 6);
    ctx.fill();
    ctx.strokeStyle = '#8A9A4A';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, -28);
    ctx.lineTo(0, 28);
    ctx.moveTo(-28, 0);
    ctx.lineTo(28, 0);
    ctx.stroke();
  };
  icons.sprout = function (ctx) {
    ctx.strokeStyle = '#3FA96A';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, 28);
    ctx.lineTo(0, -8);
    ctx.stroke();
    ctx.fillStyle = '#7BC67E';
    ctx.beginPath();
    ctx.ellipse(-10, -12, 12, 7, -0.6, 0, Math.PI * 2);
    ctx.ellipse(10, -16, 12, 7, 0.6, 0, Math.PI * 2);
    ctx.fill();
  };
  icons.wind = function (ctx) {
    ctx.strokeStyle = '#7EB6E0';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-30, -12);
    ctx.quadraticCurveTo(10, -28, 28, -8);
    ctx.moveTo(-34, 2);
    ctx.quadraticCurveTo(0, -8, 30, 6);
    ctx.moveTo(-24, 16);
    ctx.quadraticCurveTo(8, 8, 22, 20);
    ctx.stroke();
  };
  icons.stone = function (ctx) {
    ctx.fillStyle = '#C5C0B8';
    ctx.beginPath();
    ctx.moveTo(-20, 20);
    ctx.quadraticCurveTo(-36, 0, -10, -22);
    ctx.quadraticCurveTo(10, -34, 28, -8);
    ctx.quadraticCurveTo(40, 16, 8, 26);
    ctx.closePath();
    ctx.fill();
  };
  icons.bamboo = function (ctx) {
    ctx.strokeStyle = '#2E9A62';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-8, 30);
    ctx.lineTo(-8, -30);
    ctx.moveTo(10, 30);
    ctx.lineTo(12, -18);
    ctx.stroke();
    ctx.strokeStyle = '#1B6B42';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-16, -8);
    ctx.lineTo(0, -8);
    ctx.moveTo(-16, 10);
    ctx.lineTo(0, 10);
    ctx.stroke();
  };
  icons.lamp = function (ctx) {
    ctx.fillStyle = '#E25B4A';
    ctx.beginPath();
    ctx.moveTo(-16, -8);
    ctx.lineTo(16, -8);
    ctx.lineTo(12, 22);
    ctx.lineTo(-12, 22);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#FFD15C';
    ctx.fillRect(-6, -2, 12, 16);
    ctx.strokeStyle = '#8A5A3A';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, -8);
    ctx.lineTo(0, -28);
    ctx.stroke();
  };
  icons.umbrella = function (ctx) {
    ctx.fillStyle = '#FF6B6B';
    ctx.beginPath();
    ctx.arc(0, 0, 30, Math.PI, 0);
    ctx.fill();
    ctx.fillStyle = '#4DA3FF';
    ctx.beginPath();
    ctx.moveTo(-30, 0);
    ctx.arc(-15, 0, 15, Math.PI, 0);
    ctx.fill();
    ctx.fillStyle = '#FFD15C';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(15, 0, 15, Math.PI, 0);
    ctx.fill();
    ctx.strokeStyle = '#8A5A3A';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, 28);
    ctx.stroke();
  };
  icons.leaf = function (ctx) {
    ctx.fillStyle = '#3FA96A';
    ctx.beginPath();
    ctx.ellipse(0, 0, 16, 28, 0.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#E7F8EA';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-8, 12);
    ctx.quadraticCurveTo(0, 0, 10, -14);
    ctx.stroke();
  };
  icons.earth = function (ctx) {
    ctx.fillStyle = '#C68642';
    D2(ctx);
    ctx.beginPath();
    ctx.moveTo(-32, 10);
    ctx.quadraticCurveTo(0, 36, 32, 8);
    ctx.lineTo(32, 24);
    ctx.lineTo(-32, 24);
    ctx.fill();
    ctx.fillStyle = '#8ED67A';
    ctx.fillRect(-32, 6, 64, 8);
  };
  function D2(ctx) {}
  icons.rice = function (ctx) {
    c(ctx, -12, -6, 8, '#FFFFFF');
    c(ctx, 4, -12, 8, '#FFFFFF');
    c(ctx, 14, 2, 8, '#FFFFFF');
    c(ctx, -4, 8, 8, '#FFFFFF');
    ctx.strokeStyle = '#E6D3BE';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(-12, -6, 8, 0, Math.PI * 2);
    ctx.stroke();
  };
  icons.knife = function (ctx) {
    ctx.fillStyle = '#D7DEE6';
    XT.ui.roundRect(ctx, -6, -34, 16, 40, 6);
    ctx.fill();
    ctx.fillStyle = '#C68642';
    XT.ui.roundRect(ctx, -8, 6, 20, 26, 6);
    ctx.fill();
  };
  icons.shirt = function (ctx) {
    ctx.fillStyle = '#7EB6E0';
    ctx.beginPath();
    ctx.moveTo(-8, -20);
    ctx.lineTo(-28, -4);
    ctx.lineTo(-16, 6);
    ctx.lineTo(-16, 30);
    ctx.lineTo(16, 30);
    ctx.lineTo(16, 6);
    ctx.lineTo(28, -4);
    ctx.lineTo(8, -20);
    ctx.quadraticCurveTo(0, -8, -8, -20);
    ctx.fill();
  };
  icons.ear = function (ctx) {
    ctx.fillStyle = '#FFD0B0';
    ctx.beginPath();
    ctx.ellipse(0, 0, 18, 28, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#F3B7A0';
    ctx.beginPath();
    ctx.ellipse(0, 4, 8, 16, 0, 0, Math.PI * 2);
    ctx.fill();
  };
  icons.melon = function (ctx) {
    c(ctx, 0, 2, 26, '#8ED67A');
    ctx.strokeStyle = '#3FA96A';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-4, -22);
    ctx.lineTo(0, 24);
    ctx.moveTo(8, -20);
    ctx.lineTo(4, 22);
    ctx.stroke();
  };
  icons.cat = function (ctx) {
    ctx.fillStyle = '#F0A030';
    poly(ctx, [[-22, -8], [-28, -32], [-8, -14]], '#F0A030');
    poly(ctx, [[22, -8], [28, -32], [8, -14]], '#F0A030');
    c(ctx, 0, 4, 24, '#F0A030');
    ctx.fillStyle = '#FFD7A8';
    ctx.beginPath();
    ctx.ellipse(0, 10, 12, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    eye(ctx, -8, 0);
    eye(ctx, 8, 0);
    c(ctx, 0, 8, 3, '#FF8AA3');
    ctx.strokeStyle = '#C68642';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-20, 8);
    ctx.lineTo(-36, 4);
    ctx.moveTo(-20, 12);
    ctx.lineTo(-36, 14);
    ctx.moveTo(20, 8);
    ctx.lineTo(36, 4);
    ctx.moveTo(20, 12);
    ctx.lineTo(36, 14);
    ctx.stroke();
  };
  icons.dog = function (ctx) {
    ctx.fillStyle = '#C68642';
    ctx.beginPath();
    ctx.ellipse(-22, 6, 9, 20, -0.15, 0, Math.PI * 2);
    ctx.ellipse(22, 6, 9, 20, 0.15, 0, Math.PI * 2);
    ctx.fill();
    c(ctx, 0, -2, 20, '#E0A45A');
    ctx.fillStyle = '#F6D7B8';
    ctx.beginPath();
    ctx.ellipse(0, 14, 13, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    c(ctx, -4, 12, 2.2, '#3A3344');
    c(ctx, 4, 12, 2.2, '#3A3344');
    ctx.fillStyle = '#FF8AA3';
    ctx.beginPath();
    ctx.ellipse(0, 20, 4, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    eye(ctx, -8, -6);
    eye(ctx, 8, -6);
  };
  icons.pig = function (ctx) {
    c(ctx, 0, 2, 26, '#FFB7C8');
    ctx.fillStyle = '#FF8FB0';
    ctx.beginPath();
    ctx.ellipse(-16, -20, 8, 10, -0.5, 0, Math.PI * 2);
    ctx.ellipse(16, -20, 8, 10, 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FF8FB0';
    ctx.beginPath();
    ctx.ellipse(0, 10, 12, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    c(ctx, -4, 10, 2, '#C45B74');
    c(ctx, 4, 10, 2, '#C45B74');
    eye(ctx, -10, -2);
    eye(ctx, 10, -2);
  };
  icons.duck = function (ctx) {
    c(ctx, -4, 6, 22, '#FFD15C');
    c(ctx, 16, -8, 14, '#FFD15C');
    poly(ctx, [[26, -8], [40, -2], [26, 2]], '#FF8A3D');
    eye(ctx, 20, -12);
  };
  icons.bee = function (ctx) {
    ctx.fillStyle = 'rgba(180, 220, 255, 0.9)';
    ctx.beginPath();
    ctx.ellipse(-8, -12, 10, 6, -0.6, 0, Math.PI * 2);
    ctx.ellipse(10, -12, 10, 6, 0.6, 0, Math.PI * 2);
    ctx.fill();
    c(ctx, 0, 4, 16, '#FFD15C');
    ctx.fillStyle = '#3A3344';
    ctx.fillRect(-16, -2, 32, 4);
    ctx.fillRect(-14, 6, 28, 4);
    eye(ctx, -5, -4);
    eye(ctx, 5, -4);
  };
  icons.frog = function (ctx) {
    c(ctx, -14, -12, 10, '#7BC67E');
    c(ctx, 14, -12, 10, '#7BC67E');
    c(ctx, 0, 8, 22, '#8ED67A');
    eye(ctx, -14, -14);
    eye(ctx, 14, -14);
    ctx.strokeStyle = '#2F6B3A';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 12, 8, 0.2, Math.PI - 0.2);
    ctx.stroke();
  };
  icons.cow = function (ctx) {
    c(ctx, 0, 4, 24, '#FFFDFC');
    c(ctx, -12, -6, 8, '#3A3344');
    c(ctx, 10, 8, 7, '#3A3344');
    ctx.fillStyle = '#F3D2B8';
    ctx.beginPath();
    ctx.ellipse(0, 14, 10, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#C9A27A';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-16, -16);
    ctx.lineTo(-24, -30);
    ctx.moveTo(16, -16);
    ctx.lineTo(24, -30);
    ctx.stroke();
    eye(ctx, -8, 0);
    eye(ctx, 8, 0);
  };
  icons.panda = function (ctx) {
    c(ctx, -18, -18, 10, '#3A3344');
    c(ctx, 18, -18, 10, '#3A3344');
    c(ctx, 0, 4, 24, '#FFFFFF');
    ctx.fillStyle = '#3A3344';
    ctx.beginPath();
    ctx.ellipse(-10, -2, 8, 9, 0, 0, Math.PI * 2);
    ctx.ellipse(10, -2, 8, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    c(ctx, -10, -2, 3, '#FFFFFF');
    c(ctx, 10, -2, 3, '#FFFFFF');
    c(ctx, 0, 10, 3, '#3A3344');
  };
  icons.rabbit = function (ctx) {
    ctx.fillStyle = '#FFFDFC';
    ctx.strokeStyle = '#E3D3C6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(-10, -18, 6, 16, -0.2, 0, Math.PI * 2);
    ctx.ellipse(10, -18, 6, 16, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#FFB3C7';
    ctx.beginPath();
    ctx.ellipse(-10, -16, 3, 10, -0.2, 0, Math.PI * 2);
    ctx.ellipse(10, -16, 3, 10, 0.2, 0, Math.PI * 2);
    ctx.fill();
    c(ctx, 0, 6, 20, '#FFFDFC');
    ctx.strokeStyle = '#E3D3C6';
    ctx.beginPath();
    ctx.arc(0, 6, 20, 0, Math.PI * 2);
    ctx.stroke();
    eye(ctx, -7, 2);
    eye(ctx, 7, 2);
    c(ctx, 0, 10, 2.4, '#FF8AA3');
  };
  icons.bear = function (ctx) {
    c(ctx, -18, -16, 10, '#C68642');
    c(ctx, 18, -16, 10, '#C68642');
    c(ctx, 0, 4, 24, '#D9A066');
    ctx.fillStyle = '#F3D2B8';
    ctx.beginPath();
    ctx.ellipse(0, 10, 12, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    eye(ctx, -8, 0);
    eye(ctx, 8, 0);
    c(ctx, 0, 8, 3, '#3A3344');
  };
  icons.hen = function (ctx) {
    c(ctx, 0, 6, 22, '#FFD15C');
    c(ctx, 14, -12, 12, '#FFD15C');
    poly(ctx, [[-28, -18], [-16, -28], [-18, -8]], '#FF5A5A');
    poly(ctx, [[22, -10], [34, -6], [22, -2]], '#FF8A3D');
    eye(ctx, 16, -14);
    ctx.fillStyle = '#FF8A3D';
    poly(ctx, [[-4, 26], [4, 26], [0, 34]], '#FF8A3D');
  };
  icons.mouse = function (ctx) {
    c(ctx, 0, 6, 22, '#D9CFC6');
    c(ctx, -16, -16, 10, '#FFB7C8');
    c(ctx, 16, -16, 10, '#FFB7C8');
    eye(ctx, -7, 2);
    eye(ctx, 7, 2);
    c(ctx, 0, 10, 2.5, '#FF8AA3');
    ctx.strokeStyle = '#B7A89A';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-24, 8);
    ctx.quadraticCurveTo(-36, 20, -20, 18);
    ctx.stroke();
  };
  icons.ball = function (ctx) {
    c(ctx, 0, 0, 26, '#FF6B6B');
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, 26, 0.4, 1.2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, 26, 2.2, 3.2);
    ctx.stroke();
  };
  icons.cake = function (ctx) {
    ctx.fillStyle = '#FFB7D5';
    XT.ui.roundRect(ctx, -26, -2, 52, 28, 8);
    ctx.fill();
    ctx.fillStyle = '#C4A1FF';
    ctx.fillRect(-26, 8, 52, 8);
    ctx.fillStyle = '#FFF';
    ctx.fillRect(-26, -6, 52, 8);
    ctx.fillStyle = '#FFD15C';
    ctx.fillRect(-2, -28, 4, 22);
    c(ctx, 0, -30, 4, '#FF8A3D');
  };
  icons.milk = function (ctx) {
    ctx.fillStyle = '#F4F7FB';
    XT.ui.roundRect(ctx, -16, -28, 32, 56, 8);
    ctx.fill();
    ctx.strokeStyle = '#D5DDEA';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = '#7EC8F0';
    ctx.fillRect(-16, -4, 32, 18);
  };
  icons.house = function (ctx) {
    poly(ctx, [[-32, 4], [0, -28], [32, 4]], '#FF6B6B');
    ctx.fillStyle = '#FFF6E8';
    ctx.fillRect(-24, 4, 48, 28);
    ctx.fillStyle = '#C68642';
    ctx.fillRect(-8, 14, 14, 18);
  };
  icons.hat = function (ctx) {
    ctx.fillStyle = '#5C4DB5';
    poly(ctx, [[-16, 6], [0, -28], [16, 6]], '#5C4DB5');
    ctx.fillStyle = '#3A3344';
    XT.ui.roundRect(ctx, -30, 4, 60, 10, 5);
    ctx.fill();
  };
  icons.cup = function (ctx) {
    ctx.fillStyle = '#7EB6E0';
    XT.ui.roundRect(ctx, -18, -16, 32, 36, 6);
    ctx.fill();
    ctx.strokeStyle = '#4DA3FF';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(20, 0, 8, -1, 1);
    ctx.stroke();
  };
  icons.egg = function (ctx) {
    ctx.fillStyle = '#FFF8EE';
    ctx.beginPath();
    ctx.ellipse(0, 2, 18, 26, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#E6D3BE';
    ctx.lineWidth = 3;
    ctx.stroke();
  };
  icons.bus = function (ctx) {
    ctx.fillStyle = '#FFD15C';
    XT.ui.roundRect(ctx, -32, -20, 64, 40, 8);
    ctx.fill();
    ctx.fillStyle = '#9AD7FF';
    ctx.fillRect(-24, -14, 14, 12);
    ctx.fillRect(-6, -14, 14, 12);
    ctx.fillRect(12, -14, 14, 12);
    c(ctx, -16, 20, 6, '#3A3344');
    c(ctx, 16, 20, 6, '#3A3344');
  };
  icons.shoe = function (ctx) {
    ctx.fillStyle = '#FF8A3D';
    XT.ui.roundRect(ctx, -28, 0, 56, 18, 8);
    ctx.fill();
    ctx.fillStyle = '#C45B2A';
    XT.ui.roundRect(ctx, -28, -16, 22, 24, 8);
    ctx.fill();
  };

  function kidBody(ctx, shiftY) {
    var y = shiftY || 0;
    c(ctx, 0, -16 + y, 12, '#FFD0B0');
    ctx.fillStyle = '#5BBEFF';
    XT.ui.roundRect(ctx, -14, -6 + y, 28, 26, 8);
    ctx.fill();
  }

  icons.run = function (ctx) {
    kidBody(ctx, 0);
    ctx.strokeStyle = '#8A7568';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-8, 20);
    ctx.lineTo(-18, 32);
    ctx.moveTo(8, 20);
    ctx.lineTo(20, 30);
    ctx.stroke();
    ctx.strokeStyle = '#FFD15C';
    ctx.beginPath();
    ctx.moveTo(22, -10);
    ctx.lineTo(34, -14);
    ctx.moveTo(22, 0);
    ctx.lineTo(36, 2);
    ctx.stroke();
  };
  icons.jump = function (ctx) {
    kidBody(ctx, -10);
    ctx.strokeStyle = '#C9A27A';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-20, 30);
    ctx.lineTo(20, 30);
    ctx.stroke();
  };
  icons.eat = function (ctx) {
    kidBody(ctx, 0);
    c(ctx, 18, -2, 8, '#FF5A5A');
    ctx.fillStyle = '#3FA96A';
    ctx.beginPath();
    ctx.ellipse(22, -10, 5, 3, 0.8, 0, Math.PI * 2);
    ctx.fill();
  };
  icons.sit = function (ctx) {
    c(ctx, 0, -18, 12, '#FFD0B0');
    ctx.fillStyle = '#FF8FB8';
    XT.ui.roundRect(ctx, -16, -8, 32, 18, 8);
    ctx.fill();
    ctx.fillStyle = '#C68642';
    XT.ui.roundRect(ctx, -18, 12, 36, 10, 4);
    ctx.fill();
  };
  icons.sleep = function (ctx) {
    ctx.fillStyle = '#F7F1E4';
    XT.ui.roundRect(ctx, -28, 4, 56, 22, 10);
    ctx.fill();
    c(ctx, -8, -2, 12, '#FFD0B0');
    ctx.fillStyle = '#FFD0DE';
    ctx.beginPath();
    ctx.ellipse(-16, 2, 10, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    XT.ui.text(ctx, 'z', 16, -16, { size: 18, align: 'center', color: '#8A7568', weight: '800', font: XT.FONT_EN });
  };
  icons.walk = function (ctx) {
    kidBody(ctx, 0);
    ctx.strokeStyle = '#8A7568';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-6, 20);
    ctx.lineTo(-14, 34);
    ctx.moveTo(6, 20);
    ctx.lineTo(12, 34);
    ctx.stroke();
  };
  icons.read = function (ctx) {
    kidBody(ctx, 0);
    ctx.fillStyle = '#FF8A3D';
    XT.ui.roundRect(ctx, -8, 6, 22, 16, 3);
    ctx.fill();
  };
  icons.swim = function (ctx) {
    c(ctx, -6, -6, 12, '#FFD0B0');
    ctx.strokeStyle = '#3D9BE0';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-28, 12);
    ctx.quadraticCurveTo(-8, 2, 8, 14);
    ctx.quadraticCurveTo(22, 24, 32, 10);
    ctx.stroke();
  };
  icons.sing = function (ctx) {
    kidBody(ctx, 0);
    ctx.fillStyle = '#FFD15C';
    ctx.font = '800 16px ' + XT.FONT_EN;
    ctx.textAlign = 'center';
    ctx.fillText('la', 22, -8);
  };
  icons.drink = function (ctx) {
    kidBody(ctx, 0);
    ctx.fillStyle = '#7EB6E0';
    XT.ui.roundRect(ctx, 10, -8, 12, 18, 3);
    ctx.fill();
  };
  icons.write = function (ctx) {
    kidBody(ctx, 0);
    ctx.strokeStyle = '#E6B423';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(8, 4);
    ctx.lineTo(24, 22);
    ctx.stroke();
  };
  icons.clap = function (ctx) {
    c(ctx, -10, 4, 12, '#FFD0B0');
    c(ctx, 10, 4, 12, '#FFD0B0');
    ctx.strokeStyle = '#FFD15C';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, -8);
    ctx.lineTo(-6, -18);
    ctx.moveTo(0, -8);
    ctx.lineTo(6, -18);
    ctx.stroke();
  };
  icons.fly = function (ctx) {
    icons.bird(ctx);
    ctx.strokeStyle = '#7EC8F0';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-20, 16);
    ctx.lineTo(-34, 22);
    ctx.moveTo(-10, 20);
    ctx.lineTo(-22, 30);
    ctx.stroke();
  };
  icons.kick = function (ctx) {
    kidBody(ctx, 0);
    c(ctx, 22, 18, 8, '#FF6B6B');
    ctx.strokeStyle = '#8A7568';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(6, 18);
    ctx.lineTo(16, 18);
    ctx.stroke();
  };
  icons.draw = function (ctx) {
    ctx.strokeStyle = '#5C4DB5';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-8, 20);
    ctx.lineTo(10, -8);
    ctx.stroke();
    XT.draw.star(ctx, 16, -16, 12, true);
  };
  icons.wash = function (ctx) {
    c(ctx, -8, 6, 12, '#FFD0B0');
    c(ctx, 10, 8, 12, '#FFD0B0');
    ctx.fillStyle = '#7EC8F0';
    ctx.beginPath();
    ctx.arc(-16, -8, 4, 0, Math.PI * 2);
    ctx.arc(0, -14, 4, 0, Math.PI * 2);
    ctx.arc(16, -6, 4, 0, Math.PI * 2);
    ctx.fill();
  };
  icons.hop = function (ctx) {
    icons.rabbit(ctx);
    ctx.strokeStyle = '#C9A27A';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-16, 28);
    ctx.lineTo(18, 28);
    ctx.stroke();
  };
  icons.hug = function (ctx) {
    c(ctx, -12, -8, 12, '#FFD0B0');
    c(ctx, 12, -8, 12, '#FFD7B8');
    ctx.strokeStyle = '#FF8FB8';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(0, 8, 16, 0.2, Math.PI - 0.2);
    ctx.stroke();
  };
  icons.cry = function (ctx) {
    c(ctx, 0, 0, 20, '#FFD0B0');
    eye(ctx, -7, -4);
    eye(ctx, 7, -4);
    ctx.fillStyle = '#7EC8F0';
    ctx.beginPath();
    ctx.arc(8, 10, 3, 0, Math.PI * 2);
    ctx.fill();
  };
  icons.open = function (ctx) {
    ctx.fillStyle = '#C68642';
    XT.ui.roundRect(ctx, -24, -20, 22, 44, 4);
    ctx.fill();
    ctx.fillStyle = '#F6E2C4';
    XT.ui.roundRect(ctx, 2, -20, 24, 44, 4);
    ctx.fill();
  };
  icons.snow = function (ctx) {
    ctx.strokeStyle = '#E7F4FF';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(0, -24);
    ctx.lineTo(0, 24);
    ctx.moveTo(-20, -12);
    ctx.lineTo(20, 12);
    ctx.moveTo(-20, 12);
    ctx.lineTo(20, -12);
    ctx.stroke();
    ctx.fillStyle = '#7EC8F0';
    XT.ui.roundRect(ctx, -36, -36, 72, 72, 16);
    ctx.globalCompositeOperation = 'destination-over';
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
  };
  icons.hot = function (ctx) {
    icons.sun(ctx);
    ctx.fillStyle = '#FF6B6B';
    XT.ui.roundRect(ctx, 16, 8, 8, 18, 3);
    ctx.fill();
  };
  icons.cold = function (ctx) {
    icons.snow(ctx);
    ctx.fillStyle = '#4DA3FF';
    ctx.globalAlpha = 0.35;
    ctx.beginPath();
    ctx.arc(0, 8, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  };
  icons.fog = function (ctx) {
    ctx.strokeStyle = '#C5CDD6';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-26, -10);
    ctx.lineTo(26, -10);
    ctx.moveTo(-30, 2);
    ctx.lineTo(22, 2);
    ctx.moveTo(-20, 14);
    ctx.lineTo(28, 14);
    ctx.stroke();
  };
  icons.storm = function (ctx) {
    icons.cloud(ctx);
    ctx.fillStyle = '#FFD15C';
    ctx.beginPath();
    ctx.moveTo(4, 6);
    ctx.lineTo(-6, 20);
    ctx.lineTo(2, 20);
    ctx.lineTo(-2, 32);
    ctx.lineTo(12, 14);
    ctx.lineTo(4, 14);
    ctx.closePath();
    ctx.fill();
  };
  icons.warm = function (ctx) {
    c(ctx, 0, 0, 18, '#FFB067');
    ctx.strokeStyle = '#FF8A3D';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, 26, 0.4, 1.4);
    ctx.stroke();
  };
  icons.cool = function (ctx) {
    ctx.strokeStyle = '#7EC8F0';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-24, -8);
    ctx.quadraticCurveTo(0, -18, 24, -6);
    ctx.moveTo(-20, 6);
    ctx.quadraticCurveTo(4, -2, 22, 8);
    ctx.stroke();
  };
  icons.bag = function (ctx) {
    ctx.fillStyle = '#E07A4A';
    XT.ui.roundRect(ctx, -22, -8, 44, 36, 8);
    ctx.fill();
    ctx.strokeStyle = '#8A5A3A';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, -8, 12, Math.PI, 0);
    ctx.stroke();
  };
  icons.desk = function (ctx) {
    ctx.fillStyle = '#C68642';
    ctx.fillRect(-30, -6, 60, 10);
    ctx.fillRect(-24, 4, 8, 24);
    ctx.fillRect(16, 4, 8, 24);
  };
  icons.ruler = function (ctx) {
    ctx.fillStyle = '#FFD15C';
    XT.ui.roundRect(ctx, -30, -8, 60, 16, 4);
    ctx.fill();
    ctx.strokeStyle = '#8A5A3A';
    ctx.lineWidth = 2;
    ctx.beginPath();
    var i;
    for (i = 0; i < 6; i++) {
      ctx.moveTo(-22 + i * 8, -8);
      ctx.lineTo(-22 + i * 8, i % 2 ? 0 : -2);
    }
    ctx.stroke();
  };
  icons.chair = function (ctx) {
    ctx.fillStyle = '#7EB6E0';
    ctx.fillRect(-16, -24, 32, 8);
    ctx.fillRect(-16, -16, 32, 10);
    ctx.fillRect(-14, -6, 6, 28);
    ctx.fillRect(8, -6, 6, 28);
  };
  icons.pencil = function (ctx) {
    ctx.fillStyle = '#FFD15C';
    ctx.fillRect(-6, -24, 12, 36);
    ctx.fillStyle = '#FF8A8A';
    ctx.fillRect(-6, -30, 12, 8);
    ctx.fillStyle = '#F3D2B8';
    ctx.beginPath();
    ctx.moveTo(-6, 12);
    ctx.lineTo(6, 12);
    ctx.lineTo(0, 26);
    ctx.fill();
  };
  icons.map = function (ctx) {
    ctx.fillStyle = '#E7F6EA';
    XT.ui.roundRect(ctx, -26, -22, 52, 44, 6);
    ctx.fill();
    ctx.strokeStyle = '#3FA96A';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-16, 8);
    ctx.quadraticCurveTo(0, -8, 16, 6);
    ctx.stroke();
    c(ctx, 8, -4, 4, '#FF6B6B');
  };
  icons.bell = function (ctx) {
    ctx.fillStyle = '#FFD15C';
    ctx.beginPath();
    ctx.moveTo(-16, 8);
    ctx.quadraticCurveTo(-18, -16, 0, -22);
    ctx.quadraticCurveTo(18, -16, 16, 8);
    ctx.closePath();
    ctx.fill();
    c(ctx, 0, 14, 4, '#E6B423');
  };
  icons.clock = function (ctx) {
    c(ctx, 0, 0, 24, '#FFFFFF');
    ctx.strokeStyle = '#3A3344';
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -12);
    ctx.moveTo(0, 0);
    ctx.lineTo(8, 4);
    ctx.stroke();
  };
  icons.rubber = function (ctx) {
    ctx.fillStyle = '#FFB7D5';
    XT.ui.roundRect(ctx, -22, -12, 28, 24, 6);
    ctx.fill();
    ctx.fillStyle = '#7EB6E0';
    ctx.fillRect(6, -12, 16, 24);
  };

  XT.draw.icon = function (ctx, name, cx, cy, size) {
    var fn = icons[name] || icons.star;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.fillStyle = 'rgba(140, 90, 50, 0.16)';
    ctx.beginPath();
    ctx.arc(4, 7, size * 0.52, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFF3E4';
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.52, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    ctx.beginPath();
    ctx.ellipse(-size * 0.12, -size * 0.18, size * 0.2, size * 0.1, -0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.scale(size / 110, size / 110);
    fn(ctx);
    ctx.restore();
  };
})(typeof GameGlobal !== 'undefined' ? GameGlobal : (typeof window !== 'undefined' ? window : this));