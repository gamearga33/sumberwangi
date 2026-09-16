import sharp from 'sharp';
import fs from 'fs';

async function generateFavicons() {
  const input = 'public/images/logo.png';
  const bottleBuffer = await sharp(input)
    .extract({ left: 109, top: 0, width: 296, height: 414 })
    .toBuffer();

  async function generateSquareIcon(size, paddingRatio = 0.06) {
    const innerSize = Math.round(size * (1 - paddingRatio * 2));
    const resizedBottle = await sharp(bottleBuffer)
      .resize({
        width: innerSize,
        height: innerSize,
        fit: 'inside',
        kernel: 'lanczos3',
      })
      .toBuffer();

    return sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .composite([{ input: resizedBottle, gravity: 'center' }])
      .png()
      .toBuffer();
  }


  const [png16, png32, png48, png64, png180, png512] = await Promise.all([
    generateSquareIcon(16, 0.04),
    generateSquareIcon(32, 0.05),
    generateSquareIcon(48, 0.06),
    generateSquareIcon(64, 0.06),
    generateSquareIcon(180, 0.08),
    generateSquareIcon(512, 0.08),
  ]);

  function makeIco(buffers) {
    const count = buffers.length;
    const header = Buffer.alloc(6);
    header.writeUInt16LE(0, 0);
    header.writeUInt16LE(1, 2);
    header.writeUInt16LE(count, 4);
    const dirSize = 16 * count;
    let offset = 6 + dirSize;
    const dirs = [];
    for (const buf of buffers) {
      const dir = Buffer.alloc(16);
      dir.writeUInt8(buf.size >= 256 ? 0 : buf.size, 0);
      dir.writeUInt8(buf.size >= 256 ? 0 : buf.size, 1);
      dir.writeUInt8(0, 2);
      dir.writeUInt8(0, 3);
      dir.writeUInt16LE(1, 4);
      dir.writeUInt16LE(32, 6);
      dir.writeUInt32LE(buf.data.length, 8);
      dir.writeUInt32LE(offset, 12);
      offset += buf.data.length;
      dirs.push(dir);
    }
    return Buffer.concat([header, ...dirs, ...buffers.map((b) => b.data)]);
  }


  const icoBuffer = makeIco([
    { size: 16, data: png16 },
    { size: 32, data: png32 },
    { size: 48, data: png48 },
  ]);

  fs.writeFileSync('public/favicon.ico', icoBuffer);
  fs.writeFileSync('app/favicon.ico', icoBuffer);
  fs.writeFileSync('app/icon.png', png64);
  fs.writeFileSync('app/apple-icon.png', png180);
  fs.writeFileSync('public/icon.png', png512);
  fs.writeFileSync('public/apple-icon.png', png180);
  fs.writeFileSync('public/apple-touch-icon.png', png180);

  console.log('Favicons generated successfully.');
}

generateFavicons().catch((err) => {
  console.error('Failed to generate favicons:', err);
  process.exit(1);
});
