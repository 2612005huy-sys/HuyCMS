using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;
using System.Linq;

namespace CMS.Backend.Controllers
{
    public class UserController : Controller
    {
        private readonly ApplicationDbContext _context;

        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

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
                model.PasswordHash = existingUser.PasswordHash; // Giữ nguyên mật khẩu cũ trong DB
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
    }
}