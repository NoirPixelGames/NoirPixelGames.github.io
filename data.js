// Noir Pixel v2 — oyun verisi (tek kaynak: raf, katalog, oyun sayfasi, test merkezi)
window.NP = window.NP || {};
// yollar bu dosyanin konumuna gore cozulur: oyun/*.html gibi alt klasor sayfalari da ayni veriyi kullanir
NP.BASE = document.currentScript.src.replace(/data\.js(\?.*)?$/, '');
NP.url = p => p && !/^https?:/.test(p) ? new URL(p, NP.BASE).href : p;
NP.PLAY = id => `https://play.google.com/store/apps/details?id=${id}`;
NP.TEST = id => `https://play.google.com/apps/testing/${id}`;
NP.GROUP = 'https://groups.google.com/g/noirpixel-testers';
NP.MAIL = 'iletisim.noirpixel@gmail.com';

NP.STATUS = {
  out: { label: 'Yayında', cls: 'st-out' },
  live: { label: 'Ön kayıtta', cls: 'st-live' },
  test: { label: 'Kapalı test', cls: 'st-test' },
  dev: { label: 'Yapımda', cls: 'st-dev' },
  secret: { label: 'Duyurulmadı', cls: 'st-secret' },
};

NP.GAMES = [
  { slug: 'pixel-roll-dungeon', name: 'Pixel Roll Dungeon', genre: 'Zar & poker RPG', status: 'live', pkg: 'com.noirpixel.pixelrolldungeon',
    c1: '#9b5cff', c2: '#120a1f', icon: 'img/icon_prd.webp', art: 'assets/feature.webp',
    shots: ['01_menu_en', '04_battle_en', '05_battle_strike_en', '06_codex_en', '08_reward_en', '09_ice_battle_en'].map(f => `img/prd_${f}.webp`),
    lede: 'Zar ve poker eli üzerine kurulu karanlık fantastik bir zindan RPG’si. Her atış bir karar, her el bir strateji.',
    features: [['Zar senin silahın', 'Zarları at, tut, yeniden at. Poker elleri hasara, kombolar büyüye dönüşür.'],
      ['Derinleşen zindan', 'Her kat yeni düşmanlar, kalıntılar ve risk ile ödül arasında bir seçim getirir.'],
      ['Arena ve sıralama', 'Kendi sunucumuz üzerinden diğer oyuncularla yarış, sezonluk sıralamaya gir.']],
    facts: ['RPG', 'Roguelike', 'Çevrimdışı oynanır', '8 dil'] },
  { slug: 'pixel-daily-puzzles', name: 'Pixel Daily Puzzles', genre: 'Günlük mantık bulmacaları', status: 'out', pkg: 'com.noirpixel.pixeldailypuzzles',
    c1: '#5b8cff', c2: '#0b1230', icon: 'img/icon_pdp_v2.png', art: 'img/pdp_feature_v2.jpg',
    shots: ['home', 'kings', 'sudoku', 'grupla'].map(n => `img/pdp_shot_${n}.jpg`),
    lede: 'On dört klasik mantık bulmacası, her gün yeni bölümler. Tamamen çevrimdışı, saat yok, acele yok.',
    features: [['Her sabah yeni', 'Sudoku, Nonogram, Taçlar ve daha fazlası; her gün taze bölümler.'],
      ['Serini koru', 'Günlük seri, istatistikler ve kendi rekorların.'],
      ['Sakin tasarım', 'Koyu tema, büyük yazı seçeneği, internet gerekmez.']],
    facts: ['Bulmaca', 'Günlük', 'Çevrimdışı', '16 dil'] },
  { slug: 'pixel-hype-puzzle', name: 'Pixel Hype Puzzle', genre: 'Parti & bilgi oyunları', status: 'test', pkg: 'com.noirpixel.pixelhypepuzzle', testPage: 'pixel-hype-puzzle/test.html',
    c1: '#ffd23d', c2: '#1a1406', icon: 'img/icon_php_brand.webp', art: 'assets/php_feature.webp',
    shots: ['home', 'survey', 'quiz', 'wheel'].map(n => `../assets/php_shot_${n}.jpg`),
    lede: 'Bilgi, kelime ve çizim oyunları; hepsi sınırsız, hepsi canlı. Kim çevrimiçi gör, salona gir, rakibini yen.',
    features: [['Popüler Cevap', 'Doğruyu değil, çoğunluğun ne diyeceğini bul.'],
      ['Çiz Puanla', 'Herkese aynı konu, bir dakika süre; kazananlar ertesi sabah.'],
      ['Canlı odalar', '1v1 eşleşme ya da 6 harfli kodla arkadaşlarınla oda.']],
    facts: ['Parti', 'Bilgi yarışması', '4 dil'] },
  { slug: 'pixel-kradot-backpack', name: 'Pixel Kradot Backpack', genre: 'Çanta auto-battler', status: 'test', pkg: 'com.noirpixel.kradotbackpack', testPage: 'pixel-kradot-backpack/test.html',
    c1: '#e0a64a', c2: '#150f08', icon: 'img/icon_bp.webp', art: 'assets/backpack/feature.webp',
    shots: ['01_tooltip', '02_prep', '03_combat', '05_heroes', '06_forge', '08_codex'].map(f => `img/bp_${f}.webp`),
    lede: 'Kradot evreninde bir çanta savaşı. Çantanı diz, eşyaları birleştir, kahramanın kendi başına savaşsın.',
    features: [['Çantan senin ordun', 'Eşyalar ızgarada yer kaplar; komşular birbirini güçlendirir.'],
      ['85 eşya, 24 füzyon', 'Hançer ve vampir dişi yan yana gelince yeni bir silah doğar.'],
      ['Gaspçı Kral’a 15 kupa', 'Dört kahraman, saha anomalileri ve diğer oyuncuların kazanan çantaları.']],
    facts: ['Otomatik savaş', '85 eşya', '4 kahraman', '4 dil'] },
  { slug: 'pixel-element-td', name: 'Pixel Element TD', genre: 'Dört elementli kule savunması', status: 'test', pkg: 'com.noirpixel.pixelelementtd', testPage: 'element-td/test.html',
    c1: '#5fb8ff', c2: '#0b0e1a', icon: 'img/etd_icon.webp', art: 'img/etd_feature.webp',
    lede: 'Ateş, buz, toprak ve yıldırım. Dört elementin kulesini geçide diz, dalga dalga gelen sürüyü durdur.',
    features: [['Dört element', 'Ateş yakar, buz yavaşlatır, toprak durdurur, yıldırım zincirlenir.'],
      ['Geçidi tut', 'Sürü tek yoldan gelir; kulelerin yeri her şeyi belirler.'],
      ['Dalga dalga', 'Goblinler, orklar ve daha büyükleri; her dalga zayıf noktanı arar.']],
    facts: ['Kule savunması', 'Strateji'] },
  { slug: 'pixel-kradot-td', name: 'Pixel Kradot TD', genre: 'Şerit savunması', status: 'dev', mono: 'KT', c1: '#c43c3c', c2: '#140909',
    lede: 'Kradot evreninde şeridini kur, ekonomini büyüt, rakibine akın gönder.' },
  { slug: 'pixel-fm', name: 'Pixel FM', genre: 'Futbol menajerliği', status: 'dev', mono: 'FM', c1: '#3ddc84', c2: '#07140d',
    lede: 'Kadronu kur, taktiğini seç, sezonu yönet.' },
  { slug: 'pixel-doomsday', name: 'Pixel Doomsday Shelter', genre: 'Hayatta kalma', status: 'test', pkg: 'com.noirpixel.doomsdayshelter', testPage: 'pixel-doomsday-shelter/test.html',
    c1: '#ff4a3d', c2: '#0a0c18', icon: 'img/icon_dds.png', art: 'img/dds_feature.jpg',
    lede: 'Sirenler çaldı! 60 saniyede aileni ve erzakını topla, sığınakta hayatta kal.',
    features: [['60 saniye', 'Sirenler çalarken evden kimi ve neyi alacağını sen seç.'],
      ['Sığınakta günler', 'Erzakı paylaştır, olaylara karar ver, günleri say.'],
      ['Liderini seç', 'Ailenin başına kimin geçtiği bütün oyunu değiştirir.']],
    facts: ['Hayatta kalma', 'Tek oyunculu', 'Çevrimdışı', '8 dil'] },
  { slug: 'gizli-1', name: 'Duyurulmamış proje', genre: 'Taşlar diziliyor', status: 'secret', mono: '?', c1: '#d9c39a', c2: '#14120d' },
  { slug: 'gizli-2', name: 'Duyurulmamış proje', genre: 'Büyük bir harita', status: 'secret', mono: '?', c1: '#8aa0ff', c2: '#0b0d18' },
];

NP.GAMES.forEach(g => {
  ['icon', 'art', 'testPage'].forEach(k => { if (g[k]) g[k] = NP.url(g[k]); });
  if (g.shots) g.shots = g.shots.map(NP.url);
  g.page = NP.url(`oyun.html?g=${g.slug}`);
});
NP.game = slug => NP.GAMES.find(g => g.slug === slug);

// oyun karti (raf ve katalog ortak)
NP.card = (g, i = 0) => {
  const st = NP.STATUS[g.status];
  const tag = g.status === 'secret' ? 'div' : 'a';
  const href = g.status === 'secret' ? '' : ` href="${g.page}"`;
  const media = g.icon
    ? `<img class="g-icon" src="${g.icon}" alt="" loading="lazy" style="view-transition-name:icon-${g.slug}">`
    : `<span class="g-mono" style="view-transition-name:icon-${g.slug}">${g.mono}</span>`;
  return `<${tag} class="gcard reveal ${g.status}"${href} style="--c1:${g.c1};--c2:${g.c2};--d:${i * 60}ms" data-status="${g.status}">
    <span class="g-bg"></span>${media}<span class="g-glow"></span>
    <span class="g-meta"><span class="st ${st.cls}">${st.label}</span><b>${g.name}</b><small>${g.genre}</small></span>
  </${tag}>`;
};
