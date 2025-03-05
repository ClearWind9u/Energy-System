# React Native Project

## 📌 Công nghệ sử dụng
- **React Native**
- **TypeScript**
- **JavaScript**

## ⚙️ Môi trường chạy dự án
- **Node.js v20.14.0**  
  [Tải xuống tại đây](https://nodejs.org/download/release/v20.14.0/)

## 🚀 Cách cài đặt và chạy dự án (Chế độ Development)
### 1️⃣ Clone repository từ GitHub:
```sh
  git clone <repository-url>
```

### 2️⃣ Di chuyển vào thư mục `frontend`:
```sh
  cd frontend
```

### 3️⃣ Cài đặt các thư viện cần thiết:
```sh
  npm install
```

### 4️⃣ Khởi chạy dự án:
```sh
  npm start
```

### 5️⃣ Chạy ứng dụng trên thiết bị:
- **Sử dụng Expo**: Quét mã QR bằng ứng dụng Expo trên điện thoại.
- **Chạy trên máy ảo**: Nhấn `a` để chạy trên **Android Emulator** hoặc `i` để chạy trên **iOS Simulator** (chỉ dành cho macOS).

## 📂 Cấu trúc thư mục
```
frontend/
│-- src/                  # Mã nguồn chính
│-- assets/               # Hình ảnh, icon, fonts
│-- node_modules/         # Thư viện cài đặt
│-- package.json          # Cấu hình dự án & dependencies
│-- tsconfig.json         # Cấu hình TypeScript
│-- babel.config.js       # Cấu hình Babel
│-- app.json              # Cấu hình Expo
│-- index.js              # Entry point
```

## 💡 Lưu ý
- Đảm bảo cài đặt **Node.js** đúng phiên bản.
- Máy ảo Android cần được mở trước khi chạy lệnh `npm start`.
- Nếu gặp lỗi, thử chạy lại `npm install` hoặc xóa `node_modules` và cài đặt lại:
```sh
  rm -rf node_modules && npm install
```