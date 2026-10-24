import https from 'https';
import fs from 'fs';
import path from 'path';

const FB_URL = 'https://www.facebook.com/p/Braciami-Ancora-Spaccio-carnisalumi-e-formaggi-100063911893005/?locale=it_IT';

function fetchWithRedirect(url, ua, maxRedirects = 5) {
  return new Promise((resolve) => {
    const req = https.get(
      url,
      {
        headers: {
          'User-Agent': ua,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
          'Accept-Language': 'it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'none'
        }
      },
      (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location && maxRedirects > 0) {
          const nextUrl = res.headers.location.startsWith('http')
            ? res.headers.location
            : new URL(res.headers.location, url).toString();
          resolve(fetchWithRedirect(nextUrl, ua, maxRedirects - 1));
          return;
        }
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => resolve({ status: res.statusCode, url, body }));
      }
    );
    req.on('error', (err) => resolve({ error: err.message, body: '' }));
  });
}

(async () => {
  const uas = [
    'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
    'Mozilla/5.0 (compatible; Discordbot/2.0; +https://discordapp.com)',
    'Twitterbot/1.0',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
  ];

  for (const ua of uas) {
    const res = await fetchWithRedirect(FB_URL, ua);
    console.log('=== UA:', ua.slice(0, 35), 'Status:', res.status, 'Length:', res.body?.length || 0);
    if (res.body) {
      const decodeEntities = (str) =>
        str
          .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
          .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))
          .replace(/&amp;/g, '&')
          .replace(/&quot;/g, '"');

      const metas = [...res.body.matchAll(/<meta[^>]+(?:property|name)="([^"]+)"[^>]+content="([^"]+)"/gi)];
      for (const m of metas) {
        if (m[1].includes('og:') || m[1].includes('twitter:') || m[1].includes('description')) {
          console.log('  META', m[1], ':', decodeEntities(m[2]).slice(0, 180));
        }
      }

      const unescaped = res.body.replace(/\\\//g, '/').replace(/\\u0025/g, '%').replace(/\\u0026/g, '&').replace(/&amp;/g, '&');
      const imgUrls = [...new Set(unescaped.match(/https:\/\/scontent[^\s"'<>\\]+/g) || [])];
      console.log('  Found scontent URLs:', imgUrls.length);
      imgUrls.slice(0, 15).forEach((u, i) => console.log(`   [${i}] ${u.slice(0, 140)}`));

      const textMatches = [...unescaped.matchAll(/"text":"([^"]{15,500})"/g)].map((m) => m[1]);
      if (textMatches.length > 0) {
        console.log('  Found JSON text nodes:', textMatches.length);
        textMatches.slice(0, 10).forEach((t, i) => console.log(`   Text[${i}]:`, t));
      }
    }
  }
})();
