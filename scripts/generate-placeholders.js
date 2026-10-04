// Generates simple branded SVG placeholder images for tours/guides that don't
// yet have real photography, so the site never shows broken <img> tags.
const fs = require('fs');
const path = require('path');

const outDirTours = path.join(__dirname, '..', 'public', 'static', 'optimized');
const outDirImages = path.join(__dirname, '..', 'public', 'static', 'images');
fs.mkdirSync(outDirTours, { recursive: true });
fs.mkdirSync(outDirImages, { recursive: true });

function tourSvg(title) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#E9C9B5"/>
      <stop offset="100%" stop-color="#C85A32"/>
    </linearGradient>
  </defs>
  <rect width="800" height="500" fill="url(#g)"/>
  <polygon points="0,340 140,150 260,300 380,100 520,320 650,180 800,260 800,500 0,500" fill="#1E392A"/>
  <polygon points="380,100 415,165 345,165" fill="#F3EFEA" opacity="0.9"/>
  <text x="40" y="450" font-family="Arial, sans-serif" font-size="30" font-weight="800" fill="#FAF8F5">${title}</text>
</svg>`;
}

function guideSvg(initials) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="240" height="240">
  <rect width="240" height="240" rx="20" fill="#1E392A"/>
  <circle cx="120" cy="95" r="45" fill="#C85A32"/>
  <path d="M40 210c0-44 36-70 80-70s80 26 80 70" fill="#C85A32"/>
  <text x="120" y="235" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="#F3EFEA">${initials}</text>
</svg>`;
}

const tours = [
  ['elbrus-south', 'Эльбрус (юг)'],
  ['bezengi-wall', 'Безенгийская стена'],
  ['dzhily-su', 'Джилы-Су'],
  ['bermamyt', 'Плато Бермамыт'],
  ['chegem', 'Чегемские водопады'],
  ['elbrus-ski', 'Ски-тур Эльбрус'],
  ['dzhikaugenkez', 'Перевал Джикаугенкёз'],
];

for (const [slug, title] of tours) {
  fs.writeFileSync(path.join(outDirTours, `${slug}.svg`), tourSvg(title));
}

const guides = [
  ['guide-artur', 'А.Б.'],
  ['guide-zaur', 'З.Х.'],
  ['guide-madina', 'М.Т.'],
];

for (const [slug, initials] of guides) {
  fs.writeFileSync(path.join(outDirImages, `${slug}.svg`), guideSvg(initials));
}

console.log('Generated', tours.length, 'tour placeholders and', guides.length, 'guide placeholders.');
