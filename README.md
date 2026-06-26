# 🎓 Báo Cáo Đồ Án / Bài Tập Lớn: HuyCMS E-Commerce Platform

**Thông tin sinh viên thực hiện:**
- **Họ và tên:** Triệu Quốc Huy
- **Mã số sinh viên:** 2123110151

---

## 📖 Giới thiệu dự án
**HuyCMS** là hệ thống E-Commerce (Thương mại điện tử) kết hợp quản trị nội dung (CMS) do em tự phát triển. Dự án được xây dựng với mục tiêu cung cấp một giải pháp bán hàng trực tuyến toàn diện, chia làm hai phần rõ rệt: trang giao diện cho khách mua hàng (Frontend) và hệ thống quản trị dành cho chủ shop (Backend).

## 🚀 Tổng hợp các công việc đã thực hiện

Trong quá trình phát triển dự án này, em đã trực tiếp thực hiện các hạng mục công việc sau:

### 1. Xây dựng & Tối ưu Giao diện Frontend (React)
- **Thiết kế UI/UX hiện đại:** Áp dụng phong cách **Glassmorphism**, hiệu ứng gradient và các viền bo góc tinh tế. Giao diện hoàn toàn tương thích (responsive) trên cả máy tính lẫn điện thoại di động.
- **Tối ưu hiển thị Danh mục & Sản phẩm:** Thiết kế lại các khối sản phẩm (Sản phẩm mới, Sản phẩm bán chạy) không dùng ảnh tràn lan mà dùng các tab/nút bấm linh hoạt (pill buttons) để giao diện gọn gàng hơn.
- **Trang chi tiết sản phẩm đa dạng:** Xây dựng tính năng cho phép khách hàng chọn cấu hình biến thể sản phẩm (Màu sắc, Dung lượng bộ nhớ) đi kèm với việc tự động cập nhật mức giá và số lượng tồn kho tương ứng.
- **Quản lý Giỏ hàng:** Tích hợp logic thêm/bớt/xóa sản phẩm trong giỏ hàng một cách mượt mà và trực quan.

### 2. Phát triển Hệ thống Backend (ASP.NET Core)
- **Thiết kế Cơ sở dữ liệu (SQL Server):** Xây dựng các bảng liên kết (Products, Categories, Orders, OrderDetails, Customers, Colors...) và xử lý truy vấn bằng Entity Framework Core.
- **Cung cấp RESTful APIs:** Viết các Controller (PostController, OrderController...) trả về dữ liệu chuẩn JSON để Frontend kết nối.
- **Xử lý Đặt hàng (Checkout):** 
  - Lưu thông tin khách hàng vãng lai, tạo mã đơn hàng.
  - Lưu chi tiết từng sản phẩm khách mua.
  - **Tự động trừ số lượng tồn kho** của sản phẩm chính và trừ cả tồn kho của từng biến thể (màu sắc/dung lượng cụ thể) một cách chính xác.

### 3. Tích hợp tính năng Nâng cao (Gửi Email Tự động)
- **Cấu hình SMTP Gmail:** Tích hợp hệ thống gửi mail tự động thông qua giao thức SMTP. Sử dụng file `appsettings.json` để bảo mật cấu hình (App Password).
- **Template Email HTML chuyên nghiệp:** Tự thiết kế mã HTML để hệ thống tự động sinh ra các bảng tính liệt kê chi tiết: Tên sản phẩm, Màu sắc, Dung lượng, Số lượng, Đơn giá và Tổng tiền thành một bảng đẹp mắt.
- **Luồng gửi thông báo kép:**
  - Gửi email **xác nhận đặt hàng** cho khách hàng.
  - Tự động gửi email **thông báo có đơn hàng mới** về trực tiếp cho hộp thư của Chủ Shop (Admin).

### 4. Fix bug & Tối ưu Code (Refactor)
- Khắc phục các lỗi hiển thị nội dung (như lỗi không render được nội dung bài viết ngoài trang chủ do thiếu trường `Content` ở API).
- Sửa lỗi crash (trang trắng) React khi phân tích dữ liệu JSON (fix lỗi `Rendered more hooks than during the previous render` bằng cách tổ chức lại luồng React Hooks).
- Giải quyết triệt để lỗi cú pháp escaping string (`\"`) trong file `AccountController.cs`.

---

## 💻 Ngăn xếp công nghệ (Tech Stack)
- **Frontend:** React, Vite, Axios, Lucide React (Icons), Vanilla CSS.
- **Backend:** C# ASP.NET Core 8 (MVC + API).
- **Cơ sở dữ liệu:** Microsoft SQL Server, Entity Framework Core.
- **Công cụ hỗ trợ:** Visual Studio, VS Code, Git.

---

## ⚙️ Hướng dẫn chấm bài / Chạy thử dự án (Local)

**1. Khởi chạy Backend (ASP.NET Core)**
- Mở thư mục `CMS.Backend` bằng Visual Studio.
- Cập nhật chuỗi kết nối `DefaultConnection` trong `appsettings.json`.
- Mở Package Manager Console gõ: `Update-Database`.
- Điền Email của thầy/cô (hoặc email test) vào mục `SenderEmail` và cung cấp App Password trong `appsettings.json` để test tính năng gửi mail.
- Bấm **Run** (Chạy trên `localhost:7005`).

**2. Khởi chạy Frontend (React)**
- Mở Terminal tại thư mục `CMS.Frontend`.
- Chạy lệnh `npm install`.
- Chạy lệnh `npm run dev`.
- Truy cập `http://localhost:5173` để trải nghiệm đặt hàng.

---
*Báo cáo được đúc kết từ quá trình nghiên cứu, học hỏi và hoàn thiện code dự án thực tế của bản thân.*
