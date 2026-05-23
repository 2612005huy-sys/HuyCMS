// =========================================================================
// 👤 Sinh viên: Triệu Quốc Huy | MSSV: 2123110151
// 📅 Ngày tạo/cập nhật: 23/05/2026
// 📝 Chức năng: FILE HOÀN CHỈNH - Điều hướng Quản lý Khách hàng (CRUD)
// =========================================================================

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using CMS.Data;
using CMS.Data.Entities;
using System.Linq;

namespace CMS.Backend.Controllers
{
    [Authorize]
    public class CustomerController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CustomerController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: /Customer/Index
        public IActionResult Index()
        {
            var customers = _context.Customers.OrderByDescending(c => c.Id).ToList();
            return View(customers);
        }

        // GET: /Customer/Create
        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        // POST: /Customer/Create
        [HttpPost]
        public IActionResult Create(Customer model)
        {
            if (ModelState.IsValid)
            {
                _context.Customers.Add(model);
                _context.SaveChanges();
                TempData["SuccessMessage"] = "Thêm mới tài khoản khách hàng thành công!";
                return RedirectToAction("Index");
            }
            return View(model);
        }

        // GET: /Customer/Edit/5
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var customer = _context.Customers.Find(id);
            if (customer == null) return NotFound();
            return View(customer);
        }

        // POST: /Customer/Edit/5
        [HttpPost]
        public IActionResult Edit(Customer model)
        {
            if (ModelState.IsValid)
            {
                _context.Customers.Update(model);
                _context.SaveChanges();
                TempData["SuccessMessage"] = "Cập nhật hồ sơ khách hàng thành công!";
                return RedirectToAction("Index");
            }
            return View(model);
        }

        // GET: /Customer/Delete/5
        public IActionResult Delete(int id)
        {
            // Bảo vệ dữ liệu: Nếu khách hàng đã có đơn hàng đặt thì không được xóa bừa bãi
            bool hasOrders = _context.Orders.Any(o => o.CustomerId == id);
            if (hasOrders)
            {
                TempData["ErrorMessage"] = "Không thể xóa khách hàng này vì thông tin lịch sử mua hàng của họ đang gắn liền với các đơn hàng trên hệ thống!";
                return RedirectToAction("Index");
            }

            var customer = _context.Customers.Find(id);
            if (customer != null)
            {
                _context.Customers.Remove(customer);
                _context.SaveChanges();
                TempData["SuccessMessage"] = "Đã xóa tài khoản khách hàng thành công!";
            }
            return RedirectToAction("Index");
        }
    }
}