# Bàu Trúc — Chạm vào di sản

Website tiếng Việt, ưu tiên mobile, giới thiệu làng gốm Bàu Trúc.

## Nội dung

- Giới thiệu nghề gốm Chăm và tư liệu tham khảo.
- Luồng workshop: chọn lịch, nhập thông tin, kiểm tra và hoàn tất bản mẫu.
- Không gian xưởng gốm 3D minh họa, xoay và thu phóng bằng chuột hoặc cảm ứng.
- Ba mô hình sản phẩm 3D: bình mộc, bình cổ cao, bát đất.
- Hai hành trình du lịch gợi ý và liên kết bản đồ.

## Chạy tại máy

Yêu cầu Python 3. Không cần cài npm hoặc build.

```sh
python3 -m http.server 4173
```

Mở http://localhost:4173/ bằng trình duyệt hỗ trợ WebGL.

## Giới hạn bản trải nghiệm

Lịch, giá và chương trình workshop là dữ liệu mẫu. Biểu mẫu không gửi dữ liệu đến máy chủ, không đặt chỗ hoặc thanh toán. Thông tin chỉ nằm trong phiên trang đang mở. Các mô hình 3D được dựng minh họa, không phải bản quét làng hoặc sản phẩm thực tế. Các tour là lịch trình tham khảo, chưa kết nối đơn vị lữ hành.

## Tư liệu và thư viện

- Nội dung và ảnh làng gốm: [Vietnam Tourism](https://vietnam.travel/node/1528). Quyền đối với ảnh thuộc nguồn gốc; cần kiểm tra quyền sử dụng trước khi khai thác thương mại.
- Three.js v0.170.0 được lưu tại `three.js`, thư viện hiển thị 3D.
- Font Be Vietnam Pro và Playfair Display tải từ Google Fonts; có font hệ thống dự phòng.

Mã giao diện: `index.html`, `style.css`, `app.js`, `scene.js`.
