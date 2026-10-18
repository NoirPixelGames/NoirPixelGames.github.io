/* Noir Pixel Games — ortak davranislar
   Kutuphane yok, bagimlilik yok. Her sayfa bunu yukler. */
(function () {
  'use strict';

  var reduced = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- yil ---------- */
  function year() {
    var els = document.querySelectorAll('[data-year]');
    for (var i = 0; i < els.length; i++) els[i].textContent = new Date().getFullYear();
  }

  /* ---------- mobil menu ---------- */
  function menu() {
    var b = document.querySelector('.burger');
    var m = document.querySelector('.menu');
    if (!b || !m) return;
    b.addEventListener('click', function () {
      var open = m.classList.toggle('open');
      b.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    m.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') m.classList.remove('open');
    });
  }

  /* ---------- gorunume girince yumusak acilis ---------- */
  function reveal() {
    var els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    if (reduced || !('IntersectionObserver' in window)) {
      for (var i = 0; i < els.length; i++) els[i].classList.add('in');
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    for (var j = 0; j < els.length; j++) io.observe(els[j]);
  }

  /* ---------- hero: kor parcaciklari ---------- */
  function embers() {
    var host = document.querySelector('.embers');
    if (!host || reduced) return;
    var n = window.innerWidth < 700 ? 10 : 20;
    var html = '';
    for (var i = 0; i < n; i++) {
      var left = Math.random() * 100;
      var dur = 9 + Math.random() * 11;
      var delay = Math.random() * dur;
      var dx = (Math.random() * 90 - 45).toFixed(0);
      var size = 2 + Math.round(Math.random() * 2);
      html += '<i class="ember" style="left:' + left.toFixed(2) + '%;' +
        'width:' + size + 'px;height:' + size + 'px;' +
        '--dx:' + dx + 'px;animation-duration:' + dur.toFixed(1) + 's;' +
        'animation-delay:-' + delay.toFixed(1) + 's"></i>';
    }
    host.innerHTML = html;
  }

  /* ---------- hero: imleci takip eden mesale ---------- */
  function torch() {
    var t = document.querySelector('.torch');
    var hero = document.querySelector('.hero');
    if (!t || !hero || reduced) return;
    if (!window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;
    var x = 0, y = 0, cx = 0, cy = 0, raf = null;
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      x = e.clientX - r.left; y = e.clientY - r.top;
      if (!raf) raf = requestAnimationFrame(tick);
    });
    function tick() {
      cx += (x - cx) * 0.12; cy += (y - cy) * 0.12;
      t.style.transform = 'translate(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px)';
      if (Math.abs(x - cx) > 0.5 || Math.abs(y - cy) > 0.5) raf = requestAnimationFrame(tick);
      else raf = null;
    }
  }

  /* ---------- terminal: satir satir yazan metin ---------- */
  function typer() {
    var el = document.querySelector('[data-type]');
    if (!el) return;
    var lines;
    try { lines = JSON.parse(el.getAttribute('data-type')); } catch (e) { return; }
    if (!lines || !lines.length) return;
    var box = el.querySelector('.txt');
    if (!box) return;
    if (reduced) { box.textContent = lines[0]; return; }
    var li = 0, ci = 0, dir = 1;
    function step() {
      var s = lines[li];
      box.textContent = s.slice(0, ci);
      if (dir > 0) {
        ci++;
        if (ci > s.length) { dir = -1; return setTimeout(step, 2200); }
        return setTimeout(step, 38);
      }
      ci--;
      if (ci <= 0) { dir = 1; li = (li + 1) % lines.length; return setTimeout(step, 420); }
      setTimeout(step, 16);
    }
    step();
  }

  /* ---------- vitrin: gorunen oyunu isaretle ---------- */
  function showcase() {
    var bolumler = document.querySelectorAll(".show");
    var noktalar = document.querySelectorAll(".show-dots a");
    if (!bolumler.length) return;

    if (!("IntersectionObserver" in window)) {
      for (var i = 0; i < bolumler.length; i++) bolumler[i].classList.add("in");
      return;
    }

    // icerik acilisi
    var acan = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); acan.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.18 });
    for (var j = 0; j < bolumler.length; j++) acan.observe(bolumler[j]);

    // alt dizinde aktif olani isaretle
    if (!noktalar.length) return;
    var aktif = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var id = e.target.id;
        for (var k = 0; k < noktalar.length; k++) {
          noktalar[k].classList.toggle("on", noktalar[k].getAttribute("href") === "#" + id);
        }
      });
    }, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });
    for (var m = 0; m < bolumler.length; m++) aktif.observe(bolumler[m]);
  }

  /* ---------- oyun kartlari: hafif egilme ---------- */
  function tilt() {
    if (reduced) return;
    if (!window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;
    var cabs = document.querySelectorAll('.cab');
    for (var i = 0; i < cabs.length; i++) {
      (function (c) {
        c.addEventListener('pointermove', function (e) {
          var r = c.getBoundingClientRect();
          var px = (e.clientX - r.left) / r.width - 0.5;
          var py = (e.clientY - r.top) / r.height - 0.5;
          c.style.transform = 'translateY(-6px) perspective(900px) rotateX(' +
            (-py * 5).toFixed(2) + 'deg) rotateY(' + (px * 6).toFixed(2) + 'deg)';
        });
        c.addEventListener('pointerleave', function () { c.style.transform = ''; });
      })(cabs[i]);
    }
  }

  /* ---------- diller ----------
     TR sayfanin kendisinde yazili. Diger diller window.NPG_I18N icinde.
     Sozlukte olmayan anahtar Turkce kalir; sayfa asla bozulmaz. */
  var LANGS = [
    ["tr", "Türkçe"],
    ["en", "English"],
    ["es", "Español"],
    ["pt", "Português"],
    ["de", "Deutsch"],
    ["fr", "Français"],
    ["it", "Italiano"],
    ["id", "Indonesia"]
  ];

  function i18n() {
    var pick = document.getElementById("langpick");
    if (!pick) return;

    // ortak sozluk (assets/i18n.js) + sayfaya ozel sozluk
    var page = window.NPG_I18N || (window.NPG_EN ? { en: window.NPG_EN } : {});
    var shared = window.NPG_SHARED || {};
    var dicts = {};
    for (var li = 1; li < LANGS.length; li++) {
      var code = LANGS[li][0];
      if (!shared[code] && !page[code]) continue;
      var merged = {};
      var sc = shared[code] || {}, pc = page[code] || {};
      for (var a in sc) if (Object.prototype.hasOwnProperty.call(sc, a)) merged[a] = sc[a];
      for (var b in pc) if (Object.prototype.hasOwnProperty.call(pc, b)) merged[b] = pc[b];
      dicts[code] = merged;
    }
    var have = ["tr"];
    for (var i = 1; i < LANGS.length; i++) {
      if (dicts[LANGS[i][0]]) have.push(LANGS[i][0]);
    }
    if (have.length < 2) { pick.style.display = "none"; return; }

    // secenekleri kur
    pick.innerHTML = "";
    for (var j = 0; j < LANGS.length; j++) {
      if (have.indexOf(LANGS[j][0]) === -1) continue;
      var o = document.createElement("option");
      o.value = LANGS[j][0];
      o.textContent = LANGS[j][1];
      pick.appendChild(o);
    }

    var nodes = document.querySelectorAll("[data-i18n]");
    var TR = {};
    for (var k = 0; k < nodes.length; k++) {
      TR[nodes[k].getAttribute("data-i18n")] = nodes[k].innerHTML;
    }

    function apply(lang, remember) {
      var d = (lang === "tr") ? TR : (dicts[lang] || TR);
      for (var m = 0; m < nodes.length; m++) {
        var key = nodes[m].getAttribute("data-i18n");
        nodes[m].innerHTML = (d[key] !== undefined) ? d[key] : TR[key];
      }
      document.documentElement.lang = lang;
      pick.value = lang;
      var t = document.querySelector("[data-type]");
      if (t && t.getAttribute("data-type-" + lang)) {
        t.setAttribute("data-type", t.getAttribute("data-type-" + lang));
      }
      if (remember) { try { localStorage.setItem("npg-lang", lang); } catch (e) {} }
    }

    pick.addEventListener("change", function () { apply(pick.value, true); });

    var saved = null;
    try { saved = localStorage.getItem("npg-lang"); } catch (e) {}
    if (saved && have.indexOf(saved) > -1) { apply(saved, false); return; }

    var nav = (navigator.language || "tr").slice(0, 2).toLowerCase();
    if (have.indexOf(nav) > -1) apply(nav, false);
    else if (nav !== "tr" && have.indexOf("en") > -1) apply("en", false);
    else apply("tr", false);
  }

  /* ---------- hero videosu ----------
     1 MB'lik dosyayı herkese indirtmeyelim: dar ekranda ve veri tasarrufunda
     poster görseli kalır, sadece uygun koşulda video yüklenir. */
  function heroVideo() {
    var v = document.getElementById("herovid");
    if (!v || reduced) return;
    if (window.innerWidth < 760) return;                       // mobilde poster yeter
    var con = navigator.connection;
    if (con && (con.saveData || /2g/.test(con.effectiveType || ""))) return;
    v.src = v.getAttribute("data-src") || "assets/video/hero.webm";
    v.load();
    var p = v.play();
    if (p && p.catch) p.catch(function () {});                 // engellenirse poster kalır
  }

  /* site geneli atmosfer videosu — 336 KB, yalnizca uygun kosulda */
  function atmos() {
    var box = document.querySelector(".atmos");
    var v = document.getElementById("atmos");
    if (!box || !v || reduced) return;
    var con = navigator.connection;
    var dar = window.innerWidth < 760;
    if (dar || (con && (con.saveData || /2g/.test(con.effectiveType || "")))) {
      // video yok: poster gorseli yine de yasayan bir doku birakir
      var img = document.createElement("img");
      img.src = v.getAttribute("poster");
      img.alt = "";
      v.parentNode.replaceChild(img, v);
      box.classList.add("on");
      return;
    }
    var base = v.getAttribute("poster").replace("atmos-poster.webp", "atmos.webm");
    v.src = base;
    v.load();
    var p = v.play();
    if (p && p.catch) p.catch(function () {});
    v.addEventListener("playing", function () { box.classList.add("on"); }, { once: true });
    setTimeout(function () { box.classList.add("on"); }, 2500);   // yine de goster
  }

  /* ---------- acilis sekansi ----------
     Yalnizca zar sahnesi olan sayfada ve oturumda bir kez.
     Ikinci ziyarette sayfa dogrudan acilir: giris animasyonu bir kez etkiler,
     her seferinde oynarsa bekletmeye donusur. */
  function intro() {
    if (!document.getElementById("stage")) return;
    if (reduced) return;
    var gorundu = false;
    try { gorundu = sessionStorage.getItem("npg-intro") === "1"; } catch (e) {}
    if (gorundu) return;
    try { sessionStorage.setItem("npg-intro", "1"); } catch (e) {}
    document.documentElement.classList.add("intro");
    // sekans bitince sinifi kaldir ki sonraki etkilesimler serbest kalsin
    setTimeout(function () {
      document.documentElement.classList.remove("intro");
    }, 3200);
  }

  function boot() {
    intro(); year(); menu(); reveal(); embers(); torch(); tilt(); showcase(); i18n(); typer(); heroVideo(); atmos();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else { boot(); }
})();

/* ==========================================================================
   EK BILESENLER — lightbox, kadro oklari, kunye kopyalama
   site.js ana IIFE'sinden bagimsiz; biri patlarsa digerleri calisir.
   ========================================================================== */
(function () {
  'use strict';
  var reduced = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1) Ekran goruntusu buyutme ---------- */
  function lightbox() {
    var galeriler = document.querySelectorAll('.shots');
    if (!galeriler.length) return;

    var kutu = document.createElement('div');
    kutu.className = 'lb';
    kutu.setAttribute('role', 'dialog');
    kutu.setAttribute('aria-modal', 'true');
    kutu.innerHTML =
      '<button class="lb-btn lb-close" type="button" aria-label="Kapat">\u2715</button>' +
      '<button class="lb-btn lb-prev" type="button" aria-label="\u00d6nceki">\u2039</button>' +
      '<img alt="">' +
      '<button class="lb-btn lb-next" type="button" aria-label="Sonraki">\u203a</button>' +
      '<span class="lb-say"></span>';
    document.body.appendChild(kutu);

    var im = kutu.querySelector('img');
    var say = kutu.querySelector('.lb-say');
    var liste = [], sira = 0, aktifOge = null;

    function goster(i) {
      sira = (i + liste.length) % liste.length;
      var k = liste[sira];
      im.src = k.currentSrc || k.src;
      im.alt = k.alt || '';
      say.textContent = (sira + 1) + ' / ' + liste.length;
      var tek = liste.length < 2;
      kutu.querySelector('.lb-prev').style.display = tek ? 'none' : '';
      kutu.querySelector('.lb-next').style.display = tek ? 'none' : '';
    }
    function ac(gal, k) {
      liste = [].slice.call(gal.querySelectorAll('img'));
      aktifOge = document.activeElement;
      goster(liste.indexOf(k));
      kutu.classList.add('on');
      document.body.style.overflow = 'hidden';
      kutu.querySelector('.lb-close').focus();
    }
    function kapat() {
      kutu.classList.remove('on');
      document.body.style.overflow = '';
      im.removeAttribute('src');
      if (aktifOge && aktifOge.focus) aktifOge.focus();
    }

    for (var g = 0; g < galeriler.length; g++) {
      (function (gal) {
        gal.addEventListener('click', function (e) {
          var k = e.target.closest ? e.target.closest('img') : null;
          if (k && gal.contains(k)) ac(gal, k);
        });
      })(galeriler[g]);
    }

    kutu.addEventListener('click', function (e) {
      if (e.target === kutu) return kapat();
      if (e.target.closest('.lb-close')) return kapat();
      if (e.target.closest('.lb-prev')) return goster(sira - 1);
      if (e.target.closest('.lb-next')) return goster(sira + 1);
    });
    document.addEventListener('keydown', function (e) {
      if (!kutu.classList.contains('on')) return;
      if (e.key === 'Escape') kapat();
      else if (e.key === 'ArrowLeft') goster(sira - 1);
      else if (e.key === 'ArrowRight') goster(sira + 1);
    });
    // mobilde kaydirma
    var x0 = null;
    kutu.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    kutu.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var d = e.changedTouches[0].clientX - x0;
      if (Math.abs(d) > 48) goster(sira + (d < 0 ? 1 : -1));
      x0 = null;
    }, { passive: true });
  }

  /* ---------- 2) Kadro: ok butonlari + ilerleme ---------- */
  function kadro() {
    var r = document.querySelector('.roster');
    if (!r) return;

    var sarma = document.createElement('div');
    sarma.className = 'roster-wrap';
    r.parentNode.insertBefore(sarma, r);
    sarma.appendChild(r);

    var geri = document.createElement('button');
    geri.className = 'roster-nav prev'; geri.type = 'button';
    geri.setAttribute('aria-label', 'Geri'); geri.innerHTML = '\u2039';
    var ileri = document.createElement('button');
    ileri.className = 'roster-nav next'; ileri.type = 'button';
    ileri.setAttribute('aria-label', 'İleri'); ileri.innerHTML = '\u203a';
    var cubuk = document.createElement('div');
    cubuk.className = 'roster-bar'; cubuk.innerHTML = '<i></i>';
    var dolgu = cubuk.querySelector('i');

    sarma.appendChild(geri); sarma.appendChild(ileri);
    sarma.appendChild(cubuk);

    function adim() {
      var f = r.querySelector('figure');
      return f ? (f.getBoundingClientRect().width + 14) * 2 : 300;
    }
    function guncelle() {
      var max = r.scrollWidth - r.clientWidth;
      var oran = max > 0 ? r.scrollLeft / max : 0;
      var gen = max > 0 ? Math.max(12, (r.clientWidth / r.scrollWidth) * 100) : 100;
      dolgu.style.width = gen + '%';
      dolgu.style.marginLeft = (oran * (100 - gen)) + '%';
      geri.disabled = r.scrollLeft < 4;
      ileri.disabled = r.scrollLeft > max - 4;
    }
    function kay(yon) {
      r.scrollBy({ left: yon * adim(), behavior: reduced ? 'auto' : 'smooth' });
    }
    geri.addEventListener('click', function () { kay(-1); });
    ileri.addEventListener('click', function () { kay(1); });
    r.addEventListener('scroll', guncelle, { passive: true });
    window.addEventListener('resize', guncelle);
    guncelle();
  }

  /* ---------- 3) Kunyeyi panoya kopyala ---------- */
  function kunye() {
    var b = document.querySelector('[data-copy-facts]');
    if (!b) return;
    var tablo = document.querySelector('.facts');
    if (!tablo) { b.style.display = 'none'; return; }

    b.addEventListener('click', function () {
      var satirlar = [].slice.call(tablo.querySelectorAll('tr')).map(function (tr) {
        var h = tr.querySelector('th'), d = tr.querySelector('td');
        return h && d ? h.textContent.trim() + ': ' + d.textContent.trim() : '';
      }).filter(Boolean);
      var metin = satirlar.join('\n') + '\n' + location.origin + location.pathname;

      var bitti = function () {
        var eski = b.textContent;
        b.textContent = '\u2713';
        b.classList.add('ok');
        setTimeout(function () { b.textContent = eski; b.classList.remove('ok'); }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(metin).then(bitti, function () {});
      } else {
        var t = document.createElement('textarea');
        t.value = metin; document.body.appendChild(t); t.select();
        try { document.execCommand('copy'); bitti(); } catch (e) {}
        document.body.removeChild(t);
      }
    });
  }

  function basla() { try { lightbox(); } catch (e) {} try { kadro(); } catch (e) {} try { kunye(); } catch (e) {} }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', basla);
  else basla();
})();
