using CMS.Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; // Bắt buộc phải có để dùng được lệnh .Include()
using CMS.Data; // Thư mục chứa ApplicationDbContext của bạn
using System.Diagnostics;
using System.Linq; // Bắt buộc phải có để dùng được lệnh .Take(3) và .OrderByDescending()

namespace CMS.Backend.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        // Khai báo biến local để quản lý thực thể kết nối Database
        private readonly ApplicationDbContext _context;

        // Tiến hành "Tiêm" ApplicationDbContext vào hàm khởi tạo của HomeController
        public HomeController(ILogger<HomeController> logger, ApplicationDbContext context)
        {
            _logger = logger;
            _context = context; // Gán kết nối database vào biến cục bộ
        }

        // Trang chủ: Tự động chạy khi bạn mở link https://localhost:xxxx/
        public IActionResult Index()
        {
            // CÚ PHÁP LINQ THẦN THÁNH THEO YÊU CẦU CỦA THẦY THÁI:
            var latestPosts = _context.Posts
                                      .Include(p => p.Category) // Mắt xích 1: Join bảng lấy kèm thông tin tên danh mục
                                      .OrderByDescending(p => p.CreatedDate) // Mắt xích 2: Sắp xếp ngày đăng mới nhất lên đầu trang
                                      .Take(3) // Mắt xích 3: Cắt lấy đúng 3 bản tin đầu tiên sau khi đã xếp hạng
                                      .ToList(); // Mắt xích 4: Chốt hạ dữ liệu và tải từ SQL Server về máy

            // Truyền danh sách 3 bài viết mới nhất này sang file giao diện Views/Home/Index.cshtml
            return View(latestPosts);
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}