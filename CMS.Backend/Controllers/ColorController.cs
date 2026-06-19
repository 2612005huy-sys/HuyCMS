using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using CMS.Data.Entities;
using System.Linq;

namespace CMS.Backend.Controllers
{
    [Authorize(Roles = "Admin")]
    public class ColorController : Controller
    {
        private readonly ApplicationDbContext _context;

        public ColorController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: /Color
        public IActionResult Index()
        {
            var colors = _context.Colors.ToList();
            return View(colors);
        }

        // GET: /Color/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: /Color/Create
        [HttpPost]
        public IActionResult Create(Color model)
        {
            if (ModelState.IsValid)
            {
                _context.Colors.Add(model);
                _context.SaveChanges();
                TempData["SuccessMessage"] = "Đã thêm màu sắc mới thành công!";
                return RedirectToAction("Index");
            }
            return View(model);
        }

        // GET: /Color/Edit/5
        public IActionResult Edit(int id)
        {
            var color = _context.Colors.Find(id);
            if (color == null) return NotFound();
            return View(color);
        }

        // POST: /Color/Edit/5
        [HttpPost]
        public IActionResult Edit(Color model)
        {
            if (ModelState.IsValid)
            {
                _context.Colors.Update(model);
                _context.SaveChanges();
                TempData["SuccessMessage"] = "Cập nhật màu sắc thành công!";
                return RedirectToAction("Index");
            }
            return View(model);
        }

        // GET: /Color/Delete/5
        public IActionResult Delete(int id)
        {
            var color = _context.Colors.Find(id);
            if (color != null)
            {
                // Kiểm tra xem màu này có đang được sử dụng ở sản phẩm nào không
                bool isInUse = _context.Products.Any(p => p.ColorId == id);
                if (isInUse)
                {
                    TempData["ErrorMessage"] = "Không thể xóa màu này vì đang có sản phẩm sử dụng!";
                    return RedirectToAction("Index");
                }

                _context.Colors.Remove(color);
                _context.SaveChanges();
                TempData["SuccessMessage"] = "Đã xóa màu sắc!";
            }
            return RedirectToAction("Index");
        }

        // =========================================================================
        // 🌟 CÁC CỔNG API TRẢ VỀ DỮ LIỆU JSON (PHỤC VỤ REACTJS)
        // =========================================================================
        [HttpGet]
        [AllowAnonymous]
        [Route("/api/colors")]
        public IActionResult GetColorsApi()
        {
            var colors = _context.Colors
                .Select(c => new {
                    c.Id,
                    c.Name,
                    c.HexCode
                })
                .ToList();
            return Ok(colors);
        }
    }
}
