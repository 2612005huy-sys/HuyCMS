using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.Cookies;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

// 1. Cấu hình kết nối SQL Server
builder.Services.AddDbContext<CMS.Data.ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// 2. Khai báo dịch vụ xác thực Cookie (Buổi 5)
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/Account/Login";               // Chưa đăng nhập sẽ bị đẩy về đây
        options.AccessDeniedPath = "/Account/AccessDenied"; // Sai quyền hạn sẽ bị chặn ở đây
    });

// 🌟 BẢO MẬT BUỔI 6: Khai báo chính sách CORS (Đã đưa lên trước builder.Build)
builder.Services.AddCors(options => {
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Tiến hành Build ứng dụng (Tất cả dịch vụ phía trên đã được đóng gói)
var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

// Kích hoạt định tuyến đường dẫn
app.UseRouting();

// 🌟 BẢO MẬT BUỔI 6: Kích hoạt cấu hình CORS (Đặt ngay sau UseRouting)
app.UseCors("AllowAll");

// =========================================================================
// 🌟 THIẾT LẬP THỨ TỰ MIDDLEWARE BẢO MẬT (Đã loại bỏ trùng lặp)
// =========================================================================
app.UseAuthentication(); // Bước 1: Xác nhận danh tính "Anh là ai?" (Cookie/Token)
app.UseAuthorization();  // Bước 2: Xác nhận quyền hạn "Anh được làm gì?" (Admin/Editor)
// =========================================================================

app.MapControllers(); // 🌟 Định tuyến cho các API Controller sử dụng Attribute Routing

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();