# React Native & Node.js Project
◦ Description: This project aims to develop an intelligent system for monitoring and controlling energy
consumption in households. By leveraging technologies such as IoT and artificial intelligence, the system
enables real-time tracking of electricity usage across various devices, provides detailed analytics and reports
to identify inefficient appliances, and supports automated scheduling to optimize energy use. It is designed
to integrate renewable energy sources like solar power, ensuring a balance between demand and supply. The
system emphasizes safety, performance, scalability, and user-friendliness, contributing to energy conservation
and promoting a greener, more sustainable living environment.
My primary responsibility in this project is coding the core logic functionality base on the given algorithm.
◦ Language: JavaScript,
◦ Technologies Used: MVC, HTML, CSS, ReactNative, NodeJs, MySQL, Aiven,  Android Studio...

## 📌 Công nghệ sử dụng
- **React Native**
- **TypeScript**
- **JavaScript**
- **Node.js** (Backend)
- **MySQL** (Database)

## ⚙️ Môi trường chạy dự án
- **Node.js v20.14.0**  
  [Tải xuống tại đây](https://nodejs.org/download/release/v20.14.0/)

## 🚀 Cách cài đặt và chạy dự án (Chế độ Development)

### 1️⃣ Clone repository từ GitHub:
```sh
  git clone <repository-url>
```

### 2️⃣ Di chuyển vào thư mục `frontend` và cài đặt thư viện:
```sh
  cd frontend
  npm install
```

### 3️⃣ Di chuyển vào thư mục `backend` và cài đặt thư viện:
```sh
  cd ../backend
  npm install
```

### 4️⃣ Cấu hình môi trường (`backend/.env` và `frontend/.env`):
Tạo file `.env` trong thư mục `backend` và thêm thông tin cấu hình MySQL:
```
PORT=5000
DB_HOST=<your-mysql-host>
DB_PORT=<your-mysql-port>
DB_USER=<your-mysql-user>
DB_PASSWORD=<your-mysql-password>
DB_NAME=<your-database-name>
```

Tạo file `.env` trong thư mục `frontend` và thêm thông tin cấu hình IP kết nối (bên dưới mã QR):
```
EXPO_PUBLIC_LOCALHOST=<your-ip>
```

### 5️⃣ Chạy Backend:
```sh
  npm start
```

### 6️⃣ Khởi chạy Frontend:
```sh
  cd ../frontend
  npm start
```

### 7️⃣ Chạy ứng dụng trên thiết bị:
- **Sử dụng Expo**: Quét mã QR bằng ứng dụng Expo trên điện thoại.
- **Chạy trên máy ảo**: Nhấn `a` để chạy trên **Android Emulator** hoặc `i` để chạy trên **iOS Simulator** (chỉ dành cho macOS).

## 🧑‍💻 Fake User để đăng nhập
Dưới đây là tài khoản giả lập để thử nghiệm đăng nhập:
```
Email: binh
Mật khẩu: 123
```

## 📂 Cấu trúc thư mục
```
project-root/
│-- frontend/              # Giao diện React Native
│   │-- src/               # Mã nguồn chính
│   │-- assets/            # Hình ảnh, icon, fonts
│   │-- package.json       # Cấu hình dự án
│   │-- app.json           # Cấu hình Expo
│-- backend/               # Backend Node.js
│   │-- src/               # Mã nguồn API
│   │-- config/            # Cấu hình kết nối DB
│   │-- routes/            # Routes API
│   │-- models/            # Định nghĩa model database
│   │-- package.json       # Cấu hình backend
│   │-- .env               # File cấu hình môi trường
```

## 💡 Lưu ý
- Đảm bảo cài đặt **Node.js** đúng phiên bản.
- Máy ảo Android cần được mở trước khi chạy lệnh `npm start`.
- Nếu gặp lỗi, thử chạy lại `npm install` hoặc xóa `node_modules` và cài đặt lại:
```sh
  rm -rf node_modules && npm install
```
