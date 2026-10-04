// Generates a simple 32x32 favicon.ico (conifer background, terracotta triangle "mountain")
// with no external dependencies, written directly in the raw ICO/BMP format.
const fs = require('fs');
const path = require('path');

const SIZE = 32;
const conifer = [0x1e, 0x39, 0x2a]; // R,G,B
const terracotta = [0xc8, 0x5a, 0x32];

function pixelColor(x, y) {
  // Simple mountain silhouette: terracotta triangle peak on conifer background
  const cx = SIZE / 2;
  const baseY = SIZE * 0.78;
  const peakY = SIZE * 0.22;
  const halfWidthAtY = (y) => {
    const t = Math.max(0, Math.min(1, (y - peakY) / (baseY - peakY)));
    return t * (SIZE * 0.42);
  };
  if (y >= peakY && y <= baseY) {
    const hw = halfWidthAtY(y);
    if (Math.abs(x - cx) <= hw) return terracotta;
  }
  return conifer;
}

const rowSize = SIZE * 4;
const pixelArraySize = rowSize * SIZE;
const andMaskRowSize = Math.ceil(SIZE / 32) * 4;
const andMaskSize = andMaskRowSize * SIZE;

const dibHeaderSize = 40;
const imageDataSize = dibHeaderSize + pixelArraySize + andMaskSize;
const icoHeaderSize = 6;
const dirEntrySize = 16;
const fileSize = icoHeaderSize + dirEntrySize + imageDataSize;

const buf = Buffer.alloc(fileSize);
let o = 0;

// ICONDIR
buf.writeUInt16LE(0, o); o += 2; // reserved
buf.writeUInt16LE(1, o); o += 2; // type: icon
buf.writeUInt16LE(1, o); o += 2; // count

// ICONDIRENTRY
buf.writeUInt8(SIZE, o); o += 1; // width
buf.writeUInt8(SIZE, o); o += 1; // height
buf.writeUInt8(0, o); o += 1; // color count
buf.writeUInt8(0, o); o += 1; // reserved
buf.writeUInt16LE(1, o); o += 2; // color planes
buf.writeUInt16LE(32, o); o += 2; // bits per pixel
buf.writeUInt32LE(imageDataSize, o); o += 4; // size of image data
buf.writeUInt32LE(icoHeaderSize + dirEntrySize, o); o += 4; // offset

// BITMAPINFOHEADER
buf.writeUInt32LE(dibHeaderSize, o); o += 4;
buf.writeInt32LE(SIZE, o); o += 4; // width
buf.writeInt32LE(SIZE * 2, o); o += 4; // height (double, includes AND mask)
buf.writeUInt16LE(1, o); o += 2; // planes
buf.writeUInt16LE(32, o); o += 2; // bpp
buf.writeUInt32LE(0, o); o += 4; // compression
buf.writeUInt32LE(pixelArraySize, o); o += 4; // image size
buf.writeInt32LE(0, o); o += 4; // x ppm
buf.writeInt32LE(0, o); o += 4; // y ppm
buf.writeUInt32LE(0, o); o += 4; // colors used
buf.writeUInt32LE(0, o); o += 4; // important colors

// Pixel data, bottom-up, BGRA
for (let y = SIZE - 1; y >= 0; y--) {
  for (let x = 0; x < SIZE; x++) {
    const [r, g, b] = pixelColor(x, y);
    buf.writeUInt8(b, o); o += 1;
    buf.writeUInt8(g, o); o += 1;
    buf.writeUInt8(r, o); o += 1;
    buf.writeUInt8(255, o); o += 1;
  }
}

// AND mask (all zero = fully opaque)
o += andMaskSize;

fs.writeFileSync(path.join(__dirname, '..', 'public', 'favicon.ico'), buf);
console.log('favicon.ico generated:', fileSize, 'bytes');
