using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;
using System;
using System.IO;
using System.Linq;

namespace CMS.Backend.Controllers
{
    public class PostController : Controller
    {
        private readonly ApplicationDbContext _context;

        public PostController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Danh sách bài viết quản trị (Đã sửa lỗi link trống /Post)
        public IActionResult Index(int? id)
        {
            if (id == null)
            {
                var allPosts = _context.Posts.OrderByDescending(p => p.CreatedDate).Include(p => p.Category).ToList();
                return View("Index", allPosts); // Gọi chính xác file Index.cshtml
            }
            var filteredPosts = _context.Posts.Where(p => p.CategoryId == id).OrderByDescending(p => p.CreatedDate).Include(p => p.Category).ToList();
            return View("Index", filteredPosts);
        }

        // Chi tiết bài viết 
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

        // THÊM BÀI VIẾT (POST) + UPLOAD ẢNH VẬT LÝ VÀO WWWROOT
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

        // CHỈNH SỬA BÀI VIẾT (POST) + GIỮ ẢNH CŨ NẾU KHÔNG ĐỔI
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
    }
}