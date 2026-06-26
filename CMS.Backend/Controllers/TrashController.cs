using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using CMS.Data;
using CMS.Data.Entities;
using System.Linq;

namespace CMS.Backend.Controllers
{
    [Authorize(Roles = "Admin")] // Chỉ tài khoản Admin mới được can thiệp vào thùng rác
    public class TrashController(ApplicationDbContext context) : Controller
    {
        private readonly ApplicationDbContext _context = context;

        // 1. Giao diện danh sách thùng rác
        public IActionResult Index()
        {
            var deletedProducts = _context.Products
                .Include(p => p.CategoryProduct)
                .Where(p => p.IsDeleted)
                .OrderByDescending(p => p.Id)
                .ToList();

            var deletedPosts = _context.Posts
                .Include(p => p.Category)
                .Where(p => p.IsDeleted)
                .OrderByDescending(p => p.Id)
                .ToList();

            ViewBag.DeletedProducts = deletedProducts;
            ViewBag.DeletedPosts = deletedPosts;

            return View();
        }

        // 2. Khôi phục Sản phẩm
        public IActionResult RestoreProduct(int id)
        {
            var product = _context.Products.Find(id);
            if (product != null)
            {
                product.IsDeleted = false;
                _context.SaveChanges();
                TempData["SuccessMessage"] = $"Đã khôi phục sản phẩm '{product.Name}' thành công!";
            }
            return RedirectToAction("Index");
        }

        // 3. Khôi phục Bài viết
        public IActionResult RestorePost(int id)
        {
            var post = _context.Posts.Find(id);
            if (post != null)
            {
                post.IsDeleted = false;
                _context.SaveChanges();
                TempData["SuccessMessage"] = $"Đã khôi phục bài viết '{post.Title}' thành công!";
            }
            return RedirectToAction("Index");
        }

        // 4. Xóa vĩnh viễn Sản phẩm
        public IActionResult DeleteProductPermanently(int id)
        {
            var product = _context.Products.Include(p => p.ProductColors).FirstOrDefault(p => p.Id == id);
            if (product != null)
            {
                // Xóa ảnh vật lý của sản phẩm nếu cần (tùy chọn)
                
                // Xóa liên kết màu sắc của sản phẩm trước
                if (product.ProductColors != null)
                {
                    _context.ProductColors.RemoveRange(product.ProductColors);
                }

                _context.Products.Remove(product);
                _context.SaveChanges();
                TempData["SuccessMessage"] = "Đã xóa vĩnh viễn sản phẩm khỏi cơ sở dữ liệu!";
            }
            return RedirectToAction("Index");
        }

        // 5. Xóa vĩnh viễn Bài viết
        public IActionResult DeletePostPermanently(int id)
        {
            var post = _context.Posts.Find(id);
            if (post != null)
            {
                _context.Posts.Remove(post);
                _context.SaveChanges();
                TempData["SuccessMessage"] = "Đã xóa vĩnh viễn bài viết khỏi cơ sở dữ liệu!";
            }
            return RedirectToAction("Index");
        }
    }
}
