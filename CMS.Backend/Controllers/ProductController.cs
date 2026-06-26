// =========================================================================
// 👤 Sinh viên: Triệu Quốc Huy | MSSV: 2123110151
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
    // 🔒 CHỈ cho phép tài khoản Admin và Editor vào xem, quản lý danh sách sản phẩm.
    // ❌ Tài khoản nhóm "User" thông thường truy cập sẽ bị đá sang trang 403 ngay lập tức!
    [Authorize(Roles = "Admin,Editor")]
    public class ProductController(ApplicationDbContext context) : Controller
    {
        private readonly ApplicationDbContext _context = context;

        // =========================================================================
        // 🛠️ PHẦN 1: CÁC CHỨC NĂNG QUẢN TRỊ GIAO DIỆN (MVC) - LINK: /Product
        // =========================================================================

        [HttpGet]
        public IActionResult Index()
        {
            var products = _context.Products
                .Include(p => p.CategoryProduct)
                .Where(p => !p.IsDeleted)
                .OrderByDescending(p => p.Id)
                .ToList();

            return View(products);
        }

        // 2. GET: /Product/Create (Giao diện form thêm mới sản phẩm)
        [HttpGet]
        public IActionResult Create()
        {
            ViewBag.CategoryProductList = new SelectList(_context.CategoryProducts, "Id", "Name");
            ViewBag.ColorList = new MultiSelectList(_context.Colors, "Id", "Name");
            return View();
        }

        // 3. POST: /Product/Create (Xử lý hứng dữ liệu lưu sản phẩm mới)
        [HttpPost]
        public IActionResult Create(Product model, IFormFile uploadImage, List<int> ColorIds)
        {
            if (string.IsNullOrEmpty(model.Name))
            {
                ModelState.AddModelError("Name", "Tên sản phẩm bắt buộc phải nhập!");
                ViewBag.CategoryProductList = new SelectList(_context.CategoryProducts, "Id", "Name", model.CategoryProductId);
                ViewBag.ColorList = new MultiSelectList(_context.Colors, "Id", "Name", ColorIds);
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

            // Thêm nhiều màu
            if (ColorIds != null && ColorIds.Count > 0)
            {
                foreach (var cId in ColorIds)
                {
                    _context.ProductColors.Add(new ProductColor { ProductId = model.Id, ColorId = cId });
                }
                _context.SaveChanges();
            }

            TempData["SuccessMessage"] = "Thêm sản phẩm mới vào kho thành công!";
            return RedirectToAction("Index");
        }

        // 4. GET: /Product/Edit/5 (Giao diện form chỉnh sửa thông tin)
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var product = _context.Products.Include(p => p.ProductColors).FirstOrDefault(p => p.Id == id);
            if (product == null)
            {
                return NotFound();
            }

            var selectedColorIds = product.ProductColors?.Select(pc => pc.ColorId).ToList() ?? new List<int>();
            ViewBag.SelectedColorsData = product.ProductColors?.Select(pc => new {
                ColorId = pc.ColorId,
                ImageUrl = pc.ImageUrl
            }).ToList();
            ViewBag.CategoryProductList = new SelectList(_context.CategoryProducts, "Id", "Name", product.CategoryProductId);
            ViewBag.ColorList = new MultiSelectList(_context.Colors, "Id", "Name", selectedColorIds);
            
            // Pass all colors as JSON so JS can match names
            ViewBag.AllColorsJson = System.Text.Json.JsonSerializer.Serialize(_context.Colors.Select(c => new { c.Id, c.Name }).ToList());
            ViewBag.SelectedColorsDataJson = System.Text.Json.JsonSerializer.Serialize(ViewBag.SelectedColorsData);
            
            return View(product);
        }

        // 5. POST: /Product/Edit/5 (🌟 ĐÃ TỐI ƯU: Giải phóng Form đứng đơ, giữ ảnh cũ tuyệt đối)
        [HttpPost]
        public IActionResult Edit(Product model, IFormFile uploadImage, List<int> ColorIds)
        {
            // Kiểm tra điều kiện thủ công thay thế ModelState.IsValid để giải phóng lỗi ép kiểu Select danh mục
            if (string.IsNullOrEmpty(model.Name))
            {
                ModelState.AddModelError("Name", "Tên sản phẩm không được phép để trống!");
                ViewBag.CategoryProductList = new SelectList(_context.CategoryProducts, "Id", "Name", model.CategoryProductId);
                ViewBag.ColorList = new MultiSelectList(_context.Colors, "Id", "Name", ColorIds);
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

                // Cập nhật ProductColors
                var oldColors = _context.ProductColors.Where(pc => pc.ProductId == model.Id).ToList();
                _context.ProductColors.RemoveRange(oldColors);
                
                if (ColorIds != null && ColorIds.Count > 0)
                {
                    foreach (var cId in ColorIds)
                    {
                        var pc = new ProductColor { ProductId = model.Id, ColorId = cId };
                        
                        // Check if an image was uploaded for this specific color
                        var file = Request.Form.Files.FirstOrDefault(f => f.Name == $"variantImage_{cId}");
                        if (file != null && file.Length > 0)
                        {
                            string folder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "variants");
                            if (!Directory.Exists(folder)) Directory.CreateDirectory(folder);

                            string fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
                            string filePath = Path.Combine(folder, fileName);

                            using (var stream = new FileStream(filePath, FileMode.Create))
                            {
                                file.CopyTo(stream);
                            }
                            pc.ImageUrl = "/uploads/variants/" + fileName;
                        }
                        else
                        {
                            // Keep old image url if exists
                            var oldPc = oldColors.FirstOrDefault(o => o.ColorId == cId);
                            if (oldPc != null)
                            {
                                pc.ImageUrl = oldPc.ImageUrl;
                            }
                        }

                        _context.ProductColors.Add(pc);
                    }
                }
                _context.SaveChanges();

                TempData["SuccessMessage"] = "Cập nhật dữ liệu sản phẩm thành công!";
                return RedirectToAction("Index");
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("", "Lỗi lưu dữ liệu database: " + ex.Message);
                ViewBag.CategoryProductList = new SelectList(_context.CategoryProducts, "Id", "Name", model.CategoryProductId);
                ViewBag.ColorList = new MultiSelectList(_context.Colors, "Id", "Name", ColorIds);
                return View(model);
            }
        }

        // 6. GET: /Product/Delete/5 (Xóa bỏ mặt hàng)
        public IActionResult Delete(int id)
        {
            var product = _context.Products.Find(id);
            if (product != null)
            {
                product.IsDeleted = true;
                _context.SaveChanges();
                TempData["SuccessMessage"] = "Đã đưa sản phẩm vào thùng rác thành công!";
            }
            return RedirectToAction("Index");
        }

        // =========================================================================
        // 🌟 PHẦN 2: CỔNG ĐƯỜNG ỐNG WEB API TRẢ VỀ JSON - LINK: /Product/GetJsonAll
        // =========================================================================

        [HttpGet]
        [AllowAnonymous] // 🔓 Mở chặn bảo mật để ReactJS kéo dữ liệu mượt mà không dính Cookie mã hóa
        public IActionResult GetJsonAll()
        {
            var products = _context.Products
                .Include(p => p.ProductColors).ThenInclude(pc => pc.Color)
                .Where(p => !p.IsDeleted)
                .OrderByDescending(p => p.Id)
                .Select(p => new {
                    p.Id,
                    p.Name,
                    p.Description,
                    p.Price,
                    p.StockQuantity,
                    p.ImageUrl,
                    p.VariantInventories,
                    CategoryName = p.CategoryProduct != null ? p.CategoryProduct.Name : "Chưa phân loại",
                    Colors = p.ProductColors.Select(pc => new { 
                        Id = pc.ColorId, 
                        Name = pc.Color.Name, 
                        HexCode = pc.Color.HexCode,
                        ImageUrl = pc.ImageUrl
                    }).ToList(),
                    SoldCount = _context.OrderDetails.Where(od => od.ProductId == p.Id).Sum(od => (int?)od.Quantity) ?? 0
                })
                .ToList();

            return Ok(products);
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("/api/products")]
        public IActionResult GetAllProductsApi(string keyword = null, decimal? minPrice = null, decimal? maxPrice = null)
        {
            var query = _context.Products
                .Include(p => p.ProductColors).ThenInclude(pc => pc.Color)
                .Where(p => !p.IsDeleted)
                .AsQueryable();

            if (!string.IsNullOrEmpty(keyword))
            {
                query = query.Where(p => p.Name.Contains(keyword) || (p.Description != null && p.Description.Contains(keyword)));
            }
            if (minPrice.HasValue)
            {
                query = query.Where(p => p.Price >= minPrice.Value);
            }
            if (maxPrice.HasValue)
            {
                query = query.Where(p => p.Price <= maxPrice.Value);
            }

            var products = query
                .OrderByDescending(p => p.Id)
                .Select(p => new {
                    p.Id,
                    p.Name,
                    p.Description,
                    p.Price,
                    p.StockQuantity,
                    p.ImageUrl,
                    p.VariantInventories,
                    CategoryName = p.CategoryProduct != null ? p.CategoryProduct.Name : "Chưa phân loại",
                    Colors = p.ProductColors.Select(pc => new { 
                        Id = pc.ColorId, 
                        Name = pc.Color.Name, 
                        HexCode = pc.Color.HexCode,
                        ImageUrl = pc.ImageUrl
                    }).ToList(),
                    SoldCount = _context.OrderDetails.Where(od => od.ProductId == p.Id).Sum(od => (int?)od.Quantity) ?? 0
                })
                .ToList();

            return Ok(products);
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("/api/products/newest")]
        public IActionResult GetNewestProductsApi()
        {
            var products = _context.Products
                .Include(p => p.ProductColors).ThenInclude(pc => pc.Color)
                .Where(p => !p.IsDeleted)
                .OrderByDescending(p => p.Id)
                .Take(3)
                .Select(p => new {
                    p.Id, p.Name, p.Description, p.Price, p.ImageUrl,
                    CategoryName = p.CategoryProduct != null ? p.CategoryProduct.Name : "Chưa phân loại"
                })
                .ToList();
            return Ok(products);
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("/api/products/hot")]
        public IActionResult GetHotProductsApi()
        {
            var products = _context.Products
                .Include(p => p.ProductColors).ThenInclude(pc => pc.Color)
                .Where(p => !p.IsDeleted)
                .Select(p => new {
                    p.Id, p.Name, p.Description, p.Price, p.ImageUrl,
                    CategoryName = p.CategoryProduct != null ? p.CategoryProduct.Name : "Chưa phân loại",
                    SoldCount = _context.OrderDetails.Where(od => od.ProductId == p.Id).Sum(od => (int?)od.Quantity) ?? 0
                })
                .OrderByDescending(x => x.SoldCount)
                .Take(3)
                .ToList();
            return Ok(products);
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("/api/products/{id}")]
        public IActionResult GetProductApi(int id)
        {
            var product = _context.Products
                .Include(p => p.CategoryProduct)
                .Include(p => p.ProductColors).ThenInclude(pc => pc.Color)
                .Where(p => p.Id == id && !p.IsDeleted)
                .Select(p => new {
                    p.Id,
                    p.Name,
                    p.Description,
                    p.Price,
                    p.StockQuantity,
                    p.ImageUrl,
                    p.VariantInventories,
                    CategoryName = p.CategoryProduct != null ? p.CategoryProduct.Name : "Chưa phân loại",
                    Colors = p.ProductColors.Select(pc => new { 
                        Id = pc.ColorId, 
                        Name = pc.Color.Name, 
                        HexCode = pc.Color.HexCode,
                        ImageUrl = pc.ImageUrl
                    }).ToList(),
                    SoldCount = _context.OrderDetails.Where(od => od.ProductId == p.Id).Sum(od => (int?)od.Quantity) ?? 0
                })
                .FirstOrDefault();

            if (product == null) return NotFound();
            return Ok(product);
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("/api/products/category/{categoryId}")]
        public IActionResult GetProductsByCategoryApi(int categoryId)
        {
            var products = _context.Products
                .Include(p => p.CategoryProduct)
                .Where(p => p.CategoryProductId == categoryId && !p.IsDeleted)
                .OrderByDescending(p => p.Id)
                .Select(p => new {
                    p.Id,
                    p.Name,
                    p.Description,
                    p.Price,
                    p.StockQuantity,
                    p.ImageUrl,
                    p.VariantInventories,
                    CategoryName = p.CategoryProduct != null ? p.CategoryProduct.Name : "Chưa phân loại"
                })
                .ToList();

            return Ok(products);
        }
    }
}