# Architecture

- Frontend: upload ảnh + nhập payload + gọi API embed/extract.
- Backend: nhận file, chạy watermark service theo thuật toán cấu hình (`lsb` mặc định).
- Services: thiết kế strategy để nâng cấp LSB -> DCT/DWT.
- Storage/Auth/DB: để placeholder, mở rộng sau.
