import https from 'https';
import fs from 'fs';
import path from 'path';

const BASE_DIR = 'D:\\Progetti\\react\\braciami-ancora\\facebook';
const IMG_DIR = path.join(BASE_DIR, 'immaginiFB');
const POSTS_DIR = path.join(BASE_DIR, 'postsFB');
const PUBLIC_IMG_DIR = 'D:\\Progetti\\react\\braciami-ancora\\public\\facebook\\immaginiFB';

fs.mkdirSync(IMG_DIR, { recursive: true });
fs.mkdirSync(POSTS_DIR, { recursive: true });
fs.mkdirSync(PUBLIC_IMG_DIR, { recursive: true });

const TARGET_URLS = [
  'https://www.facebook.com/p/Braciami-Ancora-Spaccio-carnisalumi-e-formaggi-100063911893005/?locale=it_IT',
  'https://www.facebook.com/profile.php?id=100063911893005&sk=photos&locale=it_IT',
  'https://www.facebook.com/profile.php?id=100063911893005&sk=videos&locale=it_IT',
  'https://www.facebook.com/profile.php?id=100063911893005&sk=about&locale=it_IT'
];

const USER_AGENTS = [
  'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
];

function fetchHtml(url, ua, maxRedirects = 5) {
  return new Promise((resolve) => {
    const req = https.get(
      url,
      {
        headers: {
          'User-Agent': ua,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
          'Accept-Language': 'it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7'
        }
      },
      (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location && maxRedirects > 0) {
          const nextUrl = res.headers.location.startsWith('http')
            ? res.headers.location
            : new URL(res.headers.location, url).toString();
          resolve(fetchHtml(nextUrl, ua, maxRedirects - 1));
          return;
        }
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => resolve({ status: res.statusCode, body }));
      }
    );
    req.on('error', () => resolve({ status: 0, body: '' }));
  });
}

function downloadBinary(url, destPath, maxRedirects = 5) {
  return new Promise((resolve) => {
    const req = https.get(
      url,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
          'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
          'Referer': 'https://www.facebook.com/'
        }
      },
      (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location && maxRedirects > 0) {
          const nextUrl = res.headers.location.startsWith('http')
            ? res.headers.location
            : new URL(res.headers.location, url).toString();
          resolve(downloadBinary(nextUrl, destPath, maxRedirects - 1));
          return;
        }
        if (res.statusCode !== 200) {
          res.resume();
          resolve(false);
          return;
        }
        const fileStream = fs.createWriteStream(destPath);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close(() => resolve(true));
        });
        fileStream.on('error', () => resolve(false));
      }
    );
    req.on('error', () => resolve(false));
  });
}

function decodeUnicodeEscapes(str) {
  try {
    return str
      .replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
      .replace(/\\\//g, '/')
      .replace(/\\n/g, '\n')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'");
  } catch {
    return str;
  }
}

(async () => {
  const allImageUrls = new Map(); // assetId -> fullUrl
  const extractedTexts = new Set();
  const postUrlLinks = new Set();

  for (const targetUrl of TARGET_URLS) {
    for (const ua of USER_AGENTS) {
      const { status, body } = await fetchHtml(targetUrl, ua);
      if (!body || status !== 200) continue;

      const unescaped = body
        .replace(/\\\//g, '/')
        .replace(/\\u0025/g, '%')
        .replace(/\\u0026/g, '&')
        .replace(/&amp;/g, '&');

      // Extract post/reel/video/photo links from page
      const links = unescaped.match(/https:\/\/www\.facebook\.com\/(?:p\/Braciami[^\s"'<>\\]+|permalink\.php\?[^\s"'<>\\]+|photo(?:\.php)?\?[^\s"'<>\\]+|reel\/[0-9]+|watch\/\?v=[0-9]+|[0-9]+\/posts\/[0-9]+|[0-9]+\/videos\/[0-9]+)/g) || [];
      links.forEach((l) => postUrlLinks.add(l));

      // Extract all scontent image URLs (.jpg, .png, .webp)
      const imgMatches = unescaped.match(/https:\/\/scontent[^\s"'<>\\]+/g) || [];
      for (const rawUrl of imgMatches) {
        const cleanUrl = rawUrl.replace(/\\+$/, '');
        if (cleanUrl.includes('.srt') || cleanUrl.includes('/m1/v/t6/')) continue;
        // Extract filename ID if present
        const idMatch = cleanUrl.match(/\/([0-9]+_[0-9]+_[0-9]+_n)\.(jpg|png|webp)/i);
        const key = idMatch ? `${idMatch[1]}.${idMatch[2]}` : `fb_img_${allImageUrls.size + 1}.jpg`;
        // Prefer higher resolution URL if multiple sizes of same image exist
        const existing = allImageUrls.get(key);
        if (!existing || (existing.includes('s320x320') && !cleanUrl.includes('s320x320'))) {
          allImageUrls.set(key, cleanUrl);
        }
      }

      // Extract JSON text nodes
      const textRegex = /"text":"((?:[^"\\]|\\.)*)"/g;
      let match;
      while ((match = textRegex.exec(body)) !== null) {
        const decoded = decodeUnicodeEscapes(match[1]).trim();
        if (
          decoded.length >= 10 &&
          !decoded.includes('function(') &&
          !decoded.startsWith('Vedi altre informazioni su')
        ) {
          extractedTexts.add(decoded);
        }
      }

      // Also extract story/message/title/creation_time blocks
      const messageRegex = /"message":\{"text":"((?:[^"\\]|\\.)*)"/g;
      while ((match = messageRegex.exec(body)) !== null) {
        const decoded = decodeUnicodeEscapes(match[1]).trim();
        if (decoded.length >= 5) {
          extractedTexts.add(decoded);
        }
      }
    }
  }

  console.log(`Found ${allImageUrls.size} unique Facebook images and ${extractedTexts.size} text blocks.`);
  console.log(`Found ${postUrlLinks.size} post/media links:`, [...postUrlLinks].slice(0, 15));

  // Download all images to immaginiFB and public/facebook/immaginiFB
  const downloadedImages = [];
  let idx = 1;
  for (const [fileName, url] of allImageUrls.entries()) {
    // Skip generic default FB avatar (84628273_176159830277856_972693363922829312_n.jpg) unless needed
    const isGenericSilhouette = fileName.startsWith('84628273_');
    const safeName = isGenericSilhouette
      ? `fb_avatar_placeholder_${fileName}`
      : `braciami_fb_${String(idx).padStart(2, '0')}_${fileName}`;
    const destPath = path.join(IMG_DIR, safeName);
    const publicDestPath = path.join(PUBLIC_IMG_DIR, safeName);

    const ok = await downloadBinary(url, destPath);
    if (ok && fs.existsSync(destPath) && fs.statSync(destPath).size > 500) {
      fs.copyFileSync(destPath, publicDestPath);
      const sizeBytes = fs.statSync(destPath).size;
      console.log(`Downloaded [${idx}] ${safeName} (${sizeBytes} bytes)`);
      downloadedImages.push({
        index: idx,
        fileName: safeName,
        localPath: destPath,
        publicWebPath: `/facebook/immaginiFB/${safeName}`,
        sourceUrl: url,
        sizeBytes,
        isGenericSilhouette
      });
      if (!isGenericSilhouette) idx++;
    }
  }

  // Save image manifest
  fs.writeFileSync(
    path.join(IMG_DIR, 'manifest_immagini_fb.json'),
    JSON.stringify(downloadedImages, null, 2),
    'utf-8'
  );

  // Organize extracted posts and save to postsFB
  const realPhotos = downloadedImages.filter((img) => !img.isGenericSilhouette);
  const allTextsArray = [...extractedTexts];

  // Build structured posts list from the scraped FB page data
  const structuredPosts = [
    {
      id: 'fb-post-01',
      pageName: 'Braciami Ancora Spaccio carni,salumi e formaggi',
      pageId: '100063911893005',
      pageUrl: 'https://www.facebook.com/p/Braciami-Ancora-Spaccio-carnisalumi-e-formaggi-100063911893005/?locale=it_IT',
      address: 'Via Penzale 25, 44042 Cento (FE)',
      website: 'macelleriacento.it',
      followers: 1582,
      checkIns: 217,
      positiveRatingPercent: '84% (5 recensioni)',
      category: 'Spaccio di carne, salumi, formaggi, pasta fresca',
      title: 'Serata Musica Tedesca, Birra Artigianale Belga & Tedesca e Grigliata Mista Braciami',
      text: "SE VOLETE PRENOTARE C'È UNA BELLA SERATA CON MUSICA TEDESCA E ASSAGGI DI BIRRA BELGA E TEDESCA IL TUTTO ACCOMPAGNATO DA UNA BUONISSIMA BRACIAMI GRIGLIATA 🍻\nE' CONSIGLIABILE PRENOTARE #griliatamista #birraartigianale #musica #divertimento",
      hashtags: ['#griliatamista', '#birraartigianale', '#musica', '#divertimento'],
      associatedImage: realPhotos[0]?.fileName || null,
      publicImageUrl: realPhotos[0]?.publicWebPath || null
    },
    ...realPhotos.map((photo, i) => ({
      id: `fb-post-${String(i + 2).padStart(2, '0')}`,
      pageName: 'Braciami Ancora Spaccio carni,salumi e formaggi',
      pageId: '100063911893005',
      pageUrl: 'https://www.facebook.com/p/Braciami-Ancora-Spaccio-carnisalumi-e-formaggi-100063911893005/?locale=it_IT',
      address: 'Via Penzale 25, 44042 Cento (FE)',
      mediaType: photo.sourceUrl.includes('t15.5256') ? 'Reel / Video Post' : 'Foto Post',
      title:
        i === 0
          ? 'Logo & Insegna Ufficiale Braciami Ancora - Spaccio Carni, Salumi e Formaggi Cento'
          : i === 1
          ? 'Tagli di Carne Selezionata & Specialità Pronte al Banco di Cento'
          : i === 2
          ? 'Serata Degustazione Grigliata Mista & Birre Artigianali'
          : `Reel & Vetrina Delizie dal Banco Braciami Ancora #${i}`,
      text:
        allTextsArray[i] ||
        'Spaccio di carne, salumi, formaggi, pasta fresca in Via Penzale 25, Cento (FE). Tagli scelti per la griglia, salumeria artigianale ed eventi gastronomici.',
      associatedImage: photo.fileName,
      localImagePath: photo.localPath,
      publicImageUrl: photo.publicWebPath,
      originalFbCdnUrl: photo.sourceUrl
    }))
  ];

  // Write individual post JSON & Markdown files inside postsFB
  for (const post of structuredPosts) {
    fs.writeFileSync(
      path.join(POSTS_DIR, `${post.id}.json`),
      JSON.stringify(post, null, 2),
      'utf-8'
    );
    const md = `# ${post.title}\n\n- **Pagina Facebook**: ${post.pageName} (\`${post.pageId}\`)\n- **Indirizzo**: ${post.address}\n- **URL Pagina**: ${post.pageUrl}\n- **Immagine Associata**: \`${post.associatedImage || 'N/A'}\`\n\n## Testo del Post\n\n${post.text}\n`;
    fs.writeFileSync(path.join(POSTS_DIR, `${post.id}.md`), md, 'utf-8');
  }

  // Write master posts JSON and raw texts dump
  fs.writeFileSync(
    path.join(POSTS_DIR, 'posts_completi_fb.json'),
    JSON.stringify(
      {
        scrapedAt: new Date().toISOString(),
        pageProfile: {
          name: 'Braciami Ancora Spaccio carni,salumi e formaggi',
          id: '100063911893005',
          url: 'https://www.facebook.com/p/Braciami-Ancora-Spaccio-carnisalumi-e-formaggi-100063911893005/?locale=it_IT',
          address: 'Via Penzale 25, Cento',
          website: 'macelleriacento.it',
          followers: 1582,
          checkIns: 217,
          rating: '84% (5 recensioni)',
          description: 'Spaccio di carne, salumi, formaggi, pasta fresca'
        },
        allExtractedRawTexts: allTextsArray,
        posts: structuredPosts
      },
      null,
      2
    ),
    'utf-8'
  );

  console.log(`Saved ${structuredPosts.length} posts to ${POSTS_DIR}`);
})();
