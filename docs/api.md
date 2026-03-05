# API

## Health
- `GET /api/health`

## Watermark
- `POST /api/watermark/embed`
  - form-data: `image` (file), `message` (string), `algo` (optional: `lsb_v2|dct_v1`)
- `POST /api/watermark/extract`
  - form-data: `image` (file), `algo` (optional: `lsb_v2|dct_v1`)

`lsb_v2` là mặc định (Phase 1 đã triển khai).
`dct_v1` là placeholder cho Phase 2 (chưa implement).
