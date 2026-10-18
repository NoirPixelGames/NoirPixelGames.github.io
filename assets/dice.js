/* Noir Pixel Games — ana sayfadaki oynanabilir zar sahnesi.
   Pixel Roll Dungeon'un gercek el kurallariyla, oyunun kendi zar gorselleriyle.
   Kutuphane yok. */
(function () {
  'use strict';

  var stage = document.getElementById('stage');
  if (!stage) return;

  var reduced = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var FACES = [
    { id: 'sword',    tr: 'Kılıç',   en: 'Sword' },
    { id: 'fire',     tr: 'Ateş',    en: 'Fire' },
    { id: 'zehir',    tr: 'Zehir',   en: 'Poison' },
    { id: 'elektrik', tr: 'Yıldırım', en: 'Lightning' },
    { id: 'vampir',   tr: 'Vampir',  en: 'Vampire' },
    { id: 'sniper',   tr: 'Nişancı', en: 'Sniper' }
  ];

  var HANDS = {
    five:  { tr: 'BEŞLİ',      en: 'FIVE OF A KIND', mult: 8 },
    four:  { tr: 'DÖRTLÜ',     en: 'FOUR OF A KIND', mult: 5 },
    full:  { tr: 'FULL HOUSE', en: 'FULL HOUSE',     mult: 4 },
    three: { tr: 'ÜÇLÜ',       en: 'THREE OF A KIND', mult: 3 },
    two:   { tr: 'İKİ ÇİFT',   en: 'TWO PAIR',       mult: 2.5 },
    one:   { tr: 'ÇİFT',       en: 'ONE PAIR',       mult: 2 },
    none:  { tr: 'EL YOK',     en: 'NO HAND',        mult: 1 }
  };

  var TXT = {
    tr: {
      start:   'zarlara dokun → kilitle, kalanını yeniden at',
      locked:  'kilitlendi — kalanını yeniden at',
      unlock:  'kilit açıldı',
      rolling: 'zarlar atılıyor...',
      left1:   'son atış hakkın',
      left2:   'iki atış hakkın kaldı',
      done:    'el bitti. gerçeğini oynamak ister misin?',
      again:   'tekrar at',
      roll:    'yeniden at',
      first:   'zarları at',
      dmg:     'hasar'
    },
    en: {
      start:   'tap the dice → lock them, reroll the rest',
      locked:  'locked — reroll the rest',
      unlock:  'unlocked',
      rolling: 'rolling...',
      left1:   'one roll left',
      left2:   'two rolls left',
      done:    'hand over. want to play the real thing?',
      again:   'roll again',
      roll:    'reroll',
      first:   'roll the dice',
      dmg:     'damage'
    }
  };

  /* ---------- ses ---------- */
  var muted = false;
  try { muted = localStorage.getItem("npg-mute") === "1"; } catch (e) {}
  var sfx = {};
  function sound(name, vol) {
    if (muted || reduced) return;
    try {
      var a = sfx[name];
      if (!a) { a = sfx[name] = new Audio("assets/sfx/" + name + ".wav"); a.preload = "auto"; }
      a.currentTime = 0;
      a.volume = vol;
      var p = a.play();
      if (p && p.catch) p.catch(function () {});   // otomatik oynatma engeliyse sessizce gec
    } catch (e) {}
  }

  var MAX_ROLLS = 3;
  var BASE_DMG = 12;

  var dice = [];          // {face, locked, el, img}
  var rollsUsed = 0;
  var busy = false;

  var tray = stage.querySelector('.tray');
  var handEl = stage.querySelector('.hand');
  var multEl = stage.querySelector('.mult');
  var hintEl = stage.querySelector('.hint');
  var btn = stage.querySelector('[data-roll]');
  var pips = stage.querySelector('.rolls');

  function lang() {
    return document.documentElement.lang === 'en' ? 'en' : 'tr';
  }
  function t(k) { return TXT[lang()][k]; }

  function rnd(n) { return Math.floor(Math.random() * n); }

  /* ---------- kurulum ---------- */
  function build() {
    tray.innerHTML = '';
    dice = [];
    for (var i = 0; i < 5; i++) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'die';
      b.setAttribute('aria-pressed', 'false');

      var sym = document.createElement('img');
      sym.className = 'sym';
      sym.alt = '';

      var pin = document.createElement('img');
      pin.className = 'pin';
      pin.src = 'assets/dice/lock.webp';
      pin.alt = '';

      b.appendChild(sym);
      b.appendChild(pin);
      tray.appendChild(b);

      var d = { face: rnd(FACES.length), locked: false, el: b, img: sym };
      dice.push(d);
      paint(d);

      (function (die) {
        b.addEventListener('click', function () { toggle(die); });
      })(d);
    }
  }

  function paint(d) {
    var f = FACES[d.face];
    d.img.src = 'assets/dice/' + f.id + '.webp';
    d.el.setAttribute('aria-label', f[lang()]);
  }

  function toggle(d) {
    stage.classList.add("touched");      // nabiz ipucu artik gereksiz
    if (busy || rollsUsed === 0 || rollsUsed >= MAX_ROLLS) return;
    d.locked = !d.locked;
    d.el.classList.toggle('locked', d.locked);
    d.el.setAttribute('aria-pressed', d.locked ? 'true' : 'false');
    hint(d.locked ? t('locked') : t('unlock'));
  }

  function hint(s) { hintEl.textContent = s; }

  /* ---------- el hesabi ---------- */
  function evaluate() {
    var count = {};
    for (var i = 0; i < dice.length; i++) {
      count[dice[i].face] = (count[dice[i].face] || 0) + 1;
    }
    var n = Object.keys(count).map(function (k) { return count[k]; })
      .sort(function (a, b) { return b - a; });

    if (n[0] === 5) return 'five';
    if (n[0] === 4) return 'four';
    if (n[0] === 3 && n[1] === 2) return 'full';
    if (n[0] === 3) return 'three';
    if (n[0] === 2 && n[1] === 2) return 'two';
    if (n[0] === 2) return 'one';
    return 'none';
  }

  function countUp(el, to) {
    el.textContent = to;            // sekme arkaplandayken rAF durur: dogru deger hep yazili kalsin
    if (reduced) return;
    var from = 0, start = null, dur = 520;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min(1, (ts - start) / dur);
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(from + (to - from) * e);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function show() {
    var key = evaluate();
    var h = HANDS[key];
    handEl.textContent = h[lang()];
    handEl.classList.toggle('none', key === 'none');
    handEl.classList.remove('pop');
    void handEl.offsetWidth;
    handEl.classList.add('pop');

    multEl.innerHTML = t('dmg') + ' <b>×' + h.mult + '</b> · <b id="dmgno">0</b>';
    var no = multEl.querySelector('#dmgno');
    if (no) countUp(no, Math.round(BASE_DMG * h.mult));

    stage.dataset.hand = key;
    if (key === "five" || key === "four" || key === "full") sound("win", 0.4);
  }

  function pipsPaint() {
    if (!pips) return;
    pips.innerHTML = '';
    for (var i = 0; i < MAX_ROLLS; i++) {
      var s = document.createElement('i');
      if (i < MAX_ROLLS - rollsUsed) s.className = 'on';
      pips.appendChild(s);
    }
  }

  function label() {
    if (rollsUsed === 0) btn.textContent = t('first');
    else if (rollsUsed >= MAX_ROLLS) btn.textContent = t('again');
    else btn.textContent = t('roll');
  }

  /* ---------- atis ---------- */
  function roll() {
    if (busy) return;

    if (rollsUsed >= MAX_ROLLS) {   // yeni el
      rollsUsed = 0;
      for (var i = 0; i < dice.length; i++) {
        dice[i].locked = false;
        dice[i].el.classList.remove('locked');
        dice[i].el.setAttribute('aria-pressed', 'false');
      }
      handEl.textContent = '';
      multEl.textContent = '';
      delete stage.dataset.hand;
    }

    var moving = dice.filter(function (d) { return !d.locked; });
    if (!moving.length) { hint(t('locked')); return; }

    busy = true;
    rollsUsed++;
    hint(t('rolling'));
    label();
    pipsPaint();

    if (reduced) {
      moving.forEach(function (d) { d.face = rnd(FACES.length); paint(d); });
      busy = false;
      settle();
      return;
    }

    sound('dice', 0.55);
    moving.forEach(function (d) { d.el.classList.add('rolling'); });

    var spin = setInterval(function () {
      moving.forEach(function (d) { d.face = rnd(FACES.length); paint(d); });
    }, 70);

    moving.forEach(function (d, i) {
      setTimeout(function () {
        d.face = rnd(FACES.length);
        paint(d);
        d.el.classList.remove('rolling');
        d.el.classList.add('landed');
        setTimeout(function () { d.el.classList.remove('landed'); }, 400);
      }, 560 + i * 90);
    });

    setTimeout(function () {
      clearInterval(spin);
      busy = false;
      settle();
    }, 560 + moving.length * 90 + 60);
  }

  function settle() {
    show();
    var left = MAX_ROLLS - rollsUsed;
    if (left === 0) hint(t('done'));
    else if (left === 1) hint(t('left1'));
    else hint(t('left2'));
    label();
    pipsPaint();
  }

  /* ---------- dil degisince ---------- */
  new MutationObserver(function () {
    label();
    hint(rollsUsed === 0 ? t('start') : (MAX_ROLLS - rollsUsed === 0 ? t('done') : t('left1')));
    if (stage.dataset.hand) show();
    dice.forEach(paint);
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

  /* ---------- baslat ---------- */
  build();
  pipsPaint();
  label();
  hint(t('start'));
  btn.addEventListener("click", function () { stage.classList.add("touched"); roll(); });

  var mb = stage.querySelector("[data-mute]");
  if (mb) {
    var paintMute = function () {
      mb.textContent = muted ? "✕" : "♪";
      mb.classList.toggle("off", muted);
      mb.setAttribute("aria-pressed", muted ? "true" : "false");
    };
    paintMute();
    mb.addEventListener("click", function () {
      muted = !muted;
      try { localStorage.setItem("npg-mute", muted ? "1" : "0"); } catch (e) {}
      paintMute();
      if (!muted) sound("dice", 0.4);
    });
  }

  // sahne gorunume girince ilk atis kendiliginden
  if ('IntersectionObserver' in window && !reduced) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { io.disconnect(); setTimeout(roll, 420); }
      });
    }, { threshold: 0.3 });
    io.observe(stage);
  }
})();
