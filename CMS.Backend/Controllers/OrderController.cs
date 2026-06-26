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
    public class OrderController(ApplicationDbContext context, CMS.Backend.Services.IEmailService emailService, Microsoft.Extensions.Configuration.IConfiguration config) : Controller
    {
        private readonly ApplicationDbContext _context = context;
        private readonly CMS.Backend.Services.IEmailService _emailService = emailService;
        private readonly Microsoft.Extensions.Configuration.IConfiguration _config = config;

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

            // Lưu HTML cho chi tiết đơn hàng
            decimal totalAmount = 0;
            var orderHtmlBuilder = new System.Text.StringBuilder();
            orderHtmlBuilder.Append("<table style='width: 100%; border-collapse: collapse; margin-top: 15px; font-family: sans-serif;'>");
            orderHtmlBuilder.Append("<thead><tr style='background-color: #f8fafc;'><th style='padding: 12px; border: 1px solid #e2e8f0; text-align: left;'>Sản phẩm</th><th style='padding: 12px; border: 1px solid #e2e8f0; text-align: center;'>SL</th><th style='padding: 12px; border: 1px solid #e2e8f0; text-align: right;'>Đơn giá</th><th style='padding: 12px; border: 1px solid #e2e8f0; text-align: right;'>Thành tiền</th></tr></thead>");
            orderHtmlBuilder.Append("<tbody>");

            // Tạo chi tiết đơn hàng và trừ tồn kho
            foreach (var item in request.OrderDetails)
            {
                var detail = new OrderDetail
                {
                    OrderId = order.Id,
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                    UnitPrice = item.Price,
                    Color = item.Color,
                    StorageCapacity = item.StorageCapacity
                };
                _context.OrderDetails.Add(detail);

                // Trừ số lượng tồn kho của sản phẩm
                var product = _context.Products.Find(item.ProductId);

                // Thêm vào HTML email
                string productName = product != null ? product.Name : $"Sản phẩm #{item.ProductId}";
                string variantInfo = "";
                if (!string.IsNullOrEmpty(item.Color)) variantInfo += $"Màu: {item.Color}";
                if (!string.IsNullOrEmpty(item.StorageCapacity)) variantInfo += (variantInfo != "" ? " - " : "") + $"Bản: {item.StorageCapacity}";
                if (variantInfo != "") variantInfo = $"<br><small style='color: #64748b;'>{variantInfo}</small>";

                decimal itemTotal = item.Quantity * item.Price;
                totalAmount += itemTotal;

                orderHtmlBuilder.Append("<tr>");
                orderHtmlBuilder.Append($"<td style='padding: 12px; border: 1px solid #e2e8f0;'><b>{productName}</b>{variantInfo}</td>");
                orderHtmlBuilder.Append($"<td style='padding: 12px; border: 1px solid #e2e8f0; text-align: center;'>{item.Quantity}</td>");
                orderHtmlBuilder.Append($"<td style='padding: 12px; border: 1px solid #e2e8f0; text-align: right;'>{item.Price:N0}đ</td>");
                orderHtmlBuilder.Append($"<td style='padding: 12px; border: 1px solid #e2e8f0; text-align: right; font-weight: bold;'>{itemTotal:N0}đ</td>");
                orderHtmlBuilder.Append("</tr>");

                if (product != null)
                {
                    product.StockQuantity -= item.Quantity;
                    if (product.StockQuantity < 0)
                    {
                        product.StockQuantity = 0; // Đảm bảo tồn kho không bị âm
                    }

                    // Trừ tồn kho biến thể nếu có
                    if (!string.IsNullOrEmpty(product.VariantInventories))
                    {
                        try
                        {
                            var options = new System.Text.Json.JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                            var variants = System.Text.Json.JsonSerializer.Deserialize<List<VariantInventoryItem>>(product.VariantInventories, options);
                            if (variants != null)
                            {
                                int? colorId = null;
                                if (!string.IsNullOrEmpty(item.Color))
                                {
                                    var dbColor = _context.Colors.FirstOrDefault(c => c.Name == item.Color);
                                    if (dbColor != null) colorId = dbColor.Id;
                                }

                                var targetVariant = variants.FirstOrDefault(v => 
                                    (colorId == null || v.ColorId == colorId) && 
                                    (string.IsNullOrEmpty(item.StorageCapacity) || v.Storage == item.StorageCapacity));

                                if (targetVariant != null)
                                {
                                    targetVariant.Stock -= item.Quantity;
                                    if (targetVariant.Stock < 0) targetVariant.Stock = 0;
                                    product.VariantInventories = System.Text.Json.JsonSerializer.Serialize(variants, options);
                                }
                            }
                        }
                        catch (Exception ex)
                        {
                            Console.WriteLine("Lỗi khi trừ tồn kho biến thể: " + ex.Message);
                        }
                    }

                    _context.Products.Update(product);
                }
            }
            _context.SaveChanges();

            // Hoàn thiện HTML email
            orderHtmlBuilder.Append("</tbody>");
            orderHtmlBuilder.Append($"<tfoot><tr><td colspan='3' style='padding: 12px; border: 1px solid #e2e8f0; text-align: right; font-weight: bold;'>Tổng cộng:</td><td style='padding: 12px; border: 1px solid #e2e8f0; text-align: right; font-weight: bold; color: #ef4444; font-size: 1.1em;'>{totalAmount:N0}đ</td></tr></tfoot>");
            orderHtmlBuilder.Append("</table>");

            string orderDetailsHtml = orderHtmlBuilder.ToString();
            string statusText = "Chờ duyệt";
            string notesText = string.IsNullOrEmpty(request.Notes) ? "Không có" : request.Notes;

            string customerInfoHtml = $@"
            <div style='background-color: #f8fafc; padding: 15px; border-radius: 8px; margin-top: 15px; border: 1px solid #e2e8f0; font-family: sans-serif;'>
                <h3 style='margin-top: 0; color: #334155;'>Thông tin giao hàng</h3>
                <p style='margin: 5px 0;'><b>Khách hàng:</b> {request.CustomerName}</p>
                <p style='margin: 5px 0;'><b>Số điện thoại:</b> {request.Phone}</p>
                <p style='margin: 5px 0;'><b>Địa chỉ:</b> {request.Address}</p>
                <p style='margin: 5px 0;'><b>Ghi chú:</b> {notesText}</p>
                <p style='margin: 5px 0;'><b>Trạng thái đơn hàng:</b> <span style='background-color: #fef08a; color: #854d0e; padding: 4px 8px; border-radius: 4px; font-weight: bold;'>{statusText}</span></p>
            </div>";

            // Gửi email cho khách hàng
            var customer = _context.Customers.Find(customerId);
            if (customer != null && !string.IsNullOrEmpty(customer.Email))
            {
                var emailSubject = $"HuyCMS - Đặt hàng thành công đơn hàng #{order.Id}";
                var emailBody = $@"
                <div style='font-family: sans-serif; color: #334155; line-height: 1.6; max-width: 600px; margin: 0 auto;'>
                    <p>Chào <b>{customer.FullName}</b>,</p>
                    <p>Đơn hàng <b>#{order.Id}</b> của bạn đã được ghi nhận vào hệ thống thành công lúc {order.OrderDate:dd/MM/yyyy HH:mm}.</p>
                    {customerInfoHtml}
                    <h3 style='margin-bottom: 5px; margin-top: 25px; color: #334155;'>Chi tiết đơn hàng</h3>
                    {orderDetailsHtml}
                    <p style='margin-top: 20px;'>Cảm ơn bạn đã mua sắm tại HuyCMS Store! Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất để xác nhận.</p>
                </div>";
                try {
                    _emailService.SendEmailAsync(customer.Email, emailSubject, emailBody).Wait();
                } catch {}
            }

            // Gửi email thông báo cho Chủ shop (Admin)
            var adminEmail = _config["EmailSettings:SenderEmail"];
            if (!string.IsNullOrEmpty(adminEmail))
            {
                var adminSubject = $"[HuyCMS] Có đơn hàng mới - Đơn hàng #{order.Id}";
                var adminBody = $@"
                <div style='font-family: sans-serif; color: #334155; line-height: 1.6; max-width: 600px; margin: 0 auto;'>
                    <h2 style='color: #2563eb; margin-top: 0;'>Có đơn đặt hàng mới!</h2>
                    <p>Hệ thống vừa nhận được một đơn đặt hàng mới lúc {order.OrderDate:dd/MM/yyyy HH:mm}.</p>
                    <p><b>Mã đơn hàng:</b> #{order.Id}</p>
                    {customerInfoHtml}
                    <h3 style='margin-bottom: 5px; margin-top: 25px; color: #334155;'>Chi tiết sản phẩm khách đặt</h3>
                    {orderDetailsHtml}
                    <p style='margin-top: 20px; text-align: center;'>
                        <a href='https://localhost:7005/Order/Edit/{order.Id}' style='display: inline-block; background-color: #2563eb; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;'>Xem trong trang quản trị</a>
                    </p>
                </div>";
                try {
                    _emailService.SendEmailAsync(adminEmail, adminSubject, adminBody).Wait();
                } catch {}
            }

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

    public class VariantInventoryItem
    {
        public int ColorId { get; set; }
        public string? Storage { get; set; }
        public int Stock { get; set; }
        public decimal PriceDifference { get; set; }
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
        public string? Color { get; set; }
        public string? StorageCapacity { get; set; }
    }
}