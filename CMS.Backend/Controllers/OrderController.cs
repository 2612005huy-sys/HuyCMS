using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace CMS.Backend.Controllers
{
    public class OrderController : Controller
    {
        private readonly ApplicationDbContext _context;

        public OrderController(ApplicationDbContext context)
        {
            _context = context;
        }

        // BÀI TẬP 6: Liệt kê danh sách đơn hàng
        public IActionResult Index()
        {
            var orders = _context.Orders.ToList();
            return View(orders);
        }

        // BÀI TẬP 7: Xem chi tiết của một đơn hàng cụ thể
        public IActionResult Details(int id)
        {
            var orderDetails = _context.OrderDetails
                                      .Where(d => d.OrderId == id)
                                      .ToList();

            ViewBag.OrderId = id;
            return View(orderDetails);
        }
    }
}