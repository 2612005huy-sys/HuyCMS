# 🎓 Báo Cáo Tiến Độ Đồ Án: HuyCMS E-Commerce Platform

**Thông tin sinh viên thực hiện:**
- **Họ và tên:** Triệu Quốc Huy
- **Mã số sinh viên:** 2123110151

---

## 🚀 Tiến trình thực hiện dự án theo từng buổi

Dưới đây là bảng tổng hợp chi tiết các hạng mục công việc đã thực hiện qua từng buổi học:

| Buổi | Tên công việc | Trạng thái | Chi tiết triển khai |
| :--- | :--- | :---: | :--- |
| **Buổi 1** | Khởi tạo cấu trúc dự án 3 lớp, thiết lập cơ sở dữ liệu ChinhCMS_DB. | ✅ Đã hoàn thành | Tạo các thực thể và cấu hình kết nối database. |
| **Buổi 2** | Quản lý đơn hàng và chi tiết đơn hàng trực quan. | ✅ Đã hoàn thành | Thiết kế bảng hiển thị danh sách hóa đơn theo trạng thái. |
| **Buổi 3** | Xây dựng chức năng CRUD Danh mục an toàn, lọc bài viết mới nhất lên Trang chủ. | ✅ Đã hoàn thành | Khóa xóa danh mục chứa bài viết, dùng LINQ lấy 3 bài viết mới nhất. |
| **Buổi 4** | Thiết kế giao diện quản trị Admin Panel, tích hợp tải ảnh và trình soạn thảo CKEditor 5. | ✅ Đã hoàn thành | Hoàn thiện các trang quản lý: Danh mục, Bài viết, Đơn hàng, Thành viên (User CRUD). |
| **Buổi 5** | Bảo mật Cookie nâng cao, Phân quyền chi tiết, Quản lý sản phẩm & Danh mục sản phẩm. | ✅ Đã hoàn thành | Xác thực Cookie, mã hóa BCrypt, dọn rác ảnh cũ, cố định ổ khóa Data Protection, phân trang, ẩn nút Xóa nếu chứa sản phẩm. |
| **Buổi 6** | Phát triển Web API RESTful & cấu hình CORS, tích hợp bộ tạo tài liệu tự động Swagger UI. | ✅ Đã hoàn thành | Xây dựng hệ thống 4 API Controllers (Bài viết, Sản phẩm, Khách hàng, Đơn hàng), băm mật khẩu BCrypt, trừ kho, Transaction checkout, CORS & Swashbuckle. |
| **Buổi 7** | Kết nối Frontend ReactJS với Backend ASP.NET Core Web API. | ✅ Đã hoàn thành | Cấu hình CORS trên Backend, thiết lập Axios Client tập trung, xây dựng component hiển thị danh mục sản phẩm. Tự thực hiện bài tập mở rộng kết nối API danh sách sản phẩm (Grid Card, định dạng VND) và tin tức (định dạng ngày vi-VN). |
| **Buổi 8** | Hoàn thiện trang cá nhân, xếp hạng VIP động, luồng đặt hàng thật, tách CSS và tối ưu hóa UI/UX. | ✅ Đã hoàn thành | Tách biệt trang danh sách sản phẩm và trang Bài viết chuyên biệt kèm bộ lọc chuyên mục. Tải thông tin tài khoản và tính hạng VIP động ở Frontend. Ràng buộc bảo mật thanh toán. Gửi hóa đơn lên Backend thực hiện Database Transaction trừ tồn kho. Tách CSS nhúng sang thư mục `src/assets/css`. |
| **Buổi 9** | Nâng cấp hệ thống SEO Slug và cấu trúc dữ liệu cho thực thể sản phẩm (Product). | ✅ Đã hoàn thành | Tích hợp SlugHelper tự sinh URL thân thiện tiếng Việt không dấu, ràng buộc Unique Index SQL Server. Xây dựng API tải sản phẩm theo Slug, nâng cấp định tuyến SEO. |
| **Buổi 10**| Tích hợp Banner Carousel động, khóa danh mục hệ thống & Sửa lỗi cuộn Sidebar. | ✅ Đã hoàn thành | Tạo bảng Banner, API Banner, CRUD Banner Admin Dashboard upload/xóa ảnh, slider động HeroBanner. Khóa cứng danh mục hệ thống (7 & 13). Sửa lỗi Sidebar cuộn. |
| **Buổi 11**| Tái cấu trúc SPA với React Router DOM, sửa lỗi cập nhật bài viết & Căn giữa Header. | ✅ Đã hoàn thành | Tích hợp BrowserRouter/Link thay thế custom navigate, sửa tham số IFormFile cho PostController, cân bằng flex Header căn giữa menu. |
| **Buổi 12**| Tích hợp giỏ hàng nâng cao, Live Search Autocomplete, Phân trang & Ẩn danh mục hệ thống. | ✅ Đã hoàn thành | Thiết kế lại ProductCard; ô nhập số lượng; giao diện Checkout 2 cột; AJAX đổi nhanh trạng thái Banner; phân tách Sidebar; Live-search Autocomplete; phân rã main.css thành CSS module riêng biệt; cấu hình phân trang 8 phần tử; Header thông minh Mobile; viết chú thích tiếng Việt cho toàn bộ mã nguồn. |
| **Buổi 13**| Tái cấu trúc modular giao diện tài khoản, hoàn thiện chi tiết đơn hàng (OrderDetail), tối ưu trừ tồn kho. | ✅ Đã hoàn thành | Phân tách UserProfileHeader, OrderHistoryTable, OrderDetailModal; thiết lập cơ chế trừ tồn kho khi phê duyệt; tích hợp danh sách sản phẩm và hành động xóa sản phẩm vào trang cập nhật đơn hàng; thêm bộ lọc minPrice, maxPrice API; xây dựng trang Details cho Admin và vẽ sơ đồ ERD & giao tiếp hệ thống. |

---
*Dự án được xây dựng và tối ưu liên tục qua từng buổi nhằm mục đích học tập, nghiên cứu và ứng dụng thực tiễn.*
