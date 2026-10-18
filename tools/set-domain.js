#!/usr/bin/env node
/**
 * Siteyi yeni bir alan adina tasir.
 *
 *   node tools/set-domain.js noirpixelgames.com
 *   node tools/set-domain.js noirpixelgames.github.io      (geri almak icin)
 *
 * Yaptiklari:
 *   1. Tum .html / .xml / .txt dosyalarindaki eski alan adini yenisiyle degistirir
 *      (canonical, og:url, og:image, JSON-LD, sitemap, robots).
 *   2. Kok dizine CNAME dosyasi yazar  -> GitHub Pages ozel alan adi icin sart.
 *      Alan adi *.github.io ise CNAME dosyasini siler.
 *
 * Sonrasinda yapilacaklar (elle):
 *   - DNS'te A kayitlari: 185.199.108.153 / 109.153 / 110.153 / 111.153
 *   - DNS'te www icin CNAME: noirpixelgames.github.io
 *   - GitHub > Settings > Pages > Enforce HTTPS isaretle (sertifika birkac dakika surebilir)
 */
'use strict';
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const target = (process.argv[2] || '').trim().replace(/^https?:\/\//, '').replace(/\/+$/, '');

if (!target || !/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(target)) {
  console.error('Kullanim: node tools/set-domain.js <alanadi>\nOrnek:   node tools/set-domain.js noirpixelgames.com');
  process.exit(1);
}

const SKIP = new Set(['.git', 'node_modules', 'tools', 'assets']);
const EXT = new Set(['.html', '.xml', '.txt']);
const DOMAIN_RE = /https:\/\/[a-z0-9-]+(?:\.[a-z0-9-]+)*\.(?:github\.io|com|net|org|io|dev|games)(?=\/)/gi;

// yalnizca kendi alan adlarimizi degistir; play.google.com gibi dis linklere dokunma
const OURS = /^https:\/\/(?:[a-z0-9-]+\.)*(?:noirpixelgames|noirpixel)[a-z0-9-]*\.(?:github\.io|com|net|org|io|dev|games)$/i;

let files = 0, hits = 0;

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) { walk(full); continue; }
    if (!EXT.has(path.extname(entry.name).toLowerCase())) continue;

    const before = fs.readFileSync(full, 'utf8');
    let n = 0;
    const after = before.replace(DOMAIN_RE, (m) => {
      if (!OURS.test(m)) return m;
      n++;
      return 'https://' + target;
    });
    if (n > 0) {
      fs.writeFileSync(full, after);
      files++; hits += n;
      console.log('  ' + path.relative(root, full).replace(/\\/g, '/') + '  (' + n + ')');
    }
  }
}

console.log('Alan adi -> ' + target);
walk(root);

const cname = path.join(root, 'CNAME');
if (/\.github\.io$/i.test(target)) {
  if (fs.existsSync(cname)) { fs.unlinkSync(cname); console.log('CNAME silindi (github.io varsayilanina donuldu)'); }
} else {
  fs.writeFileSync(cname, target + '\n');
  console.log('CNAME yazildi: ' + target);
}

console.log('Bitti: ' + files + ' dosya, ' + hits + ' adres guncellendi.');
