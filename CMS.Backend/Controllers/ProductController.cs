using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using System.Linq;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProductsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // API lấy toàn bộ sản phẩm và số lượng tồn kho (GET: api/products)
        [HttpGet]
        public IActionResult GetAllProducts()
        {
            var products = _context.Products
                .OrderByDescending(p => p.Id)
                .Select(p => new {
                    p.Id,
                    p.Name,
                    p.Description,
                    p.Price,
                    p.StockQuantity,
                    p.ImageUrl,
                    CategoryName = p.CategoryProduct.Name // Lấy tên danh mục sản phẩm
                })
                .ToList();

            return Ok(products);
        }
    }
}