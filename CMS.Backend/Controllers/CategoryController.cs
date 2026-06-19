// =========================================================================
// 👤 Sinh viên: Triệu Quốc Huy | MSSV: 2123110151
// 📅 Ngày tạo/cập nhật: 23/05/2026
// 📝 Chức năng: FILE TỐI ƯU HOÀN CHỈNH - Quản lý danh mục bài viết (Bảo mật & Chống sập)
// =========================================================================

using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization; // 🌟 Thư viện phân quyền hệ thống
using System.Linq;

namespace CMS.Backend.Controllers
{
    // 🔒 CHỈ cho phép tài khoản Admin và Editor vào cấu hình danh mục bài viết.
    // ❌ Tài khoản nhóm "User" thông thường truy cập sẽ bị đá sang trang 403 ngay lập tức!
    [Authorize(Roles = "Admin,Editor")]
    public class CategoryController(ApplicationDbContext context) : Controller
    {
        private readonly ApplicationDbContext _context = context;

        // GET: /Category/Index
        public IActionResult Index()
        {
            var data = _context.Categories.ToList();
            return View(data);
        }

        // GET: /Category/Delete/5
        // 🌟 ĐÃ SỬA: Chống sập hệ thống (Crash) khi xóa danh mục cha đang có bài viết liên quan
        public IActionResult Delete(int id)
        {
            // 1. Kiểm tra xem có bài viết nào thuộc danh mục này không
            bool hasRelatedPosts = _context.Posts.Any(p => p.CategoryId == id);

            if (hasRelatedPosts)
            {
                // Nếu có bài viết bám vào -> Tạo thông báo lỗi gửi ra giao diện Index mà không xóa
                TempData["ErrorMessage"] = "Không thể xóa! Danh mục này đang chứa bài viết dữ liệu thật. Vui lòng chuyển hoặc xóa các bài viết đó trước.";
                return RedirectToAction("Index");
            }

            // 2. Nếu an toàn (Không có bài viết nào liên quan) -> Tiến hành xóa bình thường
            var category = _context.Categories.Find(id);
            if (category != null)
            {
                _context.Categories.Remove(category);
                _context.SaveChanges();
                TempData["SuccessMessage"] = "Xóa danh mục thành công!";
            }
            return RedirectToAction("Index");
        }

        // GET: /Category/Edit/5
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var category = _context.Categories.Find(id);
            if (category == null)
            {
                return NotFound();
            }
            return View(category);
        }

        // POST: /Category/Edit
        [HttpPost]
        public IActionResult Edit(Category model)
        {
            if (ModelState.IsValid)
            {
                _context.Categories.Update(model);
                _context.SaveChanges();
                TempData["SuccessMessage"] = "Cập nhật danh mục thành công!";
                return RedirectToAction("Index");
            }
            return View(model);
        }

        // GET: /Category/Create
        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        // POST: /Category/Create
        [HttpPost]
        public IActionResult Create(Category model)
        {
            if (ModelState.IsValid)
            {
                _context.Categories.Add(model);
                _context.SaveChanges();
                TempData["SuccessMessage"] = "Thêm danh mục mới thành công!";
                return RedirectToAction("Index");
            }
            return View(model);
        }

        // =========================================================================
        // 🌟 CÁC CỔNG API TRẢ VỀ DỮ LIỆU JSON (PHỤC VỤ REACTJS)
        // =========================================================================
        [HttpGet]
        [AllowAnonymous]
        [Route("/api/categories")]
        public IActionResult GetCategoriesApi()
        {
            var categories = _context.Categories
                .Select(c => new {
                    c.Id,
                    c.Name
                })
                .ToList();
            return Ok(categories);
        }
    }
}