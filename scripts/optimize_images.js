const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function optimizeImage(relPath, maxWidth, maxHeight, quality = 80) {
  const fullPath = path.join(__dirname, '..', 'public', relPath);
  if (!fs.existsSync(fullPath)) {
    console.log(`Skipping non-existent: ${relPath}`);
    return;
  }

  const inputBuffer = fs.readFileSync(fullPath);
  const origSizeKb = Math.round(inputBuffer.length / 1024);

  let pipeline = sharp(inputBuffer);
  if (maxWidth || maxHeight) {
    pipeline = pipeline.resize({
      width: maxWidth,
      height: maxHeight,
      fit: 'inside',
      withoutEnlargement: true
    });
  }

  const outputBuffer = await pipeline
    .webp({ quality, effort: 6, smartSubsample: true })
    .toBuffer();

  const newSizeKb = Math.round(outputBuffer.length / 1024);

  if (outputBuffer.length < inputBuffer.length) {
    fs.writeFileSync(fullPath, outputBuffer);
    console.log(`[OPTIMIZED] ${relPath}: ${origSizeKb} KB -> ${newSizeKb} KB (-${Math.round((1 - outputBuffer.length/inputBuffer.length)*100)}%)`);
  } else {
    console.log(`[KEPT ORIG] ${relPath}: already optimal (${origSizeKb} KB)`);
  }
}

async function run() {
  console.log('--- OPTIMIZING HERO & CORE IMAGES ---');
  // Clean up any stray tmp files
  const tmpFile = path.join(__dirname, '..', 'public', 'hero', 'summit_apex_5642_mobile.webp.tmp.webp');
  if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);

  // Mobile hero LCP image
  await optimizeImage('hero/summit_apex_5642_mobile.webp', 1080, null, 80);
  
  // Desktop hero LCP image
  await optimizeImage('hero/summit_apex_5642.webp', 1920, 1080, 80);

  // Other carousel stages
  await optimizeImage('hero/stage_2026_plateau.webp', 1920, 1080, 80);
  await optimizeImage('hero/stage_2026_plateau_mobile.webp', 1080, null, 80);
  await optimizeImage('hero/stage_2026_saddle.webp', 1920, 1080, 80);
  await optimizeImage('hero/stage_2026_saddle_mobile.webp', 1080, null, 80);
  await optimizeImage('layers/dombai_alpine.webp', 1920, 1080, 80);
  await optimizeImage('layers/dombai_alpine_mobile.webp', 1080, null, 80);
  await optimizeImage('tours/barrels_garabashi.webp', 1200, 800, 80);
}

run().catch(console.error);
