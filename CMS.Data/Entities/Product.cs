//sinh vien: trieu quoc huy
//mssv:2123110151
//ngay tao:15/5/26
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CMS.Data.Entities
{
    public class Product
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Tên sản phẩm không được để trống")]
        public string Name { get; set; }

        public string? Description { get; set; }

        [Range(0, double.MaxValue)]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        public int StockQuantity { get; set; }

        public string? ImageUrl { get; set; }

        // Khóa ngoại nối tới CategoryProduct
        public int CategoryProductId { get; set; }

        [ForeignKey("CategoryProductId")]
        public virtual CategoryProduct? CategoryProduct { get; set; }

        // Khóa ngoại nối tới Bảng Màu (Color)
        public int? ColorId { get; set; }

        [ForeignKey("ColorId")]
        public virtual Color? Color { get; set; }

        // Danh sách nhiều màu sắc
        public virtual ICollection<ProductColor>? ProductColors { get; set; }

        // Đánh dấu đã xóa tạm thời (Thùng rác)
        public bool IsDeleted { get; set; } = false;

        // Lưu trữ ma trận tồn kho biến thể Màu sắc + GB (JSON)
        public string? VariantInventories { get; set; }
    }
}

