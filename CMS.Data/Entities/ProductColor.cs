using System.ComponentModel.DataAnnotations.Schema;

namespace CMS.Data.Entities
{
    public class ProductColor
    {
        public int ProductId { get; set; }
        
        [ForeignKey("ProductId")]
        public virtual Product? Product { get; set; }

        public int ColorId { get; set; }
        
        [ForeignKey("ColorId")]
        public virtual Color? Color { get; set; }

        public string? ImageUrl { get; set; }
    }
}
