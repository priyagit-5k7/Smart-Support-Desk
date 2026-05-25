using Microsoft.EntityFrameworkCore;
using SmartSupportDesk.API.Models;

namespace SmartSupportDesk.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Ticket> Tickets { get; set; } = null!;
        public DbSet<Comment> Comments { get; set; } = null!;
    }
}