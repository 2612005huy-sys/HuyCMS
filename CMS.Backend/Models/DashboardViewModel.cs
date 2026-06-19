using CMS.Data.Entities;
using System.Collections.Generic;

namespace CMS.Backend.Models
{
    public class DashboardViewModel
    {
        public decimal TotalRevenue { get; set; }
        public int TotalOrders { get; set; }
        public int TotalCustomers { get; set; }
        public int TotalProducts { get; set; }
        
        public List<Order> RecentOrders { get; set; } = new List<Order>();
        public List<Post> RecentPosts { get; set; } = new List<Post>();
    }
}
