// =========================================================================
// 👤 Sinh viên: Triệu Quốc Huy | MSSV: 2123110151
// 📅 Ngày tạo/cập nhật: 23/05/2026
// 📝 Chức năng: FILE TỐI ƯU HOÀN CHỈNH - Quản lý thành viên hệ thống (CRUD)
// =========================================================================

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization; // 🌟 Thư viện bắt buộc để dùng thuộc tính khóa bảo mật
using CMS.Data;
using CMS.Data.Entities;
using System.Linq;

namespace CMS.Backend.Controllers
{
    // 🔒 Ổ KHÓA TỐI CAO: CHỈ tài khoản có vai trò chính xác là "Admin" mới được mở cửa vào đây.
    // ❌ Cả Editor và User thường khi bấm vào đây đều sẽ bị đẩy sang trang báo lỗi 403!
    [Authorize(Roles = "Admin")]
    public class UserController(ApplicationDbContext context) : Controller
    {
        private readonly ApplicationDbContext _context = context;

        // Hiển thị danh sách thành viên hệ thống
        public IActionResult Index()
        {
            var users = _context.Users.ToList();
            return View(users);
        }

        // TẠO MỚI USER (GET)
        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        // TẠO MỚI USER (POST) + KIỂM TRA TRÙNG TÊN ĐĂNG NHẬP
        [HttpPost]
        public IActionResult Create(User model)
        {
            var checkExist = _context.Users.Any(u => u.Username == model.Username);
            if (checkExist)
            {
                ModelState.AddModelError("Username", "Tên đăng nhập này đã có người dùng trong hệ thống!");
                return View(model);
            }

            _context.Users.Add(model);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }

        // CHỈNH SỬA USER (GET)
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var user = _context.Users.Find(id);
            if (user == null) return NotFound();
            return View(user);
        }

        // CHỈNH SỬA USER (POST) + XỬ LÝ GIỮ NGUYÊN MẬT KHẨU CŨ NẾU ĐỂ TRỐNG
        [HttpPost]
        public IActionResult Edit(User model, string NewPassword)
        {
            var existingUser = _context.Users.AsNoTracking().FirstOrDefault(u => u.Id == model.Id);
            if (existingUser == null) return NotFound();

            if (!string.IsNullOrEmpty(NewPassword))
            {
                model.PasswordHash = NewPassword; // Gán mật khẩu mới nhập
            }
            else
            {
                model.PasswordHash = existingUser.PasswordHash; // Giữ nguyên mật khẩu cũ trong DB để tránh bị đè thành rỗng
            }

            _context.Users.Update(model);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }

        // XÓA TÀI KHOẢN THÀNH VIÊN
        public IActionResult Delete(int id)
        {
            var user = _context.Users.Find(id);
            if (user != null)
            {
                _context.Users.Remove(user);
                _context.SaveChanges();
            }
            return RedirectToAction("Index");
        }

        // =========================================================================
        // 🌟 CÁC CỔNG API TRẢ VỀ DỮ LIỆU JSON (PHỤC VỤ REACTJS / SWAGGER)
        // =========================================================================
        [HttpGet]
        [Route("/api/users")]
        public IActionResult GetUsersApi()
        {
            var users = _context.Users
                .Select(u => new {
                    u.Id,
                    u.Username,
                    u.FullName,
                    u.Role
                })
                .ToList();
            return Ok(users);
        }
    }
}