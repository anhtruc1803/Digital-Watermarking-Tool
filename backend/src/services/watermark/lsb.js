import { PNG } from 'pngjs';
import { HEADER_BYTES, PAYLOAD_MAGIC_BITS, bitsToPacket, buildPacket, packetToBits, parsePacket } from './payload.js';

function readRowBits(png, y) {
  const bits = new Array(png.width);
  for (let x = 0; x < png.width; x++) {
    const idx = (y * png.width + x) * 4;
    bits[x] = png.data[idx] & 1;
  }
  return bits;
}

function writeBitsAt(png, y, xStart, bits) {
  for (let i = 0; i < bits.length; i++) {
    const x = xStart + i;
    const idx = (y * png.width + x) * 4;
    png.data[idx] = (png.data[idx] & 0xfe) | bits[i];
  }
}

function fitCopyLayout(width, height, packetBitsLen) {
  const yStep = 1;

  if (packetBitsLen > width) return { copies: 0, starts: [] };

  const maxStart = width - packetBitsLen;
  const candidateOffsets = [
    0,
    Math.floor(maxStart * 0.25),
    Math.floor(maxStart * 0.5),
    Math.floor(maxStart * 0.75),
    maxStart
  ];
  const offsets = [...new Set(candidateOffsets)].filter((x) => x >= 0 && x <= maxStart);

  const starts = [];
  for (let y = 0; y < height; y += yStep) {
    const x = offsets[y % offsets.length];
    starts.push({ x, y });
  }

  return { copies: starts.length, starts };
}

function startsWithAt(bits, offset, pattern) {
  if (offset + pattern.length > bits.length) return false;
  for (let i = 0; i < pattern.length; i++) {
    if (bits[offset + i] !== pattern[i]) return false;
  }
  return true;
}

function extractFromRow(rowBits) {
  const found = [];

  for (let x = 0; x <= rowBits.length - PAYLOAD_MAGIC_BITS.length; x++) {
    if (!startsWithAt(rowBits, x, PAYLOAD_MAGIC_BITS)) continue;

    // Need header first to read payload length
    if (x + HEADER_BYTES * 8 > rowBits.length) continue;
    const headerBits = rowBits.slice(x, x + HEADER_BYTES * 8);
    const headerPacket = bitsToPacket(headerBits, HEADER_BYTES);

    const len = ((headerPacket[4] << 8) | headerPacket[5]) >>> 0;
    const totalBytes = HEADER_BYTES + len;
    const totalBits = totalBytes * 8;

    if (len < 1 || len > 1024 || x + totalBits > rowBits.length) continue;

    try {
      const allBits = rowBits.slice(x, x + totalBits);
      const packet = bitsToPacket(allBits, totalBytes);
      const { message } = parsePacket(packet);
      found.push(message);
      x += totalBits - 1;
    } catch {
      // ignore false positives
    }
  }

  return found;
}

export async function embedLSB(imageBuffer, message) {
  const png = PNG.sync.read(imageBuffer);
  const packet = buildPacket(message);
  const bits = packetToBits(packet);

  const { copies, starts } = fitCopyLayout(png.width, png.height, bits.length);
  if (!copies) throw new Error('Message too long for this image');

  for (const { x, y } of starts) {
    writeBitsAt(png, y, x, bits);
  }

  return PNG.sync.write(png);
}

export async function extractLSB(imageBuffer) {
  const png = PNG.sync.read(imageBuffer);
  const counter = new Map();

  for (let y = 0; y < png.height; y++) {
    const rowBits = readRowBits(png, y);
    const found = extractFromRow(rowBits);
    for (const msg of found) counter.set(msg, (counter.get(msg) || 0) + 1);
  }

  if (!counter.size) throw new Error('No valid watermark found');

  const [bestMessage] = [...counter.entries()].sort((a, b) => b[1] - a[1])[0];
  return bestMessage;
}
