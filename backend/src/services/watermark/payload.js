const MAGIC = Uint8Array.from([0x57, 0x4d, 0x4b, 0x31]); // "WMK1"
const MAX_MESSAGE_BYTES = 1024;

function crc32(bytes) {
  let crc = 0xffffffff;
  for (const b of bytes) {
    crc ^= b;
    for (let i = 0; i < 8; i++) {
      const mask = -(crc & 1);
      crc = (crc >>> 1) ^ (0xedb88320 & mask);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function u32ToBytes(n) {
  return Uint8Array.from([(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255]);
}

function bytesToU32(arr, offset) {
  return ((arr[offset] << 24) | (arr[offset + 1] << 16) | (arr[offset + 2] << 8) | arr[offset + 3]) >>> 0;
}

function u16ToBytes(n) {
  return Uint8Array.from([(n >>> 8) & 255, n & 255]);
}

function bytesToU16(arr, offset) {
  return ((arr[offset] << 8) | arr[offset + 1]) >>> 0;
}

export function buildPacket(message) {
  const msgBytes = new TextEncoder().encode(message);
  if (!msgBytes.length) throw new Error('Message must not be empty');
  if (msgBytes.length > MAX_MESSAGE_BYTES) throw new Error(`Message too long (max ${MAX_MESSAGE_BYTES} bytes)`);

  const lenBytes = u16ToBytes(msgBytes.length);
  const crcBytes = u32ToBytes(crc32(msgBytes));

  const packet = new Uint8Array(MAGIC.length + lenBytes.length + crcBytes.length + msgBytes.length);
  packet.set(MAGIC, 0);
  packet.set(lenBytes, 4);
  packet.set(crcBytes, 6);
  packet.set(msgBytes, 10);
  return packet;
}

export function parsePacket(packet) {
  if (packet.length < 10) throw new Error('Invalid packet');
  for (let i = 0; i < MAGIC.length; i++) {
    if (packet[i] !== MAGIC[i]) throw new Error('Invalid magic');
  }

  const len = bytesToU16(packet, 4);
  const expectedCrc = bytesToU32(packet, 6);
  if (len < 1 || len > MAX_MESSAGE_BYTES || packet.length < 10 + len) {
    throw new Error('Invalid packet length');
  }

  const msgBytes = packet.slice(10, 10 + len);
  const actualCrc = crc32(msgBytes);
  if (actualCrc !== expectedCrc) throw new Error('CRC mismatch');

  const message = new TextDecoder().decode(msgBytes);
  if (!message.trim()) throw new Error('Empty message');
  return { message, length: len };
}

export function packetToBits(packet) {
  const bits = [];
  for (const b of packet) {
    for (let i = 7; i >= 0; i--) bits.push((b >> i) & 1);
  }
  return bits;
}

export function bitsToPacket(bits, byteCount) {
  const out = new Uint8Array(byteCount);
  let bitIdx = 0;
  for (let bi = 0; bi < byteCount; bi++) {
    let b = 0;
    for (let i = 0; i < 8; i++) b = (b << 1) | bits[bitIdx++];
    out[bi] = b;
  }
  return out;
}

export const PAYLOAD_MAGIC_BITS = packetToBits(MAGIC);
export const HEADER_BYTES = 10;
