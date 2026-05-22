using CMS.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace CMS.Backend.Controllers
{
    public class ProductController : Controller
    {
        private readonly ApplicationDbContext _context;

        public ProductController(ApplicationDbContext context)
        {
            _context = context;
        }
        public IActionResult Details(int id)
        {
            // Sử dụng .Include để nạp kèm dữ liệu của bảng Category sang View
            var post = _context.Posts
                             .Include(p => p.Category)
                             .FirstOrDefault(p => p.Id == id);

            if (post == null) return NotFound();

            return View(post);
        }
        public IActionResult Index()
        {
            // Lấy danh sách sản phẩm từ SQL Server
            var products = _context.Products.ToList();
            return View(products);
        }
    }
}