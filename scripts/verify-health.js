/**
 * KavKazSkiTur Pre-Flight Health & Styles Verification Script
 * Enforces engineering-culture and code-review-and-quality checklist.
 */
const http = require('http');

const ROUTES = [
  '/',
  '/expeditions',
  '/tours/elbrus-south-classic',
  '/barrels',
  '/schedule',
  '/acclimatization',
  '/safety'
];

async function checkRoute(route) {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3000' + route, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        // Collect all CSS stylesheet references
        const matches = data.match(/href="([^"]+\.css[^"]*)"/g) || [];
        const staticCss = [...new Set(data.match(/\/_next\/static\/css\/[^"'\\]+/g) || [])];
        const allUrls = [...matches.map(m => m.slice(6, -1)), ...staticCss];
        const uniqueUrls = [...new Set(allUrls)];

        if (uniqueUrls.length === 0) {
          resolve({ route, status: res.statusCode, ok: false, error: 'NO CSS STYLESHEETS FOUND IN HTML' });
          return;
        }

        let pending = uniqueUrls.length;
        const results = [];

        uniqueUrls.forEach(u => {
          const fullUrl = u.startsWith('http') ? u : 'http://localhost:3000' + u;
          http.get(fullUrl, (cssRes) => {
            let bytes = 0;
            cssRes.on('data', c => bytes += c.length);
            cssRes.on('end', () => {
              results.push({ url: u, status: cssRes.statusCode, bytes });
              pending--;
              if (pending === 0) {
                const ok = res.statusCode === 200 && results.every(c => c.status === 200 && c.bytes > 5000);
                resolve({ route, status: res.statusCode, ok, results });
              }
            });
          }).on('error', err => {
            results.push({ url: u, status: 500, error: err.message });
            pending--;
            if (pending === 0) {
              resolve({ route, status: res.statusCode, ok: false, results });
            }
          });
        });
      });
    });

    req.on('error', err => {
      resolve({ route, ok: false, error: err.message });
    });
  });
}

async function verifyAll() {
  console.log('--------------------------------------------------');
  console.log('🔍 RUNNING PRE-FLIGHT HEALTH & STYLES CHECKLIST');
  console.log('--------------------------------------------------');
  let hasFailures = false;

  for (const route of ROUTES) {
    const check = await checkRoute(route);
    if (!check.ok) {
      hasFailures = true;
      console.error(`❌ FAILED: ${route} (Status: ${check.status})`);
      if (check.error) console.error(`   Error: ${check.error}`);
      if (check.results) console.error(`   CSS Results:`, check.results);
    } else {
      const cssSummary = check.results.map(c => `[${c.status}] ${(c.bytes / 1024).toFixed(1)} KB`).join(', ');
      console.log(`✅ PASSED: ${route.padEnd(28)} [HTTP ${check.status}] CSS: ${cssSummary}`);
    }
  }

  console.log('--------------------------------------------------');
  if (hasFailures) {
    console.error('🚨 PRE-FLIGHT CHECKLIST FAILED! DO NOT SHIP TO USER.');
    process.exit(1);
  } else {
    console.log('🎉 ALL STYLES, ROUTES, AND ASSETS VERIFIED WITH 100% SUCCESS.');
    process.exit(0);
  }
}

verifyAll();
