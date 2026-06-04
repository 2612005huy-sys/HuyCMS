// =========================================================================
// 👤 Sinh viên: Triệu Quốc Huy
// 🆔 MSSV: 2123110151
// 📅 Ngày tạo/cập nhật: 23/05/2026
// 📝 Chức năng: FILE TỐI ƯU TOÀN DIỆN - Sửa lỗi đứng form Edit & Giữ ảnh cũ
// =========================================================================

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using CMS.Data;
using CMS.Data.Entities;
using System;
using System.IO;
using System.Linq;

namespace CMS.Backend.Controllers
{
    [Authorize] // 🔒 Ổ khóa bảo mật hệ thống quản trị Admin
    public class ProductController : Controller
    {
        private readonly ApplicationDbContext _context;

        public ProductController(ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================================================================
        // 🛠️ PHẦN 1: CÁC CHỨC NĂNG QUẢN TRỊ GIAO DIỆN (MVC) - LINK: /Product
        // =========================================================================

        // 1. GET: /Product/Index (Trang hiển thị danh sách sản phẩm kho)
        [HttpGet]
        public IActionResult Index()
        {
            var products = _context.Products
                .Include(p => p.CategoryProduct)
                .OrderByDescending(p => p.Id)
                .ToList();

            return View(products);
        }

        // 2. GET: /Product/Create (Giao diện form thêm mới sản phẩm)
        [HttpGet]
        public IActionResult Create()
        {
            ViewBag.CategoryProductList = new SelectList(_context.CategoryProducts, "Id", "Name");
            return View();
        }

        // 3. POST: /Product/Create (Xử lý hứng dữ liệu lưu sản phẩm mới)
        [HttpPost]
        public IActionResult Create(Product model, IFormFile uploadImage)
        {
            if (string.IsNullOrEmpty(model.Name))
            {
                ModelState.AddModelError("Name", "Tên sản phẩm bắt buộc phải nhập!");
                ViewBag.CategoryProductList = new SelectList(_context.CategoryProducts, "Id", "Name", model.CategoryProductId);
                return View(model);
            }

            if (uploadImage != null && uploadImage.Length > 0)
            {
                string folder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "products");
                if (!Directory.Exists(folder)) Directory.CreateDirectory(folder);

                string fileName = Guid.NewGuid().ToString() + Path.GetExtension(uploadImage.FileName);
                string filePath = Path.Combine(folder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    uploadImage.CopyTo(stream);
                }
                model.ImageUrl = "/uploads/products/" + fileName;
            }
            else
            {
                model.ImageUrl = "/uploads/products/default-product.jpg";
            }

            _context.Products.Add(model);
            _context.SaveChanges();

            TempData["SuccessMessage"] = "Thêm sản phẩm mới vào kho thành công!";
            return RedirectToAction("Index");
        }

        // 4. GET: /Product/Edit/5 (Giao diện form chỉnh sửa thông tin)
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var product = _context.Products.Find(id);
            if (product == null)
            {
                return NotFound();
            }

            ViewBag.CategoryProductList = new SelectList(_context.CategoryProducts, "Id", "Name", product.CategoryProductId);
            return View(product);
        }

        // 5. POST: /Product/Edit/5 (🌟 ĐÃ TỐI ƯU: Giải phóng Form đứng đơ, giữ ảnh cũ tuyệt đối)
        [HttpPost]
        public IActionResult Edit(Product model, IFormFile uploadImage)
        {
            // Kiểm tra điều kiện thủ công thay thế ModelState.IsValid để giải phóng lỗi ép kiểu Select danh mục
            if (string.IsNullOrEmpty(model.Name))
            {
                ModelState.AddModelError("Name", "Tên sản phẩm không được phép để trống!");
                ViewBag.CategoryProductList = new SelectList(_context.CategoryProducts, "Id", "Name", model.CategoryProductId);
                return View(model);
            }

            // Xử lý logic Hình ảnh
            if (uploadImage != null && uploadImage.Length > 0)
            {
                // Trường hợp 1: Có chọn file mới -> Upload ghi đè file mới
                string folder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "products");
                if (!Directory.Exists(folder)) Directory.CreateDirectory(folder);

                string fileName = Guid.NewGuid().ToString() + Path.GetExtension(uploadImage.FileName);
                string filePath = Path.Combine(folder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    uploadImage.CopyTo(stream);
                }
                model.ImageUrl = "/uploads/products/" + fileName;
            }
            else
            {
                // Trường hợp 2: Không chọn file -> Truy vấn bốc lại đường dẫn ảnh cũ từ DB để bảo toàn dữ liệu
                var existingProduct = _context.Products.AsNoTracking().FirstOrDefault(p => p.Id == model.Id);
                if (existingProduct != null)
                {
                    model.ImageUrl = existingProduct.ImageUrl;
                }
            }

            // Tiến hành cập nhật vào SQL Server cơ chế bọc an toàn Try-Catch
            try
            {
                _context.Products.Update(model);
                _context.SaveChanges();

                TempData["SuccessMessage"] = "Cập nhật dữ liệu sản phẩm thành công!";
                return RedirectToAction("Index");
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("", "Lỗi lưu dữ liệu database: " + ex.Message);
                ViewBag.CategoryProductList = new SelectList(_context.CategoryProducts, "Id", "Name", model.CategoryProductId);
                return View(model);
            }
        }

        // 6. GET: /Product/Delete/5 (Xóa bỏ mặt hàng)
        public IActionResult Delete(int id)
        {
            var product = _context.Products.Find(id);
            if (product != null)
            {
                _context.Products.Remove(product);
                _context.SaveChanges();
                TempData["SuccessMessage"] = "Đã xóa sản phẩm khỏi danh mục quản trị thành công!";
            }
            return RedirectToAction("Index");
        }

        // =========================================================================
        // 🌟 PHẦN 2: CỔNG ĐƯỜNG ỐNG WEB API TRẢ VỀ JSON - LINK: /Product/GetJsonAll
        // =========================================================================

        [HttpGet]
        [AllowAnonymous] // 🔓 Mở chặn bảo mật để ReactJS kéo dữ liệu mượt mà
        public IActionResult GetJsonAll()
        {
            var products = _context.Products
                .OrderByDescending(p => p.Id)
                .Select(p => new {
                    p.Id,
                    p.Name,
                    p.Description,
                    p.Price,
                    p.StockQuantity,
                    p.ImageUrl,
                    CategoryName = p.CategoryProduct != null ? p.CategoryProduct.Name : "Chưa phân loại"
                })
                .ToList();

            return Ok(products);
        }
    }
}