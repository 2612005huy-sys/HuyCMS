// =========================================================================
// 👤 Sinh viên: Triệu Quốc Huy | MSSV: 2123110151
// 📅 Ngày tạo/cập nhật: 23/05/2026
// 📝 Chức năng: FILE TỐI ƯU HOÀN CHỈNH - Quản lý đơn hàng (Tích hợp cập nhật nhanh)
// =========================================================================

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using CMS.Data;
using CMS.Data.Entities;
using System;
using System.Linq;

namespace CMS.Backend.Controllers
{
    // 🔒 CHỈ cho phép tài khoản Admin và Editor vào xem, quản lý, xử lý đơn hàng.
    // ❌ Tài khoản nhóm "User" thường truy cập sẽ bị đá sang trang 403 ngay lập tức!
    [Authorize(Roles = "Admin,Editor")]
    public class OrderController(ApplicationDbContext context) : Controller
    {
        private readonly ApplicationDbContext _context = context;

        // 1. GET: /Order/Index (Trang hiển thị danh sách đơn hàng toàn hệ thống)
        [HttpGet]
        public IActionResult Index()
        {
            var orders = _context.Orders
                .Include(o => o.Customer)
                .OrderByDescending(o => o.Id)
                .ToList();

            return View(orders);
        }

        // 2. GET: /Order/Edit/5 (Giao diện form xử lý cập nhật đơn và viết ghi chú nâng cao)
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var order = _context.Orders
                .Include(o => o.Customer)
                .FirstOrDefault(o => o.Id == id);

            if (order == null)
            {
                return NotFound();
            }
            return View(order);
        }

        // 3. POST: /Order/Edit/5 (Xử lý lưu dữ liệu POST từ form Edit gửi lên)
        [HttpPost]
        public IActionResult Edit(Order model)
        {
            var existingOrder = _context.Orders.Find(model.Id);

            if (existingOrder != null)
            {
                try
                {
                    // Cập nhật trạng thái và ghi chú nội bộ do Huy chọn ngoài form
                    existingOrder.Status = model.Status;
                    existingOrder.Notes = model.Notes;

                    _context.Orders.Update(existingOrder);
                    _context.SaveChanges();

                    TempData["SuccessMessage"] = "Cập nhật thông tin và trạng thái đơn hàng thành công!";
                    return RedirectToAction("Index");
                }
                catch (Exception ex)
                {
                    ModelState.AddModelError("", "Lỗi hệ thống khi cập nhật cơ sở dữ liệu: " + ex.Message);
                }
            }
            else
            {
                TempData["ErrorMessage"] = "Đơn hàng này không còn tồn tại trên hệ thống!";
                return RedirectToAction("Index");
            }

            model.Customer = _context.Customers.Find(model.CustomerId);
            return View(model);
        }

        // 4. 🌟 TÍNH NĂNG ĐỒNG BỘ: Xử lý cập nhật trạng thái nhanh khi bấm nút ngoài trang Index
        // GET: /Order/UpdateStatus?id=4&status=1
        [HttpGet]
        public IActionResult UpdateStatus(int id, int status)
        {
            var order = _context.Orders.Find(id);

            if (order != null)
            {
                try
                {
                    // Đè trạng thái mới được truyền từ thẻ định tuyến <a> ngoài Index
                    order.Status = status;

                    _context.Orders.Update(order);
                    _context.SaveChanges();

                    TempData["SuccessMessage"] = $"Đã cập nhật nhanh trạng thái đơn hàng #{id} thành công!";
                }
                catch (Exception ex)
                {
                    TempData["ErrorMessage"] = "Lỗi cập nhật nhanh hệ thống: " + ex.Message;
                }
            }
            else
            {
                TempData["ErrorMessage"] = "Không tìm thấy hóa đơn mã số yêu cầu!";
            }

            // Điều hướng quay ngược lại trang bảng danh sách đơn hàng ngay lập tức
            return RedirectToAction("Index");
        }

        // 5. GET: /Order/Delete/5 (Hủy bỏ và xóa hoàn toàn hóa đơn)
        public IActionResult Delete(int id)
        {
            var order = _context.Orders.Find(id);
            if (order != null)
            {
                _context.Orders.Remove(order);
                _context.SaveChanges();
                TempData["SuccessMessage"] = "Đã hủy và xóa bỏ đơn hàng khỏi danh sách quản trị thành công!";
            }
            return RedirectToAction("Index");
        }

        // =========================================================================
        // 🌟 API TẠO ĐƠN HÀNG TỪ REACTJS FRONTEND
        // =========================================================================
        [HttpPost]
        [AllowAnonymous]
        [Route("/api/orders")]
        public IActionResult CreateOrderApi([FromBody] CreateOrderRequest request)
        {
            if (request == null || request.OrderDetails == null || !request.OrderDetails.Any())
            {
                return BadRequest("Dữ liệu đơn hàng không hợp lệ");
            }

            int customerId = 0;

            // Xử lý Khách hàng đã đăng nhập
            if (request.CustomerId.HasValue && request.CustomerId.Value > 0)
            {
                customerId = request.CustomerId.Value;
                // Cập nhật thông tin giao hàng mới nhất vào hồ sơ khách hàng
                var cust = _context.Customers.Find(customerId);
                if (cust != null)
                {
                    cust.FullName = request.CustomerName ?? cust.FullName;
                    cust.Phone = request.Phone ?? cust.Phone;
                    cust.Address = request.Address ?? cust.Address;
                    _context.Customers.Update(cust);
                }
            }
            else
            {
                // Khách vãng lai: Tạo tài khoản tạm thời để lưu đơn
                var newCust = new Customer
                {
                    FullName = string.IsNullOrEmpty(request.CustomerName) ? "Khách vãng lai" : request.CustomerName,
                    Phone = request.Phone,
                    Address = request.Address,
                    Email = $"guest_{Guid.NewGuid().ToString().Substring(0, 8)}@nexus.tech",
                    Password = "guest"
                };
                _context.Customers.Add(newCust);
                _context.SaveChanges();
                customerId = newCust.Id;
            }

            // Tạo đơn hàng chính
            var order = new Order
            {
                CustomerId = customerId,
                OrderDate = DateTime.Now,
                Status = 0, // 0 = Chờ duyệt
                Notes = request.Notes
            };

            _context.Orders.Add(order);
            _context.SaveChanges(); // Lấy được Order.Id

            // Tạo chi tiết đơn hàng và trừ tồn kho
            foreach (var item in request.OrderDetails)
            {
                var detail = new OrderDetail
                {
                    OrderId = order.Id,
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                    UnitPrice = item.Price
                };
                _context.OrderDetails.Add(detail);

                // Trừ số lượng tồn kho của sản phẩm
                var product = _context.Products.Find(item.ProductId);
                if (product != null)
                {
                    product.StockQuantity -= item.Quantity;
                    if (product.StockQuantity < 0)
                    {
                        product.StockQuantity = 0; // Đảm bảo tồn kho không bị âm
                    }
                    _context.Products.Update(product);
                }
            }
            _context.SaveChanges();

            return Ok(new { id = order.Id, message = "Đặt hàng thành công!" });
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("/api/orders/all")]
        public IActionResult GetAllOrdersApi()
        {
            var orders = _context.Orders
                .Select(o => new {
                    o.Id,
                    o.CustomerId,
                    o.OrderDate,
                    o.Status,
                    o.Notes
                })
                .ToList();
            return Ok(orders);
        }
    }

    // Các class DTO nhận dữ liệu JSON từ React gửi lên
    public class CreateOrderRequest
    {
        public int? CustomerId { get; set; }
        public string? CustomerName { get; set; }
        public string? Phone { get; set; }
        public string? Address { get; set; }
        public string? Notes { get; set; }
        public List<CreateOrderDetailRequest>? OrderDetails { get; set; }
    }

    public class CreateOrderDetailRequest
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
    }
}