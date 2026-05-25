using System.ComponentModel.DataAnnotations;

namespace SmartSupportDesk.API.DTOs
{
    public class TicketCreateDto
    {
        [Required]
        public string TicketType { get; set; } = null!;

        [Required]
        public string Subject { get; set; } = null!;

        [Required]
        public string Description { get; set; } = null!;
    }
}