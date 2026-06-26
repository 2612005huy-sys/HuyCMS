# 🛒 HuyCMS E-Commerce System

![HuyCMS Banner](https://img.shields.io/badge/HuyCMS-E--Commerce%20Platform-2563eb?style=for-the-badge)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![ASP.NET Core](https://img.shields.io/badge/ASP.NET_Core-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)
![SQL Server](https://img.shields.io/badge/SQL_Server-CC2927?style=for-the-badge&logo=microsoft-sql-server&logoColor=white)

HuyCMS là một hệ thống thương mại điện tử (E-Commerce) và quản trị nội dung (CMS) toàn diện, được phát triển với giao diện người dùng hiện đại và hệ thống backend mạnh mẽ.

👤 **Tác giả:** Triệu Quốc Huy

---

## ✨ Tính năng nổi bật

### 🛍️ Frontend (Giao diện khách hàng)
- **Thiết kế hiện đại:** Sử dụng phong cách thiết kế Glassmorphism, Gradient Text, Animations mượt mà và hoàn toàn tương thích với thiết bị di động (Responsive).
- **Trải nghiệm mua sắm:** Danh mục sản phẩm, xem chi tiết sản phẩm, giỏ hàng, và đặt hàng nhanh chóng.
- **Tùy chọn cấu hình (Variants):** Hỗ trợ chọn Màu sắc và Dung lượng bộ nhớ cho sản phẩm (ví dụ: Điện thoại, Laptop) với giá và số lượng tồn kho tự động thay đổi.
- **Blog & Tin tức:** Hiển thị bài viết, tin tức công nghệ mới nhất.

### ⚙️ Backend (Hệ thống quản trị)
- **Admin Dashboard:** Bảng điều khiển quản lý toàn diện được xây dựng bằng ASP.NET Core MVC.
- **Quản lý sản phẩm & Biến thể:** Quản lý kho hàng thông minh, hỗ trợ đa biến thể (Màu sắc, Dung lượng).
- **Quản lý đơn hàng:** Theo dõi, xử lý trạng thái đơn hàng.
- **Hệ thống gửi Email Tự động:** Tích hợp SMTP Gmail tự động gửi Email xác nhận chuyên nghiệp dạng HTML cho Khách hàng và Email báo cáo cho Chủ shop ngay khi có đơn hàng mới.
- **RESTful API:** Cung cấp dữ liệu định dạng JSON cho ứng dụng React frontend.

---

## 🛠️ Công nghệ sử dụng

**Frontend (`/CMS.Frontend`)**
- [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- React Router DOM
- CSS3 (Vanilla CSS, Glassmorphism UI)
- Lucide React (Icons)
- Axios (Giao tiếp API)

**Backend (`/CMS.Backend` & `/CMS.Data`)**
- ASP.NET Core 8.0 (MVC & Web API)
- Entity Framework Core
- Microsoft SQL Server
- System.Net.Mail (SMTP Email Service)

---

## 🚀 Hướng dẫn cài đặt & Chạy dự án (Local)

### 1. Cấu hình Backend (C# .NET)
1. Mở thư mục dự án bằng Visual Studio hoặc VS Code.
2. Mở file `CMS.Backend/appsettings.json`.
3. Cập nhật chuỗi kết nối Database `DefaultConnection` cho phù hợp với máy của bạn.
4. Cập nhật cấu hình `EmailSettings` (Tùy chọn, để dùng tính năng gửi mail khi đặt hàng):
   ```json
   "EmailSettings": {
     "SenderEmail": "your-email@gmail.com",
     "SenderName": "HuyCMS Store",
     "AppPassword": "your-app-password-16-chars"
   }
   ```
5. Mở Package Manager Console (Visual Studio) hoặc Terminal, chạy lệnh cập nhật Database:
   ```bash
   Update-Database
   # Hoặc: dotnet ef database update
   ```
6. Chạy (Run) project `CMS.Backend` (mặc định sẽ chạy trên `https://localhost:7005`).

### 2. Cấu hình Frontend (React)
1. Mở Terminal mới, di chuyển vào thư mục Frontend:
   ```bash
   cd CMS.Frontend
   ```
2. Cài đặt các gói phụ thuộc (Dependencies):
   ```bash
   npm install
   ```
3. Khởi động server phát triển:
   ```bash
   npm run dev
   ```
4. Mở trình duyệt và truy cập `http://localhost:5173` để trải nghiệm!

---

## 📸 Giao diện trực quan

- Giao diện người dùng với bóng mờ, card sản phẩm sắc nét.
- Giỏ hàng tối ưu UX/UI.
- Email thông báo HTML đẹp mắt, rõ ràng bảng giá chi tiết.

---
*Dự án được xây dựng và tối ưu liên tục nhằm mục đích học tập, nghiên cứu và ứng dụng thực tiễn.*
