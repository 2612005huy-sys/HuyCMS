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
    [Authorize] // 🔒 Khóa bảo mật chung cho toàn bộ file (Buổi 5)
    public class PostController : Controller
    {
        private readonly ApplicationDbContext _context;

        public PostController(ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================================================================
        // 🛠️ PHẦN 1: CÁC HÀM TRẢ VỀ GIAO DIỆN QUẢN TRỊ (MVC CŨ CỦA HUY)
        // =========================================================================

        // Đường dẫn giao diện danh sách: https://localhost:7005/Post
        public IActionResult Index(int? id)
        {
            if (id == null)
            {
                var allPosts = _context.Posts.OrderByDescending(p => p.Id).Include(p => p.Category).ToList();
                return View("Index", allPosts);
            }
            var filteredPosts = _context.Posts.Where(p => p.CategoryId == id).OrderByDescending(p => p.Id).Include(p => p.Category).ToList();
            return View("Index", filteredPosts);
        }

        // Chi tiết bài viết giao diện admin
        public IActionResult Details(int id)
        {
            var post = _context.Posts.Include(p => p.Category).FirstOrDefault(p => p.Id == id);
            if (post == null) return NotFound();
            return View(post);
        }

        // THÊM BÀI VIẾT (GET)
        [HttpGet]
        public IActionResult Create()
        {
            ViewBag.CategoryList = new SelectList(_context.Categories, "Id", "Name");
            return View();
        }

        // THÊM BÀI VIẾT (POST) - 🌟 ĐÃ SỬA CHỐNG LỖI NULL CONTENT VÀ NULL IMAGEURL
        [HttpPost]
        public IActionResult Create(Post model, IFormFile uploadImage)
        {
            // 1. Kiểm tra an toàn: Không cho phép bỏ trống nội dung bài viết
            if (string.IsNullOrEmpty(model.Content))
            {
                ModelState.AddModelError("", "Lỗi: Nội dung bài viết không được phép bỏ trống!");
                ViewBag.CategoryList = new SelectList(_context.Categories, "Id", "Name", model.CategoryId);
                return View(model);
            }

            // 2. Kiểm tra và xử lý file ảnh đại diện bài viết
            if (uploadImage != null && uploadImage.Length > 0)
            {
                string folder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
                if (!Directory.Exists(folder)) Directory.CreateDirectory(folder);

                string fileName = Guid.NewGuid().ToString() + Path.GetExtension(uploadImage.FileName);
                string filePath = Path.Combine(folder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    uploadImage.CopyTo(stream);
                }
                model.ImageUrl = "/uploads/" + fileName; // Gán đường dẫn ảnh vừa upload thành công
            }
            else
            {
                // 🌟 SỬA LỖI BUỔI 6: Nếu Huy không chọn ảnh, tự động gán ảnh mặc định để SQL không bị lỗi NOT NULL
                model.ImageUrl = "/uploads/default.jpg";
            }

            // Nếu người dùng không chọn ngày, tự động lấy giờ hiện tại hệ thống
            if (model.CreatedDate == default)
            {
                model.CreatedDate = DateTime.Now;
            }

            _context.Posts.Add(model);
            _context.SaveChanges(); // An toàn 100%, lưu thẳng vào SQL Server
            return RedirectToAction("Index");
        }

        // CHỈNH SỬA BÀI VIẾT (GET)
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var post = _context.Posts.Find(id);
            if (post == null) return NotFound();
            ViewBag.CategoryList = new SelectList(_context.Categories, "Id", "Name", post.CategoryId);
            return View(post);
        }

        // CHỈNH SỬA BÀI VIẾT (POST) - 🌟 ĐÃ SỬA CHỐNG LỖI NULL KHI SỬA BÀI
        [HttpPost]
        public IActionResult Edit(Post model, IFormFile uploadImage)
        {
            if (string.IsNullOrEmpty(model.Content))
            {
                ModelState.AddModelError("", "Lỗi: Nội dung bài viết không được để trống!");
                ViewBag.CategoryList = new SelectList(_context.Categories, "Id", "Name", model.CategoryId);
                return View(model);
            }

            if (uploadImage != null && uploadImage.Length > 0)
            {
                string folder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
                if (!Directory.Exists(folder)) Directory.CreateDirectory(folder);

                string fileName = Guid.NewGuid().ToString() + Path.GetExtension(uploadImage.FileName);
                string filePath = Path.Combine(folder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    uploadImage.CopyTo(stream);
                }
                model.ImageUrl = "/uploads/" + fileName;
            }
            else
            {
                // Giữ lại đường dẫn ảnh cũ nếu không thực hiện upload ảnh mới thay thế
                var oldPost = _context.Posts.AsNoTracking().FirstOrDefault(p => p.Id == model.Id);
                if (oldPost != null)
                {
                    model.ImageUrl = oldPost.ImageUrl;
                }
                else
                {
                    model.ImageUrl = "/uploads/default.jpg";
                }
            }

            _context.Posts.Update(model);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }

        // XÓA BÀI VIẾT
        public IActionResult Delete(int id)
        {
            var post = _context.Posts.Find(id);
            if (post != null)
            {
                _context.Posts.Remove(post);
                _context.SaveChanges();
            }
            return RedirectToAction("Index");
        }

        // =========================================================================
        // 🌟 PHẦN 2: CÁC CỔNG API TRẢ VỀ DỮ LIỆU JSON (BUỔI 6 - PHỤC VỤ REACTJS)
        // =========================================================================

        // 1. API lấy toàn bộ danh sách chữ thô JSON (Đường dẫn: https://localhost:7005/Post/GetJsonAll)
        [HttpGet]
        [AllowAnonymous] // Mở cửa công khai để ReactJS buổi sau gọi lấy dữ liệu không cần dính Cookie mã hóa
        public IActionResult GetJsonAll()
        {
            var posts = _context.Posts
                .OrderByDescending(p => p.Id)
                .Select(p => new {
                    p.Id,
                    p.Title,
                    p.ImageUrl,
                    p.CreatedDate,
                    CategoryName = p.Category != null ? p.Category.Name : "Chưa phân loại"
                })
                .ToList();

            return Ok(posts);
        }

        // 2. API lấy chi tiết 1 bài viết dạng JSON (Đường dẫn: https://localhost:7005/Post/GetJsonDetail/5)
        [HttpGet]
        [AllowAnonymous]
        public IActionResult GetJsonDetail(int id)
        {
            var post = _context.Posts
                .Include(p => p.Category)
                .FirstOrDefault(p => p.Id == id);

            if (post == null)
            {
                return NotFound(new { message = "Không tìm thấy bài viết này trong cơ sở dữ liệu" });
            }

            return Ok(post);
        }
    }
}