import { embedLSB, extractLSB } from './lsb.js';
import { embedDCT, extractDCT } from './dct.js';

export async function embedWatermark(imageBuffer, message, algo = 'lsb_v2') {
  if (algo === 'dct_v1') return embedDCT(imageBuffer, message);
  return embedLSB(imageBuffer, message);
}

export async function extractWatermark(imageBuffer, algo = 'lsb_v2') {
  if (algo === 'dct_v1') return extractDCT(imageBuffer);
  return extractLSB(imageBuffer);
}
