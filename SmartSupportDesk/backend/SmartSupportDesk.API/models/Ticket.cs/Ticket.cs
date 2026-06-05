using System.ComponentModel.DataAnnotations;

namespace SmartSupportDesk.API.Models
{
    public class Ticket
    {
        // Primary Key
        public int Id { get; set; }

        // Required fields for creating a ticket
        [Required(ErrorMessage = "Title is required")]
        public string Title { get; set; } = "";

        [Required(ErrorMessage = "Description is required")]
        public string Description { get; set; } = "";

        // Auto-generated fields (set in controller)
        public string TicketNumber { get; set; } = "";       // e.g., "TKT-637xxxxx"
        public string Status { get; set; } = "Pending";      // Default when created
        public string Category { get; set; } = "";           // Set by AI analysis
        public string Priority { get; set; } = "";           // Set by AI analysis
        public string AISuggestion { get; set; } = "";       // AI suggested resolution
        public string ResolutionNotes { get; set; } = "";    // AI suggestion + duplicate info
        public string AttachmentPath { get; set; } = "";     // File name if uploaded

        // Time info
        public DateTime CreatedAt { get; set; }              // Set to UTC now
        public DateTime? DueDate { get; set; }               // Set based on priority

        // Comments (optional, empty list by default)
        public List<Comment> Comments { get; set; } = new List<Comment>();
    }
}