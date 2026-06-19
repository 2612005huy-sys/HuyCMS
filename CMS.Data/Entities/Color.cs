using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace CMS.Data.Entities
{
    public class Color
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Tên màu không được để trống")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Mã màu Hex không được để trống")]
        public string HexCode { get; set; }

        public virtual ICollection<Product>? Products { get; set; }
    }
}
