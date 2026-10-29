// Noir Pixel v2 — 16 dil. Kaynak dil Turkce (sayfanin kendisi); ceviriler lang/<kod>.js icinde,
// lang/keys.js'teki Turkce metinlerle ayni sirada dizi olarak durur. Metin = anahtar: HTML'e etiket eklemek gerekmez.
// Secim sirasi: kayitli secim > tarayici dilleri (bolgesel) > Turkiye disi icin English.
(() => {
  const B = (window.NP && NP.BASE) || document.currentScript.src.replace(/i18n\.js(\?.*)?$/, '');
  const LANGS = [
    ['tr', 'Türkçe'], ['en', 'English'], ['de', 'Deutsch'], ['fr', 'Français'], ['es', 'Español'], ['it', 'Italiano'],
    ['pt-BR', 'Português (BR)'], ['pl', 'Polski'], ['ru', 'Русский'], ['ar', 'العربية'], ['hi', 'हिन्दी'], ['id', 'Bahasa Indonesia'],
    ['ja', '日本語'], ['ko', '한국어'], ['zh-CN', '简体中文'], ['zh-TW', '繁體中文'],
  ];
  const CODES = LANGS.map(l => l[0]);
  const RTL = ['ar'];
  const FONT = { ja: 'Noto+Sans+JP', ko: 'Noto+Sans+KR', 'zh-CN': 'Noto+Sans+SC', 'zh-TW': 'Noto+Sans+TC', hi: 'Noto+Sans+Devanagari', ar: 'Noto+Sans+Arabic', ru: 'Noto+Serif', pl: null };
  // bolge -> once onerilecek diller (secicide ustte)
  const REGION = {
    TR: ['tr', 'en'], DE: ['de', 'en'], AT: ['de', 'en'], CH: ['de', 'fr', 'it'], FR: ['fr', 'en'], BE: ['fr', 'en'], ES: ['es', 'en'],
    MX: ['es', 'en'], AR: ['es', 'en'], IT: ['it', 'en'], BR: ['pt-BR', 'es'], PT: ['pt-BR', 'es'], PL: ['pl', 'en'], RU: ['ru', 'en'],
    UA: ['ru', 'en'], SA: ['ar', 'en'], AE: ['ar', 'en'], EG: ['ar', 'en'], IN: ['hi', 'en'], ID: ['id', 'en'], JP: ['ja', 'en'],
    KR: ['ko', 'en'], CN: ['zh-CN', 'en'], TW: ['zh-TW', 'en'], HK: ['zh-TW', 'en'], US: ['en', 'es'], GB: ['en'],
  };

  const norm = tag => {
    const t = (tag || '').toLowerCase();
    if (t.startsWith('zh')) return /tw|hk|mo|hant/.test(t) ? 'zh-TW' : 'zh-CN';
    if (t.startsWith('pt')) return 'pt-BR';
    const base = t.split('-')[0];
    return CODES.includes(base) ? base : null;
  };
  const browser = (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || 'tr']);
  const region = (browser.map(t => t.split('-')[1]).find(Boolean) || '').toUpperCase()
    || (/Istanbul/.test(Intl.DateTimeFormat().resolvedOptions().timeZone || '') ? 'TR' : '');
  const suggested = [...new Set([...browser.map(norm).filter(Boolean), ...(REGION[region] || []), 'en', 'tr'])];

  let saved = null;
  try { saved = localStorage.getItem('npg-lang'); } catch (e) { /* depolama kapali */ }
  if (saved === 'pt') saved = 'pt-BR';
  let lang = CODES.includes(saved) ? saved : (browser.map(norm).find(Boolean) || 'en');

  // yaprak ogeler: metni tek parca cevrilecek en kucuk kutular. Icinde yalniz vurgu (em/strong/i/br), ok isareti (span.arr)
  // ya da metnin arasina gomulu link olabilir. Link adresleri anahtardan cikarilir, ceviride kaynaktaki sirayla geri takilir.
  const SKIP = 'script,style,select,option,.notranslate,.g-mono,.langbox';
  const FMT = new Set(['EM', 'STRONG', 'I', 'BR']);
  const isLeaf = el => {
    if (el.closest(SKIP) || !el.textContent.trim()) return false;
    const own = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
    for (const c of el.children) {
      if (FMT.has(c.tagName) || (c.tagName === 'SPAN' && c.classList.contains('arr'))) continue;
      if (c.tagName === 'A' && own && ![...c.children].some(x => !FMT.has(x.tagName))) continue;
      return false;
    }
    return own || [...el.children].some(c => FMT.has(c.tagName));
  };
  const leaves = () => {
    const all = [...document.querySelectorAll('body *')].filter(isLeaf);
    const set = new Set(all);
    return all.filter(el => { for (let p = el.parentElement; p; p = p.parentElement) if (set.has(p)) return false; return true; });
  };
  const key = s => s.replace(/\s+/g, ' ').replace(/ href="[^"]*"/g, ' href').trim();
  const hrefs = s => [...s.matchAll(/ href="[^"]*"/g)].map(m => m[0]);
  const relink = (t, src) => { const h = hrefs(src); let i = 0; return t.replace(/ href(?!=)/g, () => h[i++] || ' href="#"'); };

  let KEYS = null, DICT = {};
  const ATTRS = ['alt', 'aria-label', 'title', 'placeholder'];
  NP.translate = () => {
    if (!KEYS && lang !== 'tr') return;
    leaves().forEach(el => {
      if (el.dataset.tr === undefined) el.dataset.tr = el.innerHTML;
      const src = el.dataset.tr, t = lang === 'tr' ? null : DICT[key(src)];
      const out = t ? relink(t, src) : src;
      if (el.innerHTML !== out) el.innerHTML = out;
    });
    document.querySelectorAll(ATTRS.map(a => `[${a}]`).join(',')).forEach(el => ATTRS.forEach(a => {
      if (!el.hasAttribute(a) || el.closest(SKIP)) return;
      const k = 'tr' + a.replace(/-./g, m => m[1].toUpperCase());
      if (el.dataset[k] === undefined) el.dataset[k] = el.getAttribute(a);
      const t = lang === 'tr' ? null : DICT[key(el.dataset[k])];
      el.setAttribute(a, t || el.dataset[k]);
    }));
    if (!document.documentElement.dataset.trTitle) document.documentElement.dataset.trTitle = document.title;
    const tt = document.documentElement.dataset.trTitle;
    document.title = (lang !== 'tr' && DICT[key(tt)]) || tt;
    const md = document.querySelector('meta[name=description]');
    if (md) { md.dataset.tr ??= md.content; md.content = (lang !== 'tr' && DICT[key(md.dataset.tr)]) || md.dataset.tr; }
  };

  // ceviri anahtarlarini toplamak icin (gelistirme): sayfadaki tum kaynak metinler
  NP.collect = () => {
    const out = new Set(leaves().map(el => key(el.dataset.tr ?? el.innerHTML)));
    document.querySelectorAll(ATTRS.map(a => `[${a}]`).join(',')).forEach(el => ATTRS.forEach(a => { if (el.hasAttribute(a) && !el.closest(SKIP) && el.getAttribute(a).trim() && /[a-zçğıöşü]/i.test(el.getAttribute(a))) out.add(key(el.dataset['tr' + a.replace(/-./g, m => m[1].toUpperCase())] ?? el.getAttribute(a))); }));
    out.add(key(document.documentElement.dataset.trTitle || document.title));
    const md = document.querySelector('meta[name=description]'); if (md) out.add(key(md.dataset.tr ?? md.content));
    return [...out].filter(s => /[a-zçğıöşüA-ZÇĞİÖŞÜ]{2}/.test(s.replace(/<[^>]+>/g, '')));
  };

  const load = src => new Promise((res, rej) => { const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = rej; document.head.appendChild(s); });
  const font = code => {
    const f = FONT[code];
    if (!f || document.getElementById('font-' + code)) return;
    const l = document.createElement('link');
    l.id = 'font-' + code; l.rel = 'stylesheet';
    l.href = `https://fonts.googleapis.com/css2?family=${f}:wght@400;600;700&display=swap`;
    document.head.appendChild(l);
  };

  async function set(code, remember) {
    lang = code;
    document.documentElement.lang = code;
    document.documentElement.dir = RTL.includes(code) ? 'rtl' : 'ltr';
    document.documentElement.dataset.lang = code;
    if (remember) try { localStorage.setItem('npg-lang', code); } catch (e) { /* depolama kapali */ }
    if (code !== 'tr') {
      font(code);
      try {
        if (!KEYS) { await load(B + 'lang/keys.js'); KEYS = NP.KEYS; }
        NP.LANG = NP.LANG || {};
        if (!NP.LANG[code]) await load(B + `lang/${code}.js`);
        DICT = {};
        KEYS.forEach((k, i) => { const v = NP.LANG[code][i]; if (v) DICT[key(k)] = v; });
      } catch (e) { DICT = {}; }
    }
    NP.translate();
    paint();
  }

  // ust bar secicisi
  let box;
  function paint() {
    const btn = document.querySelector('.langbtn');
    if (btn) btn.querySelector('b').textContent = code3(lang);
    if (!box) return;
    const item = c => { const n = LANGS.find(l => l[0] === c)[1]; return `<button role="option" aria-selected="${c === lang}" data-l="${c}" lang="${c}" dir="${RTL.includes(c) ? 'rtl' : 'ltr'}"><span>${n}</span><small>${code3(c)}</small></button>`; };
    const top = suggested.filter(c => CODES.includes(c)).slice(0, 4);
    box.innerHTML = `<div class="langhead notranslate">Önerilen · Suggested</div>${top.map(item).join('')}<div class="langhead notranslate">Tüm diller · All languages</div>${CODES.filter(c => !top.includes(c)).map(item).join('')}`;
  }
  const code3 = c => ({ 'pt-BR': 'PT', 'zh-CN': '简', 'zh-TW': '繁' })[c] || c.toUpperCase();

  function mount() {
    const bar = document.querySelector('.bar');
    if (!bar || document.querySelector('.langbtn')) return;
    const wrap = document.createElement('div');
    wrap.className = 'langwrap notranslate';
    wrap.innerHTML = `<button class="langbtn" aria-haspopup="listbox" aria-expanded="false" aria-label="Dil / Language"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9S14.5 18.3 12 21M12 3C9.5 5.7 8.2 8.7 8.2 12s1.3 6.3 3.8 9"/></svg><b></b></button><div class="langbox" role="listbox" hidden></div>`;
    bar.insertBefore(wrap, bar.querySelector('.burger'));
    box = wrap.querySelector('.langbox');
    const btn = wrap.querySelector('.langbtn');
    const close = () => { box.hidden = true; btn.setAttribute('aria-expanded', false); };
    btn.addEventListener('click', e => { e.stopPropagation(); box.hidden = !box.hidden; btn.setAttribute('aria-expanded', !box.hidden); });
    box.addEventListener('click', e => { const b = e.target.closest('[data-l]'); if (b) { set(b.dataset.l, true); close(); } });
    addEventListener('click', e => { if (!wrap.contains(e.target)) close(); });
    addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
    paint();
  }

  const start = () => { mount(); set(lang, false); };
  if (document.readyState === 'loading') addEventListener('DOMContentLoaded', start); else start();
  // dinamik icerik (raf, oyun sayfasi) cizildikten sonra tekrar
  addEventListener('load', () => NP.translate());
})();
