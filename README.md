# Digital Watermarking Tool

Công cụ nhúng và trích xuất watermark ẩn trong ảnh, theo mô hình **Frontend (Web UI)** + **Backend API**.

Mục tiêu của project:
- Demo luồng watermark end-to-end chạy được ngay.
- Thiết kế kiến trúc dễ mở rộng thuật toán (LSB → DCT/DWT).
- Sẵn sàng nâng cấp thêm auth, DB, storage, CI/CD.

---

## ✨ Tính năng hiện tại

- Nhúng watermark vào ảnh PNG qua API.
- Trích xuất watermark từ ảnh đã nhúng.
- Web UI để test trực tiếp cho người dùng cuối.
- Xử lý lỗi rõ ràng (ảnh quá nhỏ, không có watermark hợp lệ, thiếu input).
- Chạy theo **same-origin** để tránh lỗi `Failed to fetch` khi deploy.

---

## 🧱 Kiến trúc project

```text
Digital-Watermarking-Tool/
├─ docs/
├─ frontend/
├─ backend/
├─ scripts/
└─ .github/workflows/
```

### `frontend/`
- `index.html`: giao diện demo embed/extract.
- `src/ui.js`: xử lý tương tác UI + gọi API.
- `src/watermark/*`: placeholder cho client-side demo/nâng cấp sau.

### `backend/`
- `src/server.js`: Express server + serve static frontend.
- `src/routes/watermark.js`: API embed/extract.
- `src/services/watermark/lsb.js`: thuật toán LSB hiện tại.
- `src/services/watermark/dct.js`: placeholder nâng cấp DCT.
- `src/middlewares/*`: upload + error handler.

Tài liệu chi tiết thêm ở `docs/`.

---

## ⚙️ Yêu cầu môi trường

- Node.js >= 20
- npm >= 10

---

## 🚀 Chạy local (khuyến nghị)

### 1) Cài dependencies

```bash
cd backend
npm install
```

### 2) Chạy backend (đồng thời serve luôn frontend)

```bash
npm run dev
```

Sau khi chạy thành công:
- UI: `http://localhost:3000/`
- Health: `http://localhost:3000/api/health`

> Ghi chú: frontend được serve trực tiếp từ backend để tránh lệch origin/port.

---

## 🧪 API cơ bản

### Health

**GET** `/api/health`

Response:
```json
{ "ok": true }
```

### Embed watermark

**POST** `/api/watermark/embed`

Form-data:
- `image`: file ảnh (khuyến nghị PNG)
- `message`: chuỗi watermark

Success:
- Content-Type: `image/png`
- Body: ảnh đã nhúng watermark

### Extract watermark

**POST** `/api/watermark/extract`

Form-data:
- `image`: file ảnh đã nhúng

Success:
```json
{ "message": "..." }
```

Error (ví dụ):
```json
{ "error": "No valid watermark found" }
```

---

## 📌 Lưu ý kỹ thuật

- Thuật toán hiện tại dùng **LSB trên kênh Red**.
- Ảnh quá nhỏ có thể không đủ capacity để nhúng message dài.
- PNG ổn định hơn JPEG cho demo LSB vì JPEG nén làm biến đổi bit.

---

## 🗺️ Roadmap đề xuất

- [ ] Thêm CRC/ECC cho payload chống lỗi bit.
- [ ] Thêm ký số payload để xác thực bản quyền.
- [ ] Triển khai DCT/DWT cho độ bền watermark cao hơn.
- [ ] Thêm auth + user management.
- [ ] Thêm storage abstraction (local/S3).
- [ ] Viết integration tests cho embed/extract.

---

## 🤝 Đóng góp

1. Tạo branch mới.
2. Commit theo nhóm thay đổi nhỏ, rõ ràng.
3. Mở Pull Request kèm mô tả + cách test.

---

## 📄 License

Tạm thời: nội bộ dự án.
(Có thể cập nhật MIT/Apache-2.0 khi public chính thức.)
