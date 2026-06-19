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
    // 🔒 CHỈ cho phép tài khoản Admin và Editor vào quản lý danh sách khách hàng.
    // ❌ Tài khoản nhóm "User" thông thường truy cập sẽ bị đá sang trang 403 ngay lập tức!
    [Authorize(Roles = "Admin,Editor")]
    public class CustomerController(ApplicationDbContext context) : Controller
    {
        private readonly ApplicationDbContext _context = context;

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

        [HttpPost]
        [AllowAnonymous]
        [Route("/api/customers/login")]
        public IActionResult LoginApi([FromBody] LoginRequest loginModel)
        {
            if (loginModel == null || string.IsNullOrEmpty(loginModel.Email) || string.IsNullOrEmpty(loginModel.Password))
            {
                return BadRequest("Invalid credentials format");
            }

            var customer = _context.Customers.FirstOrDefault(c => c.Email == loginModel.Email && c.Password == loginModel.Password);
            if (customer == null)
            {
                return Unauthorized();
            }
            
            return Ok(new { 
                id = customer.Id, 
                name = customer.FullName, 
                email = customer.Email 
            });
        }

        // =========================================================================
        // 🌟 API ĐĂNG KÝ TÀI KHOẢN CHO REACTJS
        // =========================================================================
        [HttpPost]
        [AllowAnonymous]
        [Route("/api/customers/register")]
        public IActionResult RegisterApi([FromBody] RegisterRequest registerModel)
        {
            if (registerModel == null || string.IsNullOrEmpty(registerModel.Email) || string.IsNullOrEmpty(registerModel.Password) || string.IsNullOrEmpty(registerModel.FullName))
            {
                return BadRequest(new { message = "Vui lòng điền đầy đủ họ tên, email và mật khẩu!" });
            }

            // Kiểm tra email đã tồn tại
            bool emailExists = _context.Customers.Any(c => c.Email == registerModel.Email);
            if (emailExists)
            {
                return Conflict(new { message = "Email này đã được đăng ký. Vui lòng dùng email khác!" });
            }

            var newCustomer = new Customer
            {
                FullName = registerModel.FullName,
                Email = registerModel.Email,
                Phone = registerModel.Phone,
                Address = registerModel.Address,
                Password = registerModel.Password
            };

            _context.Customers.Add(newCustomer);
            _context.SaveChanges();

            return Ok(new {
                id = newCustomer.Id,
                name = newCustomer.FullName,
                email = newCustomer.Email
            });
        }

        // =========================================================================
        // 🌟 API LẤY LỊCH SỬ ĐƠN HÀNG CỦA MỘT KHÁCH HÀNG
        // =========================================================================
        [HttpGet]
        [AllowAnonymous]
        [Route("/api/customers/{id}/orders")]
        public IActionResult GetCustomerOrders(int id)
        {
            var orders = _context.Orders
                .Include(o => o.OrderDetails)
                    .ThenInclude(d => d.Product)
                .Where(o => o.CustomerId == id)
                .OrderByDescending(o => o.Id)
                .Select(o => new
                {
                    id = o.Id,
                    orderDate = o.OrderDate.ToString("dd/MM/yyyy HH:mm"),
                    status = o.Status,
                    itemCount = o.OrderDetails.Count,
                    totalAmount = o.OrderDetails.Sum(d => d.Quantity * d.UnitPrice),
                    details = o.OrderDetails.Select(d => new
                    {
                        productName = d.Product.Name,
                        imageUrl = d.Product.ImageUrl
                    }).ToList()
                })
                .ToList();

            return Ok(orders);
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("/api/customers")]
        public IActionResult GetAllCustomersApi()
        {
            var customers = _context.Customers
                .Select(c => new {
                    c.Id,
                    c.FullName,
                    c.Email,
                    c.Phone,
                    c.Address
                })
                .ToList();
            return Ok(customers);
        }
    }

    public class LoginRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class RegisterRequest
    {
        public string FullName { get; set; }
        public string Email { get; set; }
        public string? Phone { get; set; }
        public string? Address { get; set; }
        public string Password { get; set; }
    }
}