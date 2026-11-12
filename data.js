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
  { slug: 'pixel-roll-dungeon', name: 'Roll Dungeon', genre: 'Zar & poker RPG', status: 'live', test: true, pkg: 'com.noirpixel.pixelrolldungeon', testPage: 'test.html',
    c1: '#9b5cff', c2: '#120a1f', icon: 'img/icon_prd.webp', art: 'assets/feature.webp',
    shots: ['01_menu_en', '04_battle_en', '05_battle_strike_en', '06_codex_en', '08_reward_en', '09_ice_battle_en'].map(f => `img/prd_${f}.webp`),
    lede: 'Zar ve poker eli üzerine kurulu karanlık fantastik bir zindan RPG’si. Her atış bir karar, her el bir strateji.',
    features: [['Zar senin silahın', 'Zarları at, tut, yeniden at. Poker elleri hasara, kombolar büyüye dönüşür.'],
      ['Derinleşen zindan', 'Her kat yeni düşmanlar, kalıntılar ve risk ile ödül arasında bir seçim getirir.'],
      ['Arena ve sıralama', 'Kendi sunucumuz üzerinden diğer oyuncularla yarış, sezonluk sıralamaya gir.']],
    facts: ['RPG', 'Roguelike', 'Çevrimdışı oynanır', '8 dil'] },
  { slug: 'pixel-daily-puzzles', name: 'Daily Logic Puzzles', genre: 'Günlük mantık bulmacaları', status: 'out', pkg: 'com.noirpixel.pixeldailypuzzles',
    c1: '#5b8cff', c2: '#0b1230', icon: 'img/icon_dlp.png', art: 'img/dlp_feature.png',
    shots: ['home', 'kings', 'sudoku', 'grupla'].map(n => `img/pdp_shot_${n}.jpg`),
    lede: 'On dört klasik mantık bulmacası, her gün yeni bölümler. Tamamen çevrimdışı, saat yok, acele yok.',
    features: [['Her sabah yeni', 'Sudoku, Nonogram, Taçlar ve daha fazlası; her gün taze bölümler.'],
      ['Serini koru', 'Günlük seri, istatistikler ve kendi rekorların.'],
      ['Sakin tasarım', 'Koyu tema, büyük yazı seçeneği, internet gerekmez.']],
    facts: ['Bulmaca', 'Günlük', 'Çevrimdışı', '16 dil'] },
  { slug: 'pixel-hype-puzzle', name: 'Hype Puzzle', genre: 'Parti & bilgi oyunları', status: 'live', test: true, pkg: 'com.noirpixel.pixelhypepuzzle', testPage: 'pixel-hype-puzzle/test.html',
    c1: '#ffd23d', c2: '#1a1406', icon: 'img/icon_php_brand.webp', art: 'assets/php_feature.webp',
    shots: ['home', 'survey', 'quiz', 'wheel'].map(n => `../assets/php_shot_${n}.jpg`),
    lede: 'Bilgi, kelime ve çizim oyunları; hepsi sınırsız, hepsi canlı. Kim çevrimiçi gör, salona gir, rakibini yen.',
    features: [['Popüler Cevap', 'Doğruyu değil, çoğunluğun ne diyeceğini bul.'],
      ['Çiz Puanla', 'Herkese aynı konu, bir dakika süre; kazananlar ertesi sabah.'],
      ['Canlı odalar', '1v1 eşleşme ya da 6 harfli kodla arkadaşlarınla oda.']],
    facts: ['Parti', 'Bilgi yarışması', '4 dil'] },
  { slug: 'pixel-kradot-backpack', name: 'Kradot Backpack', genre: 'Çanta auto-battler', status: 'test', pkg: 'com.noirpixel.kradotbackpack', testPage: 'pixel-kradot-backpack/test.html',
    c1: '#e0a64a', c2: '#150f08', icon: 'img/icon_bp.webp', art: 'assets/backpack/feature.webp',
    shots: ['01_tooltip', '02_prep', '03_combat', '05_heroes', '06_forge', '08_codex'].map(f => `img/bp_${f}.webp`),
    lede: 'Kradot evreninde bir çanta savaşı. Çantanı diz, eşyaları birleştir, kahramanın kendi başına savaşsın.',
    features: [['Çantan senin ordun', 'Eşyalar ızgarada yer kaplar; komşular birbirini güçlendirir.'],
      ['85 eşya, 24 füzyon', 'Hançer ve vampir dişi yan yana gelince yeni bir silah doğar.'],
      ['Gaspçı Kral’a 15 kupa', 'Dört kahraman, saha anomalileri ve diğer oyuncuların kazanan çantaları.']],
    facts: ['Otomatik savaş', '85 eşya', '4 kahraman', '4 dil'] },
  { slug: 'pixel-element-td', name: 'Element TD', genre: 'Dört elementli kule savunması', status: 'test', pkg: 'com.noirpixel.pixelelementtd', testPage: 'element-td/test.html',
    c1: '#5fb8ff', c2: '#0b0e1a', icon: 'img/etd_icon.webp', art: 'img/etd_feature.webp',
    lede: 'Ateş, buz, toprak ve yıldırım. Dört elementin kulesini geçide diz, dalga dalga gelen sürüyü durdur.',
    features: [['Dört element', 'Ateş yakar, buz yavaşlatır, toprak durdurur, yıldırım zincirlenir.'],
      ['Geçidi tut', 'Sürü tek yoldan gelir; kulelerin yeri her şeyi belirler.'],
      ['Dalga dalga', 'Goblinler, orklar ve daha büyükleri; her dalga zayıf noktanı arar.']],
    facts: ['Kule savunması', 'Strateji'] },
  { slug: 'pixel-kradot-td', name: 'Kradot TD', genre: 'Şerit savunması', status: 'dev', mono: 'KT', c1: '#c43c3c', c2: '#140909',
    lede: 'Kradot evreninde şeridini kur, ekonomini büyüt, rakibine akın gönder.' },
  { slug: 'pixel-fm', name: 'FM', genre: 'Futbol menajerliği · çalışma adı', status: 'dev', mono: 'FM', c1: '#3ddc84', c2: '#07140d',
    lede: 'Kadronu kur, taktiğini seç, sezonu yönet.' },
  { slug: 'pixel-doomsday', name: 'Doomsday Shelter', genre: 'Hayatta kalma', status: 'test', pkg: 'com.noirpixel.doomsdayshelter', testPage: 'pixel-doomsday-shelter/test.html',
    c1: '#ff4a3d', c2: '#0a0c18', icon: 'img/icon_dds.png', art: 'img/dds_feature.jpg',
    lede: 'Sirenler çaldı! 60 saniyede aileni ve erzakını topla, sığınakta hayatta kal.',
    features: [['60 saniye', 'Sirenler çalarken evden kimi ve neyi alacağını sen seç.'],
      ['Sığınakta günler', 'Erzakı paylaştır, olaylara karar ver, günleri say.'],
      ['Liderini seç', 'Ailenin başına kimin geçtiği bütün oyunu değiştirir.']],
    facts: ['Hayatta kalma', 'Tek oyunculu', 'Çevrimdışı', '8 dil'] },
  { slug: 'mars-sweepers', name: 'Mars Sweepers', genre: 'Mars’ta hayatta kalma', status: 'dev', mono: 'MS', c1: '#ff7a3d', c2: '#170a06',
    lede: 'Kızıl tozu süpür, Hab’ını kur, patatesini yetiştir. Mars’ı adım adım yaşanır bir yere çevir.' },
  { slug: 'ludus', name: 'Ludus', genre: 'Gladyatör okulu yönetimi', status: 'dev', mono: 'LU', c1: '#d4a04a', c2: '#160e07',
    lede: 'Bir gladyatör okulunun başındasın. Savaşçılarını seç, eğit, arenaya çıkar; kalabalığı ve hamilerini memnun tut.' },
  { slug: 'airport', name: 'Airport', genre: 'Gümrük memuru · çalışma adı', status: 'dev', mono: 'AP', c1: '#4fb7d4', c2: '#07131a',
    lede: 'Havalimanında gümrük memurusun. Pasaportu, valizi ve anlatılan hikâyeyi kontrol et; kimin geçeceğine sen karar ver.' },
  { slug: 'gizli-1', name: 'Duyurulmamış proje', genre: 'Taşlar diziliyor', status: 'secret', mono: '?', c1: '#ff8a1f', c2: '#14120d' },];

NP.GAMES.forEach(g => {
  ['icon', 'art', 'testPage'].forEach(k => { if (g[k]) g[k] = NP.url(g[k]); });
  if (g.shots) g.shots = g.shots.map(NP.url);
  g.page = NP.url(`oyun.html?g=${g.slug}`);
});
// durum rozetleri: on kayittaki oyun ayni anda kapali testte de olabilir (test: true)
NP.chips = g => `<span class="st ${NP.STATUS[g.status].cls}">${NP.STATUS[g.status].label}</span>` +
  (g.test && g.status !== 'test' ? '<span class="st st-test">Kapalı test</span>' : '');
// sayilar sayfalara buradan basilir (data-count="..."): elle yazilan "2 on kayitta" eskimesin
NP.count = k => k === 'all' ? NP.GAMES.length
  : k === 'test' ? NP.GAMES.filter(g => g.status === 'test' || g.test).length
  : NP.GAMES.filter(g => g.status === k).length;
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
    <span class="g-meta"><span class="sts">${NP.chips(g)}</span><b>${g.name}</b><small>${g.genre}</small></span>
  </${tag}>`;
};
