// =========================================================================
// 👤 Sinh viên: Triệu Quốc Huy
// 🆔 MSSV: 2123110151
// 📅 Ngày tạo/cập nhật: 23/05/2026
// 📝 Chức năng: FILE HOÀN CHỈNH - Quản lý Danh mục Sản phẩm (CRUD An toàn)
// =========================================================================

using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Linq;

namespace CMS.Backend.Controllers
{
    [Authorize(Roles = "Admin")] // 🔒 Bảo mật cao: Chỉ Admin hệ thống mới được quản lý
    public class CategoryProductController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CategoryProductController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. GET: /CategoryProduct/Index (Xem danh sách danh mục sản phẩm)
        [HttpGet]
        public IActionResult Index()
        {
            var data = _context.CategoryProducts.OrderByDescending(cp => cp.Id).ToList();
            return View(data);
        }

        // 2. GET: /CategoryProduct/Create (Giao diện Thêm mới)
        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        // 3. POST: /CategoryProduct/Create (Xử lý lưu danh mục mới)
        [HttpPost]
        public IActionResult Create(CategoryProduct model)
        {
            if (ModelState.IsValid)
            {
                _context.CategoryProducts.Add(model);
                _context.SaveChanges();
                TempData["SuccessMessage"] = "Thêm danh mục sản phẩm mới thành công!";
                return RedirectToAction("Index");
            }
            return View(model);
        }

        // 4. GET: /CategoryProduct/Edit/5 (Giao diện Sửa)
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var category = _context.CategoryProducts.Find(id);
            if (category == null) return NotFound();
            return View(category);
        }

        // 5. POST: /CategoryProduct/Edit/5 (Xử lý cập nhật thông tin)
        [HttpPost]
        public IActionResult Edit(CategoryProduct model)
        {
            if (ModelState.IsValid)
            {
                _context.CategoryProducts.Update(model);
                _context.SaveChanges();
                TempData["SuccessMessage"] = "Cập nhật danh mục sản phẩm thành công!";
                return RedirectToAction("Index");
            }
            return View(model);
        }

        // 6. GET: /CategoryProduct/Delete/5
        // 🌟 CHỐNG SẬP DATABASE: Nếu danh mục đang có sản phẩm bám vào thì KHÔNG CHO XÓA
        public IActionResult Delete(int id)
        {
            // Kiểm tra xem bảng Products có sản phẩm nào dùng mã danh mục này không
            bool hasProducts = _context.Products.Any(p => p.CategoryProductId == id);

            if (hasProducts)
            {
                TempData["ErrorMessage"] = "Không thể xóa! Danh mục này đang chứa các sản phẩm thật trong kho hàng.";
                return RedirectToAction("Index");
            }

            var category = _context.CategoryProducts.Find(id);
            if (category != null)
            {
                _context.CategoryProducts.Remove(category);
                _context.SaveChanges();
                TempData["SuccessMessage"] = "Xóa danh mục sản phẩm thành công!";
            }
            return RedirectToAction("Index");
        }
    }
}