# Noir Pixel Games — web sitesi

Statik site. Derleme adımı yok, bağımlılık yok: dosyalar olduğu gibi GitHub Pages'te yayınlanıyor.

## Yapı

```
index.html              ana sayfa (hero + 6 oyunluk raf + stüdyo + vizyon + iletişim)
oyunlar.html            oyun listesi
oyun/                   her oyunun kendi sayfası
studyo.html             biz kimiz / vizyon / iş birliği
basin.html              basın kiti
legal.html              hukuki belgelerin dizini
404.html                bulunamadı sayfası
sitemap.xml             arama motorları için
robots.txt

assets/site.css         tüm sitenin stili (tek dosya)
assets/site.js          menü, TR/EN, animasyonlar (tek dosya, kütüphane yok)
assets/                 ikonlar ve oyun görselleri

privacy-policy.html     ⚠ Play Console'a kayıtlı adresler — ASLA taşıma/yeniden adlandırma
terms-of-service.html   ⚠
delete-data.html        ⚠
test.html               ⚠ testçi davet sayfası, duyurularda paylaşıldı
pixel-daily-puzzles/    ⚠ aynısı Pixel Daily Puzzles için
pixel-hype-puzzle/      ⚠ aynısı Pixel Hype Puzzle için
app-ads.txt             ⚠ AdMob doğrulaması — kökte kalmalı
```

## Alan adını değiştirmek

```bash
node tools/set-domain.js noirpixelgames.com
```

Script tüm `canonical`, `og:url`, `og:image`, JSON-LD, `sitemap.xml` ve `robots.txt`
adreslerini günceller ve kök dizine `CNAME` dosyası yazar. Geri almak için
`node tools/set-domain.js noirpixelgames.github.io`.

Sonrasında elle yapılacaklar:

1. DNS'e dört A kaydı: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
2. DNS'e `www` için CNAME: `noirpixelgames.github.io`
3. GitHub → Settings → Pages → **Enforce HTTPS** (sertifika birkaç dakika sürebilir)

Eski `noirpixelgames.github.io/...` adresleri otomatik olarak yeni alan adına
301 ile yönlenir; Play Console'daki gizlilik politikası linkleri kırılmaz.

## Dil

Sayfalar Türkçe yazılır. İngilizcesi her sayfanın sonundaki `window.NPG_EN`
sözlüğünde durur — anahtar, HTML'deki `data-i18n` değeriyle aynı.
Yeni bir metin eklerken `data-i18n="benzersiz.anahtar"` ver ve sözlüğe karşılığını yaz.
Sözlükte olmayan anahtar İngilizce'ye geçerken Türkçe kalır, sayfa bozulmaz.

## Yerelde çalıştırmak

Herhangi bir statik sunucu yeter:

```bash
npx serve .
```

## Yapılacaklar

- [ ] 6. oyunun adı ve tanıtımı (şu an "duyurulmadı" kartı)
- [ ] Pixel FM ve Pixel Kradot TD için açıklama + görsel
- [ ] Sosyal medya adresleri (`index.html` içinde yorum satırında hazır bekliyor)
- [ ] Play geliştirici sayfası linki (şu an arama linki kullanılıyor)
- [ ] Eksik görseller: `pdp_feature_1024x500.png`, `pdp_shot_1..3.jpg`, `php_feature_1024x500.png`
