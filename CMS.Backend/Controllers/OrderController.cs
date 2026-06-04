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
    [Authorize] // 🔒 Ổ khóa bảo mật ban quản trị Admin
    public class OrderController : Controller
    {
        private readonly ApplicationDbContext _context;

        public OrderController(ApplicationDbContext context)
        {
            _context = context;
        }

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
    }
}