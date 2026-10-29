// Noir Pixel v2 — ortak ust bar, alt bilgi, menu, acilis, giris animasyonlari
// Adresler betigin kendi konumuna gore kurulur: alt klasordeki sayfalar (hukuki, test) da ayni parcayi kullanir.
(() => {
  const B = document.currentScript.src.replace(/layout\.js(\?.*)?$/, '');
  window.NP = window.NP || {};
  NP.BASE = B;
  const page = document.body.dataset.page || '';
  const MAIL = NP.MAIL || 'iletisim.noirpixel@gmail.com';
  const nav = [
    ['oyunlar.html', 'Oyunlar', 'oyunlar'], ['studyo.html', 'Stüdyo', 'studyo'], ['is-birligi.html', 'İş birliği', 'is-birligi'],
    ['basin.html', 'Basın', 'basin'], ['sss.html', 'SSS', 'sss'], ['test-merkezi.html', 'Testçi ol', 'test'],
  ];
  const links = nav.map(([h, t, k]) => `<a href="${B}${h}"${k === page ? ' aria-current="page"' : ''}>${t}</a>`).join('');

  // acilis: oturumda bir kez, ana sayfada
  let intro = '';
  try {
    if (page === 'home' && !sessionStorage.getItem('np-intro') && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      sessionStorage.setItem('np-intro', '1');
      intro = `<div class="intro" aria-hidden="true"><img src="${B}img/mark.webp" alt=""><span class="intro-line"></span></div>`;
    }
  } catch (e) { /* depolama kapali: acilis yok */ }

  document.body.insertAdjacentHTML('afterbegin', `${intro}
  <div class="grain" aria-hidden="true"></div>
  <a class="skip" href="#icerik">İçeriğe geç</a>
  <header class="bar">
    <a class="logo" href="${B}index.html" aria-label="Noir Pixel Games — ana sayfa"><img src="${B}img/lockup.webp" alt="Noir Pixel Games" width="150" height="50"></a>
    <nav class="nav" id="nav">${links}<a class="nav-cta" href="${B}iletisim.html"${page === 'iletisim' ? ' aria-current="page"' : ''}>İletişim</a></nav>
    <button class="burger" aria-label="Menü" aria-expanded="false" aria-controls="nav"><span></span><span></span></button>
  </header>`);
  const main = document.querySelector('main');
  if (main && !main.id) main.id = 'icerik';
  if (intro) setTimeout(() => document.querySelector('.intro')?.classList.add('out'), 1100);

  const games = (NP.GAMES || []).filter(g => g.status !== 'secret' && g.status !== 'dev');
  const legal = NP.LEGAL || '';
  document.body.insertAdjacentHTML('beforeend', `
  <footer class="foot">
    <div class="foot-top">
      <div class="foot-brand">
        <img src="${B}img/lockup.webp" alt="Noir Pixel Games" width="180" height="60">
        <p>Türkiye’den bağımsız bir mobil oyun stüdyosu. Küçük ekran, büyük dünyalar.</p>
        <a class="foot-mail" href="mailto:${MAIL}">${MAIL}</a>
      </div>
      <div><h4>Oyunlar</h4>${games.map(g => `<a href="${B}oyun.html?g=${g.slug}">${g.name}</a>`).join('')}<a href="${B}oyunlar.html">Tümü</a></div>
      <div><h4>Stüdyo</h4><a href="${B}studyo.html">Hikayemiz</a><a href="${B}studyo.html#ilkeler">İlkelerimiz</a><a href="${B}is-birligi.html">İş birliği</a><a href="${B}basin.html">Basın kiti</a><a href="${B}iletisim.html">İletişim</a></div>
      <div><h4>Destek</h4><a href="${B}test-merkezi.html">Testçi ol</a><a href="${B}sss.html">Sık sorulanlar</a><a href="${B}${legal}privacy-policy.html">Gizlilik politikası</a><a href="${B}${legal}terms-of-service.html">Kullanım koşulları</a><a href="${B}${legal}delete-data.html">Verilerimi sil</a></div>
    </div>
    <div class="foot-bottom"><span>© ${new Date().getFullYear()} Noir Pixel Games</span><span>Godot ile yapıldı · Türkiye</span></div>
  </footer>`);

  const burger = document.querySelector('.burger'), navEl = document.getElementById('nav');
  burger.addEventListener('click', () => {
    const open = document.body.classList.toggle('menu-open');
    burger.setAttribute('aria-expanded', open);
  });
  navEl.addEventListener('click', e => { if (e.target.closest('a')) document.body.classList.remove('menu-open'); });
  addEventListener('keydown', e => { if (e.key === 'Escape') { document.body.classList.remove('menu-open'); burger.setAttribute('aria-expanded', false); } });

  const bar = document.querySelector('.bar');
  const onScroll = () => bar.classList.toggle('scrolled', scrollY > 24);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  NP.reveal = () => {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .1, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal:not(.in)').forEach(el => io.observe(el));
    if (NP.translate) NP.translate();
  };
  if (document.readyState === 'loading') addEventListener('DOMContentLoaded', NP.reveal); else NP.reveal();
})();
