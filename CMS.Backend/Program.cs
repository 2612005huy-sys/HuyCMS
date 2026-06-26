using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.Cookies;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.AddScoped<CMS.Backend.Services.IEmailService, CMS.Backend.Services.EmailService>();

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

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "HuyCMS API",
        Version = "v1",
        Description = "Hệ thống tài liệu API backend dành cho HuyCMS (React Frontend & Admin Dashboard)"
    });
    
    // Chỉ lấy những endpoint có chứa chữ "api/" để hiển thị lên Swagger (Loại bỏ các giao diện MVC)
    c.DocInclusionPredicate((docName, apiDesc) =>
    {
        return apiDesc.RelativePath != null && 
               (apiDesc.RelativePath.StartsWith("api/") || apiDesc.RelativePath.StartsWith("/api/"));
    });
});

// Tiến hành Build ứng dụng (Tất cả dịch vụ phía trên đã được đóng gói)
var app = builder.Build();

// =========================================================================
// 🌟 TỰ ĐỘNG CẬP NHẬT DATABASE (Thay thế Migration thủ công)
// =========================================================================
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<CMS.Data.ApplicationDbContext>();
    try
    {
        db.Database.ExecuteSqlRaw(@"
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Colors' and xtype='U')
            BEGIN
                CREATE TABLE Colors (
                    Id int IDENTITY(1,1) PRIMARY KEY,
                    Name nvarchar(max) NOT NULL,
                    HexCode nvarchar(max) NOT NULL
                );
            END

            IF COL_LENGTH('Products', 'ColorId') IS NULL
            BEGIN
                ALTER TABLE Products ADD ColorId int NULL;
                ALTER TABLE Products ADD CONSTRAINT FK_Products_Colors_ColorId FOREIGN KEY (ColorId) REFERENCES Colors(Id);
            END

            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='ProductColors' and xtype='U')
            BEGIN
                CREATE TABLE ProductColors (
                    ProductId int NOT NULL,
                    ColorId int NOT NULL,
                    PRIMARY KEY (ProductId, ColorId),
                    CONSTRAINT FK_ProductColors_Products_ProductId FOREIGN KEY (ProductId) REFERENCES Products(Id) ON DELETE CASCADE,
                    CONSTRAINT FK_ProductColors_Colors_ColorId FOREIGN KEY (ColorId) REFERENCES Colors(Id) ON DELETE CASCADE
                );
            END

            IF COL_LENGTH('ProductColors', 'ImageUrl') IS NULL
            BEGIN
                ALTER TABLE ProductColors ADD ImageUrl NVARCHAR(MAX) NULL;
            END

            IF COL_LENGTH('Products', 'IsDeleted') IS NULL
            BEGIN
                ALTER TABLE Products ADD IsDeleted BIT NOT NULL DEFAULT 0;
            END

            IF COL_LENGTH('Posts', 'IsDeleted') IS NULL
            BEGIN
                ALTER TABLE Posts ADD IsDeleted BIT NOT NULL DEFAULT 0;
            END

            IF COL_LENGTH('Products', 'VariantInventories') IS NULL
            BEGIN
                ALTER TABLE Products ADD VariantInventories NVARCHAR(MAX) NULL;
            END
        ");
    }
    catch (Exception ex)
    {
        Console.WriteLine("" + ex.Message);
    }
}

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}
// Enable Swagger in all environments so developers/testers can easily view and test APIs
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "HuyCMS API v1");
    c.RoutePrefix = "swagger"; // Access via http://localhost:PORT/swagger
});

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

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();