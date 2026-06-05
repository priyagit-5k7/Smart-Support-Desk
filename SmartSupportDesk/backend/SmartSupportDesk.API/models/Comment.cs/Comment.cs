using System;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace SmartSupportDesk.API.Models
{
    public class Comment
    {
        public int Id { get; set; }

        [Required]
        public string CommentText { get; set; } = "";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Required]
        public int TicketId { get; set; }

        [JsonIgnore]
        public Ticket? Ticket { get; set; }
    }
}