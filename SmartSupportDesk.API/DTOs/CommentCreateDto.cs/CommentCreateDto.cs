using System.ComponentModel.DataAnnotations;

namespace SmartSupportDesk.API.DTOs
{
    public class CommentCreateDto
    {
        [Required]
        public string CommentText { get; set; } = null!;

        [Required]
        public int TicketId { get; set; }
    }
}