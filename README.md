# Digital Watermarking Tool

Monorepo gồm frontend + backend cho công cụ nhúng/đọc watermark trong ảnh.

## Cấu trúc
- `frontend/`: demo UI chạy trên trình duyệt
- `backend/`: API embed/extract
- `docs/`: kiến trúc, API, ghi chú thuật toán

## Quick start
```bash
# Terminal 1: backend
cd backend
npm install
npm run dev

# Terminal 2: frontend
cd frontend
npx serve . -l 5173
```

Mở:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`

## Lưu ý demo
- Thuật toán hiện tại: LSB trên kênh Red của PNG.
- Ảnh quá nhỏ có thể không đủ chỗ nhúng message (sẽ báo lỗi `Message too long for this image`).
- Dùng PNG sẽ ổn định nhất cho test embed/extract.
