# Digital Watermarking Tool

Monorepo gồm frontend + backend cho công cụ nhúng/đọc watermark trong ảnh.

## Cấu trúc
- `frontend/`: demo UI chạy trên trình duyệt
- `backend/`: API embed/extract
- `docs/`: kiến trúc, API, ghi chú thuật toán

## Quick start
```bash
# backend
cd backend && npm install && npm run dev

# frontend (terminal khác)
cd frontend && npx serve . -l 5173
```

Mở:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`
