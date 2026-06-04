using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Security.Claims;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using CMS.Data;

namespace CMS.Backend.Controllers
{
    public class AccountController : Controller
    {
        private readonly ApplicationDbContext _context;

        public AccountController(ApplicationDbContext context)
        {
            _context = context;
        }

        // [GET]: Hiển thị trang đăng nhập
        [HttpGet]
        public IActionResult Login()
        {
            // Nếu người dùng đã đăng nhập rồi thì cho thẳng vào trang chủ luôn
            if (User.Identity.IsAuthenticated)
            {
                return RedirectToAction("Index", "Home");
            }
            return View();
        }

        // [POST]: Xử lý logic kiểm tra tài khoản và tự động điều hướng theo quyền hạn
        [HttpPost]
        public async Task<IActionResult> Login(string username, string password)
        {
            // 1. Đối soát tài khoản thô trực tiếp trong bảng Users của Database
            var user = _context.Users.FirstOrDefault(u => u.Username == username && u.PasswordHash == password);

            if (user != null)
            {
                // 2. Thiết lập các thông tin Claims đi kèm thẻ bài
                var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, user.Username),
                    new Claim(ClaimTypes.Role, user.Role), // Lưu vai trò cốt lõi: Admin hoặc Editor
                    new Claim("FullName", user.FullName)   // Lưu tên hiển thị ra màn hình
                };

                var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

                // 3. Tiến hành ký tên, đăng nhập và nạp file Cookie mã hóa vào trình duyệt người dùng
                await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(claimsIdentity));

                // =========================================================================
                // 🌟 ĐOẠN ĐIỀU HƯỚNG TỰ ĐỘNG THEO VAI TRÒ (CHỈNH SỬA TẠI ĐÂY)
                // =========================================================================
                if (user.Role == "Admin")
                {
                    // Nếu là Admin -> Tự động đưa thẳng vào khu vực quản trị bài viết
                    return RedirectToAction("Index", "Post");
                }
                else
                {
                    // Nếu không phải Admin (Khách hàng/Editor) -> Đưa ra trang chủ ngoài
                    return RedirectToAction("Index", "Home");
                }
                // =========================================================================
            }

            // Nếu sai tài khoản, thông báo lỗi ra giao diện
            ViewBag.Error = "Tên đăng nhập hoặc mật khẩu không chính xác!";
            return View();
        }

        // [GET]: Xử lý đăng xuất hệ thống
        public async Task<IActionResult> Logout()
        {
            // Thu hồi và quét sạch file Cookie khỏi trình duyệt
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return RedirectToAction("Login");
        }

        // [GET]: Hiển thị trang chặn truy cập khi sai quyền hạn
        [HttpGet]
        public IActionResult AccessDenied()
        {
            return View();
        }
    }
}