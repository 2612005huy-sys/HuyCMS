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
    [Authorize] // 🔒 Khóa bảo mật chung cho toàn bộ file
    public class PostController : Controller
    {
        private readonly ApplicationDbContext _context;

        public PostController(ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================================================================
        // 🛠️ PHẦN 1: CÁC HÀM TRẢ VỀ GIAO DIỆN QUẢN TRỊ (MVC CŨ CỦA HUY - GIỮ NGUYÊN)
        // =========================================================================

        // Đường dẫn giao diện: https://localhost:7005/Post
        public IActionResult Index(int? id)
        {
            if (id == null)
            {
                var allPosts = _context.Posts.OrderByDescending(p => p.CreatedDate).Include(p => p.Category).ToList();
                return View("Index", allPosts);
            }
            var filteredPosts = _context.Posts.Where(p => p.CategoryId == id).OrderByDescending(p => p.CreatedDate).Include(p => p.Category).ToList();
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

        // THÊM BÀI VIẾT (POST)
        [HttpPost]
        public IActionResult Create(Post model, IFormFile uploadImage)
        {
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
            _context.Posts.Add(model);
            _context.SaveChanges();
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

        // CHỈNH SỬA BÀI VIẾT (POST)
        [HttpPost]
        public IActionResult Edit(Post model, IFormFile uploadImage)
        {
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
                var oldPost = _context.Posts.AsNoTracking().FirstOrDefault(p => p.Id == model.Id);
                if (oldPost != null)
                {
                    model.ImageUrl = oldPost.ImageUrl;
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
        // 🌟 PHẦN 2: CÁC CỔNG API TRẢ VỀ DỮ LIỆU JSON (BUỔI 6 - THÊM VÀO ĐÁY FILE)
        // =========================================================================

        // 1. API lấy toàn bộ danh sách chữ thô JSON (Đường dẫn: https://localhost:7005/Post/GetJsonAll)
        [HttpGet]
        [AllowAnonymous] // Cho phép ReactJS lấy dữ liệu công khai không cần đăng nhập
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

            return Ok(posts); // Trả về dữ liệu JSON mã 200
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
                return NotFound(new { message = "Không tìm thấy bài viết này" });
            }

            return Ok(post);
        }
    }
}