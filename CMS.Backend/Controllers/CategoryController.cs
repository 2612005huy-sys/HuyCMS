// sinh vien: trieu quoc huy
// mssv: 2123110151
// ngay tao: 15/5/26

using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using System.Linq; // Đảm bảo giữ thư viện này để chạy lệnh .ToList()

namespace CMS.Backend.Controllers
{
    public class CategoryController : Controller
    {
        private readonly ApplicationDbContext _context;

        // "Tiêm" kết nối vào Controller
        public CategoryController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: /Category/Index
        public IActionResult Index()
        {
            // Lấy dữ liệu THẬT từ bảng Categories trong SQL
            var data = _context.Categories.ToList();
            return View(data);
        }
        // Action nhận vào Id của danh mục cần xóa từ URL (Ví dụ: /Category/Delete/3)
        public IActionResult Delete(int id)
        {
            // Bước 1: Tìm đối tượng danh mục trong Database bằng Id
            var category = _context.Categories.Find(id);

            // Kiểm tra nếu tìm thấy thực thể tồn tại thì mới tiến hành xóa
            if (category != null)
            {
                // Bước 2: Lệnh xóa khỏi bộ nhớ tạm (Tracking) của Entity Framework Core
                _context.Categories.Remove(category);

                // Bước 3: Chốt phiên làm việc, xóa thực sự các hàng trong SQL Server
                _context.SaveChanges();
            }

            // Sau khi xóa thành công dưới SQL, tự động quay lại trang danh sách để cập nhật lại giao diện
            return RedirectToAction("Index");
        }
        // =========================================================================
        // PHẦN CHỈNH SỬA MỚI: THEO ĐÚNG NỘI DUNG BÀI HỌC BUỔI 3
        // =========================================================================
        // 1. Hàm GET: Tìm dữ liệu cũ theo ID và đổ lên Form để sửa
        // Đường dẫn dạng: /Category/Edit/5
        [HttpGet]
        public IActionResult Edit(int id)
        {
            // Tìm danh mục trong Database theo đúng Id truyền vào
            var category = _context.Categories.Find(id);

            // Nếu không tìm thấy (gõ bậy ID trên URL) thì trả về trang 404
            if (category == null)
            {
                return NotFound();
            }

            // Gửi đối tượng tìm được sang giao diện Edit.cshtml để tự động điền chữ vào ô nhập liệu
            return View(category);
        }

        // 2. Hàm POST: Nhận dữ liệu mới đã sửa từ người dùng bấm nút gửi lên và lưu lại vào SQL Server
        [HttpPost]
        public IActionResult Edit(Category model)
        {
            // Lệnh cập nhật đối tượng vào bộ nhớ tạm (Entity Framework sẽ tự theo dõi các trường thay đổi)
            _context.Categories.Update(model);

            // Ra lệnh đồng bộ, thực thi câu lệnh UPDATE thật sự xuống SQL Server
            _context.SaveChanges();

            // Quay lại trang danh sách (Index) để xem kết quả sau khi sửa
            return RedirectToAction("Index");
        }
        // 1. Hàm GET: Dùng để hiển thị giao diện Form trống cho sinh viên nhập liệu
        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        // 2. Hàm POST: Dùng để đón dữ liệu từ Form trình duyệt gửi lên và lưu vào SQL Server
        [HttpPost]
        public IActionResult Create(Category model)
        {
            // BƯỚC 1: Thêm đối tượng dữ liệu vào bộ nhớ tạm của Entity Framework Core
            _context.Categories.Add(model);

            // BƯỚC 2: Ra lệnh cho hệ thống ghi dữ liệu thật sự xuống các hàng trong SQL Server
            _context.SaveChanges();

            // Sau khi lưu thành công, tự động điều hướng quay trở lại trang danh sách (Index) để xem kết quả
            return RedirectToAction("Index");
        }
    }
}   