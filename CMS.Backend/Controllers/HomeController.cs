using CMS.Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using System.Diagnostics;
using System.Linq;
using Microsoft.AspNetCore.Authorization;

namespace CMS.Backend.Controllers
{
    [Authorize(Roles = "Admin,Editor")]
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

            // 🛠 TỰ ĐỘNG THÊM CỘT VÀO CSDL NẾU CHƯA CÓ (TRÁNH LỖI MIGRATION CỦA NGƯỜI DÙNG)
            try
            {
                _context.Database.ExecuteSqlRaw(@"
                    IF COL_LENGTH('OrderDetails', 'Color') IS NULL
                    BEGIN
                        ALTER TABLE OrderDetails ADD Color nvarchar(max) NULL;
                    END
                    IF COL_LENGTH('OrderDetails', 'StorageCapacity') IS NULL
                    BEGIN
                        ALTER TABLE OrderDetails ADD StorageCapacity nvarchar(max) NULL;
                    END
                ");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi tự động thêm cột vào OrderDetails: " + ex.Message);
            }
        }

        // Trang chủ: Tự động chạy khi bạn mở link https://localhost:xxxx/
        public IActionResult Index()
        {
            var vm = new DashboardViewModel();
            
            // 1. Tính Tổng Doanh Thu (Lấy các chi tiết đơn hàng)
            var orderDetails = _context.OrderDetails.ToList();
            vm.TotalRevenue = orderDetails.Sum(od => od.Quantity * od.UnitPrice);

            // 2. Thống kê cơ bản
            vm.TotalOrders = _context.Orders.Count();
            vm.TotalCustomers = _context.Customers.Count();
            vm.TotalProducts = _context.Products.Count();

            // 3. 5 Đơn hàng mới nhất
            vm.RecentOrders = _context.Orders
                .Include(o => o.Customer)
                .OrderByDescending(o => o.OrderDate)
                .Take(5)
                .ToList();

            // 4. Giữ lại 3 bài viết mới nhất
            vm.RecentPosts = _context.Posts
                .Include(p => p.Category)
                .OrderByDescending(p => p.CreatedDate)
                .Take(3)
                .ToList();

            return View(vm);
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