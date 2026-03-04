import { embedLSB, extractLSB } from './lsb.js';

export async function embedWatermark(imageBuffer, message) {
  return embedLSB(imageBuffer, message);
}

export async function extractWatermark(imageBuffer) {
  return extractLSB(imageBuffer);
}
