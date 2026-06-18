using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;
using System;
using System.Linq;
using System.Collections.Generic;

namespace CMS.Backend.Controllers
{
    [ApiController]
    [Route("api")]
    public class ApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ApiController(ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================================================================
        // 1. CỤM API BÀI VIẾT & TIN TỨC (POSTS API)
        // =========================================================================
        
        [HttpGet("posts")]
        public IActionResult GetPosts()
        {
            var posts = _context.Posts
                .Include(p => p.Category)
                .OrderByDescending(p => p.Id)
                .Select(p => new {
                    p.Id,
                    p.Title,
                    Summary = p.Content != null && p.Content.Length > 100 ? p.Content.Substring(0, 100) + "..." : p.Content,
                    p.Content,
                    CreatedDate = p.CreatedDate.ToString("dd/MM/yyyy"),
                    p.ImageUrl,
                    CategoryName = p.Category != null ? p.Category.Name : "Chưa phân loại"
                })
                .ToList();
            return Ok(posts);
        }

        [HttpGet("posts/{id}")]
        public IActionResult GetPostDetail(int id)
        {
            var post = _context.Posts
                .Include(p => p.Category)
                .FirstOrDefault(p => p.Id == id);
            if (post == null)
            {
                return NotFound(new { message = "Không tìm thấy bài viết" });
            }
            return Ok(new {
                post.Id,
                post.Title,
                Summary = post.Content != null && post.Content.Length > 100 ? post.Content.Substring(0, 100) + "..." : post.Content,
                post.Content,
                CreatedDate = post.CreatedDate.ToString("dd/MM/yyyy"),
                post.ImageUrl,
                CategoryName = post.Category != null ? post.Category.Name : "Chưa phân loại"
            });
        }

        // =========================================================================
        // 2. CỤM API DANH MỤC SẢN PHẨM (CATEGORIES PRODUCTS API)
        // =========================================================================
        
        [HttpGet("CategoriesProducts")]
        public IActionResult GetCategoriesProducts()
        {
            var categories = _context.CategoryProducts
                .Select(c => new {
                    c.Id,
                    c.Name,
                    c.Description
                })
                .ToList();
            return Ok(categories);
        }

        // =========================================================================
        // 3. CỤM API SẢN PHẨM THỜI TRANG (PRODUCTS API)
        // =========================================================================
        
        [HttpGet("products/category/{categoryId}")]
        public IActionResult GetProductsByCategory(int categoryId)
        {
            var products = _context.Products
                .Include(p => p.CategoryProduct)
                .Where(p => p.CategoryProductId == categoryId)
                .OrderByDescending(p => p.Id)
                .Select(p => new {
                    p.Id,
                    p.Name,
                    p.Description,
                    p.Price,
                    p.StockQuantity,
                    p.ImageUrl,
                    p.CategoryProductId,
                    CategoryName = p.CategoryProduct != null ? p.CategoryProduct.Name : "Chưa phân loại"
                })
                .ToList();
            return Ok(products);
        }

        [HttpGet("products/{id}")]
        public IActionResult GetProductDetail(int id)
        {
            var product = _context.Products
                .Include(p => p.CategoryProduct)
                .FirstOrDefault(p => p.Id == id);
            if (product == null)
            {
                return NotFound(new { message = "Không tìm thấy sản phẩm" });
            }
            return Ok(new {
                product.Id,
                product.Name,
                product.Description,
                product.Price,
                product.StockQuantity,
                product.ImageUrl,
                product.CategoryProductId,
                CategoryName = product.CategoryProduct != null ? product.CategoryProduct.Name : "Chưa phân loại"
            });
        }

        // =========================================================================
        // 4. CỤM API KHÁCH HÀNG & XÁC THỰC (CUSTOMERS & AUTHENTICATION API)
        // =========================================================================
        
        public class LoginRequest
        {
            public string Email { get; set; }
            public string Password { get; set; }
        }

        [HttpPost("customers/login")]
        public IActionResult CustomerLogin([FromBody] LoginRequest request)
        {
            if (request == null || string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
            {
                return BadRequest(new { message = "Vui lòng điền email và mật khẩu" });
            }

            var customer = _context.Customers
                .FirstOrDefault(c => c.Email == request.Email && c.Password == request.Password);

            if (customer == null)
            {
                return Unauthorized(new { message = "Email hoặc mật khẩu không chính xác" });
            }

            return Ok(new {
                customer.Id,
                Name = customer.FullName,
                customer.Email,
                customer.Phone,
                customer.Address
            });
        }

        public class RegisterRequest
        {
            public string FullName { get; set; }
            public string Email { get; set; }
            public string Phone { get; set; }
            public string Address { get; set; }
            public string Password { get; set; }
        }

        [HttpPost("customers/register")]
        public IActionResult CustomerRegister([FromBody] RegisterRequest request)
        {
            if (request == null || string.IsNullOrEmpty(request.FullName) || string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
            {
                return BadRequest(new { message = "Vui lòng điền đầy đủ họ tên, email và mật khẩu" });
            }

            // Kiểm tra email đã được đăng ký chưa
            bool emailExists = _context.Customers.Any(c => c.Email == request.Email);
            if (emailExists)
            {
                return Conflict(new { message = "Email này đã được đăng ký trong hệ thống" });
            }

            var newCustomer = new Customer
            {
                FullName = request.FullName,
                Email = request.Email,
                Phone = request.Phone,
                Address = request.Address,
                Password = request.Password
            };

            _context.Customers.Add(newCustomer);
            _context.SaveChanges();

            return Ok(new {
                newCustomer.Id,
                Name = newCustomer.FullName,
                newCustomer.Email,
                newCustomer.Phone,
                newCustomer.Address
            });
        }

        // =========================================================================
        // 5. CỤM API XỬ LÝ ĐƠN HÀNG (ORDERS & ORDER DETAILS API)
        // =========================================================================
        
        public class OrderDetailDto
        {
            public int ProductId { get; set; }
            public int Quantity { get; set; }
            public decimal Price { get; set; }
        }

        public class OrderRequest
        {
            public int? CustomerId { get; set; }
            public string CustomerName { get; set; }
            public string Phone { get; set; }
            public string Address { get; set; }
            public string Notes { get; set; }
            public List<OrderDetailDto> OrderDetails { get; set; }
        }

        [HttpPost("orders")]
        public IActionResult CreateOrder([FromBody] OrderRequest request)
        {
            if (request == null || request.OrderDetails == null || !request.OrderDetails.Any())
            {
                return BadRequest(new { message = "Thông tin đơn hàng không hợp lệ" });
            }

            // Tìm hoặc gán khách hàng
            int finalCustomerId = 0;
            if (request.CustomerId.HasValue && request.CustomerId.Value > 0)
            {
                var existing = _context.Customers.Find(request.CustomerId.Value);
                if (existing != null)
                {
                    finalCustomerId = existing.Id;
                    // Cập nhật số điện thoại và địa chỉ mới nhất từ form nếu cần
                    if (string.IsNullOrEmpty(existing.Phone) || existing.Phone != request.Phone)
                        existing.Phone = request.Phone;
                    if (string.IsNullOrEmpty(existing.Address) || existing.Address != request.Address)
                        existing.Address = request.Address;
                    _context.SaveChanges();
                }
            }
            
            if (finalCustomerId == 0)
            {
                // Nếu chưa đăng nhập, kiểm tra theo số điện thoại đã tồn tại trong DB chưa
                var existingCustomer = _context.Customers.FirstOrDefault(c => c.Phone == request.Phone);
                if (existingCustomer != null)
                {
                    finalCustomerId = existingCustomer.Id;
                }
                else
                {
                    // Tạo một Customer vãng lai mới
                    var newCust = new Customer {
                        FullName = request.CustomerName,
                        Phone = request.Phone,
                        Address = request.Address,
                        Email = request.Phone + "@guest-aura.com",
                        Password = "guestpassword"
                    };
                    _context.Customers.Add(newCust);
                    _context.SaveChanges();
                    finalCustomerId = newCust.Id;
                }
            }

            // Tạo Order mới
            var order = new Order {
                CustomerId = finalCustomerId,
                OrderDate = DateTime.Now,
                Status = 0, // Chờ duyệt
                Notes = request.Notes
            };

            _context.Orders.Add(order);
            _context.SaveChanges();

            // Tạo các OrderDetail
            foreach (var item in request.OrderDetails)
            {
                var detail = new OrderDetail {
                    OrderId = order.Id,
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                    UnitPrice = item.Price
                };
                _context.OrderDetails.Add(detail);
                
                // Trừ số lượng tồn kho sản phẩm nếu có
                var product = _context.Products.Find(item.ProductId);
                if (product != null)
                {
                    product.StockQuantity = Math.Max(0, product.StockQuantity - item.Quantity);
                }
            }
            
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetOrderInfo), new { id = order.Id }, new {
                order.Id,
                order.OrderDate,
                order.CustomerId,
                order.Status,
                order.Notes,
                CustomerName = request.CustomerName,
                TotalAmount = request.OrderDetails.Sum(d => d.Price * d.Quantity)
            });
        }

        [HttpGet("orders/{id}")]
        public IActionResult GetOrderInfo(int id)
        {
            var order = _context.Orders
                .Include(o => o.OrderDetails)
                .ThenInclude(od => od.Product)
                .FirstOrDefault(o => o.Id == id);
            
            if (order == null) return NotFound();

            var result = new {
                order.Id,
                OrderDate = order.OrderDate.ToString("dd/MM/yyyy HH:mm"),
                order.CustomerId,
                order.Status,
                order.Notes,
                TotalAmount = order.OrderDetails.Sum(od => od.Quantity * od.UnitPrice),
                Details = order.OrderDetails.Select(od => new {
                    od.ProductId,
                    ProductName = od.Product != null ? od.Product.Name : "Sản phẩm đã xóa",
                    ImageUrl = od.Product != null ? od.Product.ImageUrl : "",
                    od.Quantity,
                    od.UnitPrice
                })
            };

            return Ok(result);
        }

        [HttpGet("customers/{customerId}/orders")]
        public IActionResult GetCustomerOrders(int customerId)
        {
            var orders = _context.Orders
                .Include(o => o.OrderDetails)
                .ThenInclude(od => od.Product)
                .Where(o => o.CustomerId == customerId)
                .OrderByDescending(o => o.OrderDate)
                .Select(o => new {
                    o.Id,
                    OrderDate = o.OrderDate.ToString("dd/MM/yyyy HH:mm"),
                    o.Status,
                    TotalAmount = o.OrderDetails.Sum(od => od.Quantity * od.UnitPrice),
                    ItemCount = o.OrderDetails.Sum(od => od.Quantity),
                    Details = o.OrderDetails.Select(od => new {
                        od.ProductId,
                        ProductName = od.Product != null ? od.Product.Name : "Sản phẩm",
                        ImageUrl = od.Product != null ? od.Product.ImageUrl : ""
                    })
                })
                .ToList();

            return Ok(orders);
        }
    }
}
