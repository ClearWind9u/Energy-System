# ⚡️ Smart Energy Monitoring System

[![Node.js](https://img.shields.io/badge/Node.js-v20.14.0-green)](https://nodejs.org/download/release/v20.14.0/)
[![React Native](https://img.shields.io/badge/React%20Native-0.74-blue)](https://reactnative.dev/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange)](https://www.mysql.com/)

## 📋 Mô tả dự án

Smart Energy Monitoring System là một giải pháp thông minh để theo dõi và quản lý tiêu thụ năng lượng trong gia đình. Sử dụng công nghệ **IoT** và **AI**, hệ thống cung cấp:

- **Theo dõi thời gian thực**: Giám sát mức tiêu thụ điện của các thiết bị.
- **Phân tích chi tiết**: Báo cáo và phân tích để xác định thiết bị tiêu tốn nhiều năng lượng.
- **Tự động hóa**: Lập lịch tối ưu hóa sử dụng năng lượng.
- **Tích hợp năng lượng tái tạo**: Hỗ trợ nguồn năng lượng như điện mặt trời.
- **An toàn và thân thiện**: Giao diện dễ dùng, hiệu suất cao, góp phần bảo vệ môi trường.

Dự án được xây dựng với **React Native** (frontend), **Node.js** (backend), và **MySQL** (database), đảm bảo khả năng mở rộng và hiệu suất ổn định.

## ✨ Tính năng chính
- 📊 Theo dõi tiêu thụ điện theo thời gian thực.
- 📈 Báo cáo chi tiết và biểu đồ trực quan.
- ⚙️ Tự động hóa lịch trình sử dụng thiết bị.
- 🌞 Tích hợp năng lượng tái tạo (điện mặt trời).
- 🔒 Giao diện an toàn, thân thiện với người dùng.

## 🛠 Công nghệ sử dụng
- **Frontend**: React Native, TypeScript, JavaScript
- **Backend**: Node.js (MVC)
- **Database**: MySQL
- **Công cụ**: Aiven, Android Studio, Expo

## 📋 Yêu cầu hệ thống
- **Node.js**: v20.14.0 ([Tải xuống](https://nodejs.org/download/release/v20.14.0/))
- **npm**: Đi kèm với Node.js
- **MySQL**: Phiên bản 8.0 trở lên
- **Expo CLI**: Để chạy ứng dụng React Native
- **Thiết bị**: Android Emulator, iOS Simulator (macOS), hoặc thiết bị thực với ứng dụng Expo Go

## 🚀 Hướng dẫn cài đặt và chạy dự án

### 1. Clone repository
```bash
git clone <repository-url>
cd project-root
```

### 2. Cài đặt thư viện cho Frontend
```bash
cd frontend
npm install
```

### 3. Cài đặt thư viện cho Backend
```bash
cd ../backend
npm install
```

### 4. Cấu hình môi trường
- **Backend** (`backend/.env`):
  ```env
  PORT=5000
  DB_HOST=<your-mysql-host>
  DB_PORT=<your-mysql-port>
  DB_USER=<your-mysql-user>
  DB_PASSWORD=<your-mysql-password>
  DB_NAME=<your-database-name>
  ```
- **Frontend** (`frontend/.env`):
  ```env
  EXPO_PUBLIC_LOCALHOST=<your-ip>
  ```

### 5. Khởi chạy Backend
```bash
cd backend
npm start
```

### 6. Khởi chạy Frontend
```bash
cd ../frontend
npm start
```

### 7. Chạy ứng dụng trên thiết bị
- **Expo**: Mở ứng dụng **Expo Go** trên điện thoại và quét mã QR hiển thị sau khi chạy `npm start`.
- **Máy ảo**:
  - Nhấn `a` để chạy trên **Android Emulator**.
  - Nhấn `i` để chạy trên **iOS Simulator** (chỉ hỗ trợ macOS).

## 🔑 Tài khoản thử nghiệm
| Email | Mật khẩu |
|-------|----------|
| phong  | 123      |

## 📂 Cấu trúc thư mục
```
project-root/
├── frontend/                 # Giao diện React Native
│   ├── src/                  # Mã nguồn chính
│   ├── assets/               # Hình ảnh, icon, font
│   ├── package.json          # Cấu hình dự án
│   ├── app.json              # Cấu hình Expo
├── backend/                  # Backend Node.js
│   ├── src/                  # Mã nguồn API
│   ├── config/               # Cấu hình kết nối DB
│   ├── routes/               # Định nghĩa API routes
│   ├── models/               # Định nghĩa model database
│   ├── package.json          # Cấu hình backend
│   ├── .env                  # File cấu hình môi trường
```
- Nhánh **COREIOT** chứa source code IoT của nhóm.

## ⚠️ Lưu ý
- Đảm bảo **Node.js v20.14.0** được cài đặt đúng.
- Mở **Android Emulator** hoặc **iOS Simulator** trước khi chạy `npm start`.
- Nếu gặp lỗi cài đặt, thử xóa `node_modules` và cài lại:
  ```bash
  rm -rf node_modules && npm install
  ```
- Kiểm tra kết nối mạng và cấu hình IP trong `frontend/.env` để đảm bảo frontend giao tiếp được với backend.

## 📞 Liên hệ
Nếu gặp vấn đề hoặc cần hỗ trợ, vui lòng liên hệ:
- **Email**: [phamthanhphong9u@gmail.com]

---

🌍 **Cùng xây dựng một tương lai xanh hơn với Smart Energy Monitoring System!**
