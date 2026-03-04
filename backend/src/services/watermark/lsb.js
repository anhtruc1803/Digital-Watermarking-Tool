import { PNG } from 'pngjs';

function msgToBits(message) {
  const bytes = Buffer.from(message, 'utf8');
  const len = bytes.length;
  const out = [];
  for (let i = 31; i >= 0; i--) out.push((len >> i) & 1);
  for (const b of bytes) for (let i = 7; i >= 0; i--) out.push((b >> i) & 1);
  return out;
}

function bitsToMsg(bits) {
  let len = 0;
  for (let i = 0; i < 32; i++) len = (len << 1) | bits[i];
  const bytes = Buffer.alloc(len);
  let offset = 32;
  for (let bi = 0; bi < len; bi++) {
    let b = 0;
    for (let i = 0; i < 8; i++) b = (b << 1) | bits[offset++];
    bytes[bi] = b;
  }
  return bytes.toString('utf8');
}

export async function embedLSB(imageBuffer, message) {
  const png = PNG.sync.read(imageBuffer);
  const bits = msgToBits(message);
  const capacity = png.width * png.height;
  if (bits.length > capacity) throw new Error('Message too long for this image');

  for (let i = 0; i < bits.length; i++) {
    const idx = i * 4; // R channel
    png.data[idx] = (png.data[idx] & 0xfe) | bits[i];
  }
  return PNG.sync.write(png);
}

export async function extractLSB(imageBuffer) {
  const png = PNG.sync.read(imageBuffer);
  const bits = [];
  const capacity = png.width * png.height;
  for (let i = 0; i < capacity; i++) bits.push(png.data[i * 4] & 1);
  return bitsToMsg(bits);
}
