# Anti-crop Watermark Roadmap (2 phases)

## Phase 1 (implemented)

### Goals
- Improve resilience over naive single-copy LSB.
- Keep implementation simple and fast for demo UI.

### Implementation
- Structured payload: `MAGIC(4) + LEN(2) + CRC32(4) + MESSAGE`.
- Embed repeated copies across rows.
- Extract by scanning row bitstreams for MAGIC, verifying LEN + CRC.
- Majority vote across valid payload copies.

### Expected behavior
- Better survival under partial crop and light edits than old single-run LSB.
- Not fully robust against heavy crop, rotate, aggressive JPEG compression.

## Phase 2 (next)

### Goals
- Robustness against crop/resize/recompression attacks.

### Plan
1. Implement DCT watermark (8x8 blocks, mid-frequency embedding).
2. Add ECC (Reed-Solomon/BCH) on payload bits.
3. Spread-spectrum style redundancy by block groups.
4. Add attack benchmark script:
   - crop 10/20/30%
   - resize 50/75%
   - jpeg quality 90/70/50
   - rotate ±2° (optional)
5. Compare recovery rate + PSNR/SSIM.

### API strategy
- Keep API stable with optional algorithm flag:
  - `algo=lsb_v2` (default now)
  - `algo=dct_v1` (phase 2)

## Notes
- For legal-grade provenance, combine invisible watermark + backend signature/fingerprint records.
